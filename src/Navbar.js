import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-title">🚀 Crypto Dashboard</div>
      <div className="navbar-links">
        <a href="#" className="active">Dashboard</a>
      </div>
    </nav>
  );
}

export default Navbar;
