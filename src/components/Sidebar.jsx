import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, History, Printer, PackageSearch, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useContext(AppContext);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={closeSidebar}
        />
      )}
      
      <aside className={`sidebar no-print ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo-container" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'var(--logo-filter)', borderRadius: '14px', boxShadow: '0 4px 10px rgba(255, 94, 0, 0.2)' }} />
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">J&J</span>
              <span className="sidebar-logo-subtitle">Rentals</span>
            </div>
          </div>
          <button className="icon-btn mobile-close-btn" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>
        <nav>
          <NavLink to="/dashboard" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
          </NavLink>
          <NavLink to="/inventory" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <PackageSearch size={20} />
          Inventory
          </NavLink>
          <NavLink to="/orders" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <ShoppingCart size={20} />
          Orders
          </NavLink>
          <NavLink to="/history" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <History size={20} />
          History
          </NavLink>
          <NavLink to="/print" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Printer size={20} />
            Print
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
