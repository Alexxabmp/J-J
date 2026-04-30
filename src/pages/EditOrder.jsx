import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function EditOrder() {
  const { id } = useParams();
  const { orders, editOrder, inventory } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer: '',
    address: '',
    paymentStatus: 'Partial',
    deliveryStatus: 'Not Yet Delivered',
    serviceMethod: 'Deliver',
    dateOrdered: '',
    returnDate: '',
  });

  const [items, setItems] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const existingOrder = orders.find(o => o.id === id);
    if (existingOrder) {
      setFormData({
        customer: existingOrder.customer || '',
        address: existingOrder.address || '',
        paymentStatus: existingOrder.paymentStatus || 'Partial',
        deliveryStatus: existingOrder.deliveryStatus || 'Not Yet Delivered',
        serviceMethod: existingOrder.serviceMethod || 'Deliver',
        dateOrdered: existingOrder.dateOrdered || '',
        returnDate: existingOrder.returnDate || '',
      });
      setItems(existingOrder.items || []);
      setExpenses(existingOrder.expensesList || [{ name: 'Other', amount: existingOrder.expenses || 0 }]);
    } else {
      navigate('/orders');
    }
  }, [id, orders, navigate]);

  const handleItemSelect = (index, invId) => {
    const invItem = inventory.find(i => i.id === invId);
    const newItems = [...items];
    if (invItem) {
      newItems[index] = { 
        ...newItems[index], 
        id: invItem.id, 
        description: invItem.name, 
        rate: invItem.amount,
        amount: Number(newItems[index].quantity) * Number(invItem.amount) 
      };
    } else {
      newItems[index] = { ...newItems[index], id: '', description: '', rate: 0, amount: 0 };
    }
    setItems(newItems);
  };

  const updateItemQty = (index, qty) => {
    const newItems = [...items];
    newItems[index].quantity = qty;
    newItems[index].amount = Number(qty) * Number(newItems[index].rate);
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateExpense = (index, field, value) => {
    const newExp = [...expenses];
    newExp[index][field] = value;
    setExpenses(newExp);
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const netProfit = totalAmount - totalExpenses;

    editOrder(id, {
      ...formData,
      items,
      expensesList: expenses,
      expenses: totalExpenses,
      total: totalAmount,
      netProfit
    });

    navigate(`/orders/${id}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>Edit Order {id}</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Customer Name</label>
            <input required className="input-field" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />
          </div>
          <div>
            <label>Address</label>
            <input required className="input-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>
          <div>
            <label>Date Ordered</label>
            <input type="date" required className="input-field" value={formData.dateOrdered} onChange={e => setFormData({...formData, dateOrdered: e.target.value})} />
          </div>
          <div>
            <label>Return Date</label>
            <input type="date" required className="input-field" value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} />
          </div>
          <div>
            <label>Payment Status</label>
            <select className="input-field" value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
              <option value="Partial">Partial</option>
              <option value="Full">Full</option>
            </select>
          </div>
          <div>
            <label>Delivery Status</label>
            <select className="input-field" value={formData.deliveryStatus} onChange={e => setFormData({...formData, deliveryStatus: e.target.value})}>
              <option value="Not Yet Delivered">Not Yet Delivered</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label>Service Method</label>
            <select className="input-field" value={formData.serviceMethod} onChange={e => setFormData({...formData, serviceMethod: e.target.value})}>
              <option value="Deliver">Deliver</option>
              <option value="Pick-up">Pick-up</option>
            </select>
          </div>
        </div>

        <h3 style={{ margin: '1.5rem 0 1rem 0' }}>Items</h3>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <select className="input-field" style={{ margin: 0 }} value={item.id} onChange={e => handleItemSelect(idx, e.target.value)} required>
              <option value="" disabled>Select Item</option>
              {inventory.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.name}</option>
              ))}
            </select>
            <input type="number" placeholder="Qty" required className="input-field" style={{ margin: 0 }} value={item.quantity} onChange={e => updateItemQty(idx, e.target.value)} min="1" />
            <input type="number" disabled className="input-field" style={{ margin: 0, opacity: 0.7 }} value={item.rate} />
            <div style={{ padding: '10px' }}>₱{item.amount}</div>
            <button type="button" className="icon-btn" style={{ color: '#dc2626' }} onClick={() => removeItem(idx)}><Trash2 size={20} /></button>
          </div>
        ))}
        <button type="button" className="btn-outline" onClick={() => setItems([...items, { id: '', description: '', quantity: 1, rate: 0, amount: 0 }])}>
          <Plus size={16} /> Add Item
        </button>

        <h3 style={{ margin: '2rem 0 1rem 0' }}>Expenses Breakdown</h3>
        {expenses.map((exp, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <input type="text" placeholder="Expense Name (e.g. Gas, Helper)" required className="input-field" style={{ margin: 0 }} value={exp.name} onChange={e => updateExpense(idx, 'name', e.target.value)} />
            <input type="number" placeholder="Amount (₱)" required className="input-field" style={{ margin: 0 }} value={exp.amount} onChange={e => updateExpense(idx, 'amount', e.target.value)} min="0" />
            <button type="button" className="icon-btn" style={{ color: '#dc2626' }} onClick={() => removeExpense(idx)}><Trash2 size={20} /></button>
          </div>
        ))}
        <button type="button" className="btn-outline" onClick={() => setExpenses([...expenses, { name: '', amount: 0 }])}>
          <Plus size={16} /> Add Expense
        </button>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--primary-orange-light)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total Items Amount: <span style={{ color: 'var(--text-color)' }}>₱{items.reduce((s, i) => s + i.amount, 0)}</span></div>
            <div style={{ color: '#dc2626', fontWeight: 'bold', marginTop: '0.5rem' }}>Total Expenses: ₱{expenses.reduce((s, e) => s + Number(e.amount), 0)}</div>
          </div>
          <div style={{ fontSize: '1.8rem', color: 'var(--primary-orange)', fontWeight: 'bold' }}>
            Net Profit: ₱{items.reduce((s, i) => s + i.amount, 0) - expenses.reduce((s, e) => s + Number(e.amount), 0)}
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
