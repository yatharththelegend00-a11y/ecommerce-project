import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Profile from './pages/Profile';

const Layout = ({ children }) => {
  const path = window.location.pathname;
  const isAuthPage = path === '/' || path === '/login' || path === '/register';

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {!isAuthPage && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {!isAuthPage && <Footer />}
    </Box>
  );
};

function App() {
  const token = localStorage.getItem('token');

  return (
    <GoogleOAuthProvider clientId="877723697920-tk0dibfl8i9eibep7jhrn8s9pjg94h1g.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          <Router>
            <ToastContainer position="top-right" autoClose={2000} theme="colored" />

            <Layout>
              <Routes>
                {/* AUTH */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* PUBLIC / GUEST ALLOWED */}
                <Route path="/home" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />

                {/* LOGIN REQUIRED */}
                <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/orders" element={token ? <Orders /> : <Navigate to="/login" />} />
                <Route path="/admin" element={token ? <Admin /> : <Navigate to="/login" />} />
              </Routes>
            </Layout>

          </Router>
        </CartProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
