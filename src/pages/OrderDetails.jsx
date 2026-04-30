import { useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isHistory = location.pathname.startsWith('/history');
  const { orders } = useContext(AppContext);

  const order = orders.find(o => o.id === id);

  if (!order) return <div style={{ padding: '2rem' }}>Order not found.</div>;

  return (
    <div>
      <div className="flex-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
        </div>
        {!isHistory && (
          <button className="btn-primary" onClick={() => navigate(`/orders/edit/${id}`)}>
            Edit Order
          </button>
        )}
      </div>

      <div className="glass" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div className="form-grid" style={{ marginBottom: '2rem' }}>
          <div>
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Event ID</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{order.id}</div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Customer Name</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{order.customer}</div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Date Ordered</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{order.dateOrdered}</div>
          </div>
          <div>
            <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>Return Date</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{order.returnDate}</div>
          </div>
        </div>

        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-color)' }}>Items</h3>
        <div className="data-table-wrapper" style={{ marginBottom: '2rem' }}>
          <table className="data-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>₱{item.rate}</td>
                <td>₱{item.amount}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>

        {order.expensesList && order.expensesList.length > 0 && (
          <>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-color)', marginTop: '2.5rem' }}>Expenses</h3>
            <div className="data-table-wrapper" style={{ marginBottom: '2rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Expense Name</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.expensesList.map((exp, idx) => (
                    <tr key={idx}>
                      <td>{exp.name}</td>
                      <td>₱{exp.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
            <span>Total Amount:</span>
            <strong>₱{order.total}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
            <span>Total Expenses:</span>
            <strong>₱{order.expenses}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px', color: '#dc2626', fontWeight: 'bold' }}>
            <span>Net Profit:</span>
            <span>₱{order.netProfit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
