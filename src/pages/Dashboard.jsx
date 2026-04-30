import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Truck, Clock, Package, Layers, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { orders, inventory } = useContext(AppContext);
  const [invTab, setInvTab] = useState('All');
  
  const activeOrders = orders.filter(o => o.status === 'Active');
  const totalProducts = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + (Number(i.quantity) || 0), 0), 0);
  const totalVolume = inventory.reduce((sum, i) => sum + Number(i.quantity), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  
  const lowStockThreshold = totalVolume * 0.3;
  const lowStockItems = inventory.filter(i => i.quantity <= lowStockThreshold);
  const lowStock = lowStockItems.length;

  const deliveryCounts = {
    notYet: activeOrders.filter(o => o.deliveryStatus === 'Not Yet Delivered').length,
    arrived: activeOrders.filter(o => o.deliveryStatus === 'Delivered').length,
  };

  const recentActivity = activeOrders.slice(-3).reverse().map(o => ({
    id: o.id,
    text: `Order Created for ${o.customer}`,
    status: o.deliveryStatus,
    time: 'Just now'
  }));

  const filteredInventory = inventory.filter(item => {
    if (invTab === 'In Stock') return item.quantity > 0;
    if (invTab === 'Low Stock') return item.quantity <= lowStockThreshold;
    return true;
  }).slice(0, 4);

  return (
    <div style={{ padding: '1rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8, marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Total Products</span>
            <div style={{ background: 'var(--primary-color-light)', padding: '8px', borderRadius: '10px', color: 'var(--primary-color)' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{totalProducts}</div>
        </div>

        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8, marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Total Volume</span>
            <div style={{ background: 'var(--primary-color-light)', padding: '8px', borderRadius: '10px', color: 'var(--primary-color)' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{totalVolume}</div>
        </div>

        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8, marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Total Revenue</span>
            <div style={{ background: 'var(--primary-color-light)', padding: '8px', borderRadius: '10px', color: 'var(--primary-color)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>₱{totalRevenue.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }}>+8%</span>
            <span style={{ opacity: 0.6, fontWeight: '500' }}>from last quarter</span>
          </div>
        </div>

        <div className="dashboard-card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'linear-gradient(145deg, rgba(239,68,68,0.05) 0%, rgba(255,255,255,0.4) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ef4444', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Low Stock Alerts</span>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '8px', borderRadius: '10px', color: '#ef4444' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ef4444' }}>{lowStock}</div>
          <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: '600', marginTop: '0.5rem' }}>Needs Attention</div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontWeight: '600' }}>Recent Activity</h3>
            <Clock size={16} style={{ opacity: 0.5 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.map((act, i) => (
              <div key={i} className="dashboard-card-inner">
                 <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', marginTop: '6px', boxShadow: '0 0 10px var(--primary-color)' }}></div>
                  <div style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
                    <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Order Added</span> <span>{act.text}</span> - <span style={{ color: act.status === 'Delivered' ? '#10b981' : '#ef4444', fontWeight: '600', padding: '2px 8px', borderRadius: '12px', backgroundColor: act.status === 'Delivered' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>{act.status}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: '1.25rem', marginTop: '0.25rem' }}>{act.time}</div>
              </div>
            ))}
            {recentActivity.length === 0 && <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>No recent activity.</div>}
          </div>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontWeight: '600' }}>Inventory Levels</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <button className={`tab-btn ${invTab === 'All' ? 'active' : ''}`} onClick={() => setInvTab('All')}>View All</button>
            <button className={`tab-btn ${invTab === 'In Stock' ? 'active' : ''}`} onClick={() => setInvTab('In Stock')}>In Stock</button>
            <button className={`tab-btn ${invTab === 'Low Stock' ? 'active' : ''}`} onClick={() => setInvTab('Low Stock')}>Low Stock</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredInventory.map((item, i) => (
              <div key={i} className="dashboard-card-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', boxShadow: '0 0 10px var(--primary-color)' }}></div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{item.id}</div>
                  </div>
                </div>
                <div style={{ backgroundColor: item.quantity <= lowStockThreshold ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary-color-light)', color: item.quantity <= lowStockThreshold ? '#ef4444' : 'var(--primary-color)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                  {item.quantity} units
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <Truck size={20} style={{ opacity: 0.5 }} />
          <h3 style={{ margin: 0, fontWeight: '600' }}>Delivery Status</h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', justifyContent: 'center' }}>
          
          <div className="status-card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
              <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: '600' }}>Not Yet Delivered</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{deliveryCounts.notYet}</div>
          </div>

          <div className="status-card" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '600' }}>Delivered</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{deliveryCounts.arrived}</div>
          </div>

        </div>
      </div>
    </div>
  );
}
