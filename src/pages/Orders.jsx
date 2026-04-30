import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2, CheckCircle, User, MapPin } from 'lucide-react';

export default function Orders() {
  const { orders, updateOrder, deleteOrder, markAsDone } = useContext(AppContext);
  const navigate = useNavigate();

  const handleMarkAsDone = (id) => {
    if (window.confirm('Are you sure you want to mark this order as done?')) {
      markAsDone(id);
    }
  };

  const activeOrders = orders.filter(o => o.status === 'Active');

  return (
    <div>
      <div className="flex-header">
        <button className="btn-primary" onClick={() => navigate('/orders/add')}>
          <Plus size={18} /> Add Order
        </button>
      </div>

      <div className="glass data-table-wrapper" style={{ padding: '1rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Service Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <div className="badge light">{order.id}</div>
                </td>
                <td>
                  <div className="customer-cell">
                    <span style={{ fontWeight: '600' }}>{order.customer}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                    <MapPin size={16} />
                    <span>{order.address}</span>
                  </div>
                </td>
                <td>
                  <select 
                    value={order.paymentStatus} 
                    onChange={(e) => updateOrder(order.id, { paymentStatus: e.target.value })}
                    className={`badge ${order.paymentStatus === 'Full' ? 'success' : 'warning'}`}
                    style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Partial">Partial</option>
                    <option value="Full">Full</option>
                  </select>
                </td>
                <td>
                  <select 
                    value={order.deliveryStatus} 
                    onChange={(e) => updateOrder(order.id, { deliveryStatus: e.target.value })}
                    className={`badge ${order.deliveryStatus === 'Delivered' ? 'success' : 'warning'}`}
                    style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Not Yet Delivered">Not Yet</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td>
                  <select 
                    value={order.serviceMethod} 
                    onChange={(e) => updateOrder(order.id, { serviceMethod: e.target.value })}
                    className="badge info"
                    style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Deliver">Deliver</option>
                    <option value="Pick-up">Pick-up</option>
                  </select>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="icon-btn" onClick={() => navigate(`/orders/${order.id}`)} title="View Details">
                      <Eye size={18} />
                    </button>
                    <button className="icon-btn" style={{ color: '#10b981' }} onClick={() => handleMarkAsDone(order.id)} title="Mark as Done">
                      <CheckCircle size={18} />
                    </button>
                    <button className="icon-btn" style={{ color: '#dc2626' }} onClick={() => deleteOrder(order.id)} title="Delete Order">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {activeOrders.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No active orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
