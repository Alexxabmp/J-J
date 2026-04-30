import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AddInventoryItem() {
  const { addInventoryItem } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    amount: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addInventoryItem(formData);
    navigate('/inventory');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>Add Inventory Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', maxWidth: '500px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>Item Name</label>
            <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label>Quantity</label>
            <input type="number" required className="input-field" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
          </div>
          <div>
            <label>Amount / Rate (₱)</label>
            <input type="number" required className="input-field" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary">Save Item</button>
          </div>
        </div>
      </form>
    </div>
  );
}
