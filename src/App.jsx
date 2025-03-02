
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './page/LandingPage';
import AdminDashboard from './page/AdminDashboard';
import SellerSpace from './page/SellerSpace';
import ClientShop from './page/ClientShop';
import LoginPage from './page/LoginPage';
import RegisterPage from './page/RegisterPage';
import LandingPage from './page/LandingPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';



function App () {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["vendeur"]} />}>
          <Route path="/vendeur" element={<SellerSpace />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
          <Route path="/boutique" element={<ClientShop />} />
        </Route>
      </Routes>
    </AuthProvider>
  </Router>
  );
}
export default App;