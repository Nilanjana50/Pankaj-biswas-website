import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer-luxury">
    <div className="container-fluid px-5">
      <div className="footer-main">
        <div className="footer-left">
          <h4>Pankaj Biswas</h4>
          <p>Digital Consultant &amp; Entrepreneur</p>
        </div>
        <div className="footer-right">
          <div className="footer-links">
            <a href="/#expertise">Expertise</a>
            <Link to="/projects">Work</Link>
            <Link to="/stories">Stories</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-socials">
            <a href="#!" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#!" title="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#!" title="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          <a href="mailto:hello@pankajbiswas.com">hello@pankajbiswas.com</a> &bull;
          <a href="tel:+918444833444"> +91-8444833444</a> &bull;
          <a href="tel:+19099085262"> +1-(909)-908-5262</a>
        </p>
        <p>24/38 Jessore Road, 3rd Floor, Kolkata 700028, INDIA</p>
        <p>&copy; 2011 - 26 by Pankaj Biswas</p>
      </div>
    </div>
  </footer>
);

export default Footer;
