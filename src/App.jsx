import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Dashboard from './pages/Dashboard';
import Splash from './pages/Splash';
import Inventory from './pages/Inventory';
import AddInventoryItem from './pages/AddInventoryItem';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AddOrder from './pages/AddOrder';
import EditOrder from './pages/EditOrder';
import History from './pages/History';
import PrintInvoice from './pages/PrintInvoice';

function App() {
  return (
    <BrowserRouter>
      <div className="layout-container">
        <Sidebar />
        <div className="main-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/add" element={<AddInventoryItem />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/add" element={<AddOrder />} />
              <Route path="/orders/edit/:id" element={<EditOrder />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/history" element={<History />} />
              <Route path="/history/:id" element={<OrderDetails />} />
              <Route path="/print" element={<PrintInvoice />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
