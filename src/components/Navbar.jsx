import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className={`navbar-luxury navbar navbar-expand-lg${scrolled ? ' scrolled' : ''}`}>
      <div className="container-fluid px-5">
        <Link className="navbar-brand" to="/">
          <img src="/images/pankaj-biswas-logo.svg" alt="Pankaj Biswas" className="navbar-logo-large" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className={isActive('/')} to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li className="nav-item"><Link className={isActive('/about')} to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li className="nav-item"><a className="nav-link" href="/#expertise" onClick={() => setMenuOpen(false)}>Expertise</a></li>
            <li className="nav-item"><Link className={isActive('/projects')} to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link></li>
            <li className="nav-item"><Link className={isActive('/blogs')} to="/blogs" onClick={() => setMenuOpen(false)}>Blog</Link></li>
            <li className="nav-item"><Link className={isActive('/stories')} to="/stories" onClick={() => setMenuOpen(false)}>Stories</Link></li>
          </ul>
          <Link to="/contact" className="btn btn-gold ms-4" onClick={() => setMenuOpen(false)}>Get In Touch</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
