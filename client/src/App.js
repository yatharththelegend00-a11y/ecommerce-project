import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

/* ================= LAYOUT ================= */
const Layout = ({ children }) => {
  const location = useLocation();

  // Hide only on auth pages
  const hideLayout =
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {!hideLayout && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {!hideLayout && <Footer />}
    </Box>
  );
};

function App() {
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

                {/* PUBLIC */}
                <Route path="/home" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />

                {/* ✅ GUEST + USER BOTH */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />

                {/* ADMIN */}
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Layout>

          </Router>
        </CartProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
