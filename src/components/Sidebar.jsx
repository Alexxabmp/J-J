import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, History, Printer, PackageSearch } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar no-print">
      <div className="sidebar-logo-container">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" style={{ width: '56px', height: '56px', objectFit: 'contain', filter: 'var(--logo-filter)', borderRadius: '14px', boxShadow: '0 4px 10px rgba(255, 94, 0, 0.2)' }} />
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">J&J</span>
          <span className="sidebar-logo-subtitle">Rentals</span>
        </div>
      </div>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <PackageSearch size={20} />
          Inventory
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <ShoppingCart size={20} />
          Orders
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <History size={20} />
          History
        </NavLink>
        <NavLink to="/print" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Printer size={20} />
          Print
        </NavLink>
      </nav>
    </aside>
  );
}
