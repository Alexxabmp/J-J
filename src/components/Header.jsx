import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Moon, Sun, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const { theme, setTheme, isSidebarOpen, setSidebarOpen } = useContext(AppContext);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/inventory/add')) return 'Add Inventory Item';
    if (path.startsWith('/inventory')) return 'Inventory';
    if (path.startsWith('/orders/add')) return 'Add Order';
    if (path.startsWith('/orders/edit')) return 'Edit Order';
    if (path.startsWith('/orders/') && path !== '/orders') return 'Order Details';
    if (path.startsWith('/orders')) return 'Orders';
    if (path.startsWith('/history')) return 'History';
    if (path.startsWith('/print')) return 'Print Invoice';
    return 'Dashboard';
  };

  if (location.pathname === '/') return null;

  return (
    <header className="header no-print">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="icon-btn mobile-menu-btn" 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0, fontSize: '1.75rem' }}>{getPageTitle()}</h1>
      </div>
      <button 
        className="icon-btn" 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </header>
  );
}
