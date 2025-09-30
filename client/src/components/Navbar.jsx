// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/Navbar.css';

function Navbar() {
  const user = useSelector((state) => state.user.currentUser);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍳</span>
          <span className="logo-text">ReciPedia</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">Explore</Link>
          <Link to="/add" className="nav-link">Share Recipe</Link>
        </div>

        <div className="navbar-wallet">
          <div className="wallet-info">
            <span className="user-avatar">{user.avatar}</span>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="wallet-address">{user.wallet}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;