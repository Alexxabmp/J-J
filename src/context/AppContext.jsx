import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('jj_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ORD-001',
        customer: 'Juan Dela Cruz',
        address: 'Polomolok, South Cotabato',
        paymentStatus: 'Full',
        deliveryStatus: 'Delivered',
        serviceMethod: 'Deliver',
        dateOrdered: '2026-05-01',
        returnDate: '2026-05-03',
        items: [{ description: 'Monoblock Chairs', quantity: 100, rate: 10, amount: 1000 }],
        expenses: 200,
        total: 1000,
        netProfit: 800,
        status: 'Active'
      }
    ];
  });

  const [theme, setTheme] = useState(localStorage.getItem('jj_theme') || 'light');

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('jj_inventory');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'INV-001', name: 'Chairs', quantity: 50, amount: 50 },
      { id: 'INV-002', name: 'Tables', quantity: 8, amount: 150 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('jj_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('jj_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('jj_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const addOrder = (order) => {
    setOrders([...orders, { ...order, id: `ORD-${String(orders.length + 1).padStart(3, '0')}`, status: 'Active' }]);
    
    // Deduct from inventory
    const newInventory = [...inventory];
    if (order.items) {
      order.items.forEach(orderItem => {
        const invItem = newInventory.find(i => i.id === orderItem.id);
        if (invItem) {
          invItem.quantity -= Number(orderItem.quantity);
        }
      });
    }
    setInventory(newInventory);
  };

  const updateOrder = (id, updatedFields) => {
    setOrders(orders.map(o => o.id === id ? { ...o, ...updatedFields } : o));
  };

  const editOrder = (id, updatedOrder) => {
    const oldOrder = orders.find(o => o.id === id);
    if (!oldOrder) return;

    const newInventory = [...inventory];

    // Return old items to inventory
    if (oldOrder.items) {
      oldOrder.items.forEach(oldItem => {
        const invItem = newInventory.find(i => i.id === oldItem.id);
        if (invItem) {
          invItem.quantity += Number(oldItem.quantity);
        }
      });
    }

    // Deduct new items from inventory
    if (updatedOrder.items) {
      updatedOrder.items.forEach(newItem => {
        const invItem = newInventory.find(i => i.id === newItem.id);
        if (invItem) {
          invItem.quantity -= Number(newItem.quantity);
        }
      });
    }

    setInventory(newInventory);
    setOrders(orders.map(o => o.id === id ? { ...o, ...updatedOrder } : o));
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const markAsDone = (id) => {
    const order = orders.find(o => o.id === id);
    if (order && order.status !== 'Done') {
      updateOrder(id, { status: 'Done' });
      
      // Return to inventory
      const newInventory = [...inventory];
      if (order.items) {
        order.items.forEach(orderItem => {
          const invItem = newInventory.find(i => i.id === orderItem.id);
          if (invItem) {
            invItem.quantity += Number(orderItem.quantity);
          }
        });
      }
      setInventory(newInventory);
    }
  };

  const addInventoryItem = (item) => {
    setInventory([...inventory, { ...item, id: `INV-${String(inventory.length + 1).padStart(3, '0')}` }]);
  };

  const updateInventoryItem = (id, updatedFields) => {
    setInventory(inventory.map(i => i.id === id ? { ...i, ...updatedFields } : i));
  };

  const deleteInventoryItem = (id) => {
    setInventory(inventory.filter(i => i.id !== id));
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
