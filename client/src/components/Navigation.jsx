import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Calendar, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { logout, user } = useAuth();

  return (
    <nav className="side-nav">
      <div className="nav-logo">
        <div className="logo-icon">V</div>
        <span>Venture</span>
      </div>

      <div className="nav-links">
        <NavLink to="/feed" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Feed</span>
        </NavLink>
        <NavLink to="/discover" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Compass size={20} />
          <span>Discover</span>
        </NavLink>
        <NavLink to="/bookings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={20} />
          <span>Bookings</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <UserIcon size={20} />
          <span>Profile</span>
        </NavLink>
      </div>

      <div className="nav-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <UserIcon size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Traveler'}</span>
            <span className="user-status">Online</span>
          </div>
        </div>
        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
