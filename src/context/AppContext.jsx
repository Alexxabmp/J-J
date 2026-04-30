import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('jj_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('jj_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Initial Fetch & Auto-migration
  useEffect(() => {
    const fetchAndMigrate = async () => {
      // Fetch Inventory
      const { data: invData } = await supabase.from('inventory').select('*');
      if (invData && invData.length > 0) {
        setInventory(invData.map(d => d.data));
      } else {
        const localInv = JSON.parse(localStorage.getItem('jj_inventory') || '[]');
        if (localInv.length > 0) {
          for (const item of localInv) {
            await supabase.from('inventory').upsert({ id: item.id, data: item });
          }
          setInventory(localInv);
        }
      }

      // Fetch Orders
      const { data: ordData } = await supabase.from('orders').select('*');
      if (ordData && ordData.length > 0) {
        setOrders(ordData.map(d => d.data));
      } else {
        const localOrd = JSON.parse(localStorage.getItem('jj_orders') || '[]');
        if (localOrd.length > 0) {
          for (const order of localOrd) {
            await supabase.from('orders').upsert({ id: order.id, data: order });
          }
          setOrders(localOrd);
        }
      }
    };

    fetchAndMigrate();

    // Setup polling for changes just in case real-time publication isn't fully enabled
    const interval = setInterval(async () => {
      const { data: invData } = await supabase.from('inventory').select('*');
      if (invData) setInventory(invData.map(d => d.data));
      
      const { data: ordData } = await supabase.from('orders').select('*');
      if (ordData) setOrders(ordData.map(d => d.data));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const addOrder = async (order) => {
    const newId = `ORD-${Date.now()}`;
    const newOrder = { ...order, id: newId, status: 'Active' };
    
    // Optimistic UI update
    setOrders(prev => [...prev, newOrder]);
    await supabase.from('orders').upsert({ id: newId, data: newOrder });

    if (order.items) {
      const newInv = [...inventory];
      for (const orderItem of order.items) {
        const invItem = newInv.find(i => i.id === orderItem.id);
        if (invItem) {
          invItem.quantity = Number(invItem.quantity) - Number(orderItem.quantity);
          await supabase.from('inventory').upsert({ id: invItem.id, data: invItem });
        }
      }
      setInventory(newInv);
    }
  };

  const updateOrder = async (id, updatedFields) => {
    const orderToUpdate = orders.find(o => o.id === id);
    if (!orderToUpdate) return;
    
    const newOrder = { ...orderToUpdate, ...updatedFields };
    setOrders(orders.map(o => o.id === id ? newOrder : o));
    await supabase.from('orders').upsert({ id, data: newOrder });
  };

  const editOrder = async (id, updatedOrder) => {
    const oldOrder = orders.find(o => o.id === id);
    if (!oldOrder) return;

    const inventoryDiff = {};
    if (oldOrder.items) {
      oldOrder.items.forEach(i => {
        inventoryDiff[i.id] = (inventoryDiff[i.id] || 0) + Number(i.quantity);
      });
    }
    if (updatedOrder.items) {
      updatedOrder.items.forEach(i => {
        inventoryDiff[i.id] = (inventoryDiff[i.id] || 0) - Number(i.quantity);
      });
    }

    const newInv = [...inventory];
    for (const invId of Object.keys(inventoryDiff)) {
       if (inventoryDiff[invId] !== 0) {
         const invItem = newInv.find(i => i.id === invId);
         if (invItem) {
           invItem.quantity = Number(invItem.quantity) + inventoryDiff[invId];
           await supabase.from('inventory').upsert({ id: invId, data: invItem });
         }
       }
    }
    setInventory(newInv);

    const newOrder = { ...oldOrder, ...updatedOrder };
    setOrders(orders.map(o => o.id === id ? newOrder : o));
    await supabase.from('orders').upsert({ id, data: newOrder });
  };

  const deleteOrder = async (id) => {
    setOrders(orders.filter(o => o.id !== id));
    await supabase.from('orders').delete().eq('id', id);
  };

  const markAsDone = async (id) => {
    const order = orders.find(o => o.id === id);
    if (order && order.status !== 'Done') {
      const newOrder = { ...order, status: 'Done' };
      setOrders(orders.map(o => o.id === id ? newOrder : o));
      await supabase.from('orders').upsert({ id, data: newOrder });
      
      if (order.items) {
        const newInv = [...inventory];
        for (const orderItem of order.items) {
          const invItem = newInv.find(i => i.id === orderItem.id);
          if (invItem) {
             invItem.quantity = Number(invItem.quantity) + Number(orderItem.quantity);
             await supabase.from('inventory').upsert({ id: invItem.id, data: invItem });
          }
        }
        setInventory(newInv);
      }
    }
  };

  const addInventoryItem = async (item) => {
    const newId = `INV-${Date.now()}`;
    const newItem = { ...item, id: newId };
    setInventory(prev => [...prev, newItem]);
    await supabase.from('inventory').upsert({ id: newId, data: newItem });
  };

  const updateInventoryItem = async (id, updatedFields) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newItem = { ...item, ...updatedFields };
    setInventory(inventory.map(i => i.id === id ? newItem : i));
    await supabase.from('inventory').upsert({ id, data: newItem });
  };

  const deleteInventoryItem = async (id) => {
    setInventory(inventory.filter(i => i.id !== id));
    await supabase.from('inventory').delete().eq('id', id);
  };

  return (
    <AppContext.Provider value={{ 
      orders, addOrder, updateOrder, editOrder, deleteOrder, markAsDone, 
      theme, setTheme,
      inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem
    }}>
      {children}
    </AppContext.Provider>
  );
};
