import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useContext(AppContext);

  const order = orders.find(o => o.id === id);

  if (!order) return <div style={{ padding: '2rem' }}>Order not found.</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>Order Details</h1>
        </div>
        <button className="btn-primary" onClick={() => navigate(`/orders/edit/${id}`)}>
          Edit Order
        </button>
      </div>

      <div className="glass" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
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

        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-orange)' }}>Items</h3>
        <table className="data-table" style={{ marginBottom: '2rem' }}>
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

        {order.expensesList && order.expensesList.length > 0 && (
          <>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-orange)', marginTop: '2rem' }}>Expenses</h3>
            <table className="data-table" style={{ marginBottom: '2rem' }}>
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
                    <td style={{ color: '#dc2626' }}>₱{exp.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
            <span>Total Amount:</span>
            <strong>₱{order.total}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
            <span style={{ color: '#dc2626' }}>Total Expenses:</span>
            <strong style={{ color: '#dc2626' }}>₱{order.expenses}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px', fontSize: '1.2rem', color: 'var(--primary-orange)' }}>
            <span>Net Profit:</span>
            <strong>₱{order.netProfit}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
