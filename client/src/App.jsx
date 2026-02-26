import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Navigation from './components/Navigation';
import Feed from './components/Feed';
import Discover from './components/Discover';
import Bookings from './components/Bookings';
import ProfilePage from './components/ProfilePage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-shell">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <>
                  <Navigation />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Feed />} />
                      <Route path="/feed" element={<Feed />} />
                      <Route path="/discover" element={<Discover />} />
                      <Route path="/bookings" element={<Bookings />} />
                      <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                  </main>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
