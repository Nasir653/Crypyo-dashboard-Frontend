import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Crypto Dashboard. Powered by CoinGecko API.</span>
    </footer>
  );
}

export default Footer;
