import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function Inventory() {
  const { inventory, deleteInventoryItem, updateInventoryItem } = useContext(AppContext);
  const navigate = useNavigate();

  const handleEdit = (item) => {
    const newQty = prompt(`Edit Quantity for ${item.name}:`, item.quantity);
    if (newQty !== null) {
      const newAmt = prompt(`Edit Amount for ${item.name}:`, item.amount);
      if (newAmt !== null) {
        updateInventoryItem(item.id, { 
          quantity: Number(newQty), 
          amount: Number(newAmt) 
        });
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn-primary" onClick={() => navigate('/inventory/add')}>
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="glass data-table-wrapper" style={{ padding: '1rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Amount (₱)</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₱{item.amount}</td>
                <td>₱{Number(item.quantity) * Number(item.amount)}</td>
                <td>
                  <div className="actions-cell">
                    <button className="icon-btn" onClick={() => handleEdit(item)} title="Edit Item">
                      <Edit size={18} />
                    </button>
                    <button className="icon-btn" style={{ color: '#dc2626' }} onClick={() => deleteInventoryItem(item.id)} title="Delete Item">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No items in inventory.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
