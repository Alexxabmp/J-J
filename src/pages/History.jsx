import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';

export default function History() {
  const { orders, deleteOrder } = useContext(AppContext);
  const navigate = useNavigate();

  const doneOrders = orders.filter(o => o.status === 'Done');

  return (
    <div>
      <h1 className="page-title">Order History</h1>

      <div className="glass data-table-wrapper" style={{ padding: '1rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date Ordered</th>
              <th>Total Amount</th>
              <th>Net Profit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doneOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.dateOrdered}</td>
                <td>₱{order.total}</td>
                <td>₱{order.netProfit}</td>
                <td>
                  <div className="actions-cell">
                    <button className="icon-btn" onClick={() => navigate(`/orders/${order.id}`)} title="View Details">
                      <Eye size={18} />
                    </button>
                    <button className="icon-btn" style={{ color: '#dc2626' }} onClick={() => deleteOrder(order.id)} title="Delete Order">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {doneOrders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No history found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
