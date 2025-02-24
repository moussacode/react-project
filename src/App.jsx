
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './page/LandingPage';
import AdminDashboard from './page/AdminDashboard';
import SellerSpace from './page/SellerSpace';
import ClientShop from './page/ClientShop';
import LoginPage from './page/LoginPage';
import RegisterPage from './page/RegisterPage';
import LandingPage from './page/LandingPage';



function App () {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/vendeur" element={<SellerSpace />} />
        <Route path="/boutique" element={<ClientShop />} />
      </Routes>
    </Router>
  );
}
export default App;