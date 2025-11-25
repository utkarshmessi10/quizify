import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import { BookOpen, User, LogOut, Menu, X, Shield, Home, Users } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
          <BookOpen className="brand-icon" />
          <span className="brand-text">Quizify</span>
        </Link>

        <div className="navbar-desktop">
          {isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActivePath('/') ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <Home size={18} />
                Home
              </Link>
              <Link 
                to="/quizzes" 
                className={`nav-link ${isActivePath('/quizzes') ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <BookOpen size={18} />
                Quizzes
              </Link>
              <Link 
                to="/attempts" 
                className={`nav-link ${isActivePath('/attempts') ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <Users size={18} />
                My Attempts
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`nav-link admin-link ${isActivePath('/admin') ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <Shield size={18} />
                  Admin
                </Link>
              )}
              
              <div className="navbar-user">
                <div className="user-info">
                  <User className="user-icon" />
                  <span className="user-name">{user?.name}</span>
                  {isAdmin && <span className="admin-badge">Admin</span>}
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  icon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link 
                to="/login"
                className={`nav-link ${isActivePath('/login') ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                Login
              </Link>
              <Link to="/register" onClick={handleLinkClick}>
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            <div className="mobile-user-info">
              <User className="user-icon" />
              <div>
                <span className="user-name">{user?.name}</span>
                {isAdmin && <span className="admin-badge">Admin</span>}
              </div>
            </div>
            
            <Link 
              to="/" 
              className={`mobile-nav-link ${isActivePath('/') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <Home size={18} />
              Home
            </Link>
            <Link 
              to="/quizzes" 
              className={`mobile-nav-link ${isActivePath('/quizzes') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <BookOpen size={18} />
              Quizzes
            </Link>
            <Link 
              to="/attempts" 
              className={`mobile-nav-link ${isActivePath('/attempts') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <Users size={18} />
              My Attempts
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`mobile-nav-link admin-link ${isActivePath('/admin') ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <Shield size={18} />
                Admin Dashboard
              </Link>
            )}
            
            <button className="mobile-logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login"
              className={`mobile-nav-link ${isActivePath('/login') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Login
            </Link>
            <Link 
              to="/register"
              className={`mobile-nav-link ${isActivePath('/register') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;