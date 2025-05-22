import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import BarraNavegacion from './componentes/Navbar';
import Footer from './componentes/Footer';
import Panel from './paginas/Panel';
import Login from './paginas/Login';
import Inicio from './paginas/Inicio';
import ForgotPassword from './paginas/ForgotPassword';
import ResetPassword from './paginas/ResetPassword';
import Register from './paginas/Register';
import PrivateRoute from './componentes/PrivateRoute';
import AdminRoute from './componentes/AdminRoute';
import AdminPanel from './paginas/AdminPanel';
import NotFoundPanel from './paginas/NotFoundPanel';
import NotFoundAdmin from './paginas/NotFoundAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilos/App.css';
import ChatBot from './componentes/ChatBot';
import UserProfile from './paginas/UserProfile';

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });
  const navigate = useNavigate();

  const login = () => {
    localStorage.setItem('loggedIn', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('loggedIn');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="page-container">
      <BarraNavegacion isAuthenticated={isAuthenticated} onLogout={logout} />
      <div className="content-wrap">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/panel" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route index element={<Panel />} />
            <Route path="*" element={<NotFoundPanel />} />
          </Route>
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Ruta para el perfil de usuario - Protegida por PrivateRoute */}
          <Route path="/profile" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route index element={<UserProfile />} />
          </Route>
          <Route path="/admin/user-management" element={<AdminRoute />}>
            <Route index element={<AdminPanel />} />
            <Route path="*" element={<NotFoundAdmin />} />
          </Route>
        </Routes>
      </div>
      <Footer />
      <ChatBot />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;