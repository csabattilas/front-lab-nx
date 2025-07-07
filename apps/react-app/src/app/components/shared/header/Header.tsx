import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.scss';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Hamburger Menu Button on the left */}
        <button
          className={`menu-button ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="logo">
          <h1>Front lab</h1>
        </div>

        {/* Empty div to maintain flex spacing */}
        <div className="spacer"></div>

        {/* Navigation Menu */}
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/locked-selection" onClick={closeMenu}>
            Lion locked selection
          </NavLink>
        </nav>

        {/* Overlay for mobile menu */}
        {isMenuOpen && (
          <div
            className="menu-overlay"
            onClick={closeMenu}
            tabIndex={0}
            onKeyDown={closeMenu}
          ></div>
        )}
      </div>
    </header>
  );
};

export default Header;
