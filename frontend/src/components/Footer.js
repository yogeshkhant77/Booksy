"use client"

import { ReactComponent as LinkedinIcon } from "../assets/social/linkedin.svg"
import { ReactComponent as InstagramIcon } from "../assets/social/instagram.svg"
import { ReactComponent as XIcon } from "../assets/social/x.svg"
import { ReactComponent as FacebookIcon } from "../assets/social/facebook.svg"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>YK IT Systems</h3>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>
            <a href="tel:+919023831416" className="footer-link">
               +91 9023831416
            </a>
          </p>
          <p>
            <a href="mailto:khantyogesh021@gmail.com" className="footer-link">
               khantyogesh021@gmail.com
            </a>
          </p>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="footer-social">
            <a 
              href="https://www.linkedin.com/in/yogeshkhant19/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link footer-social-icon"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <LinkedinIcon className="footer-social-svg" aria-hidden="true" focusable="false" />
            </a>
            <a 
              href="https://www.instagram.com/yogeshsinhkhant?igsh=bzg4OWFoYnd6eXZv&utm_source=qr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link footer-social-icon"
              aria-label="Instagram"
              title="Instagram"
            >
              <InstagramIcon className="footer-social-svg" aria-hidden="true" focusable="false" />
            </a>
            <a 
              href="https://x.com/yogesh_khant_77?s=21" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link footer-social-icon"
              aria-label="X"
              title="X"
            >
              <XIcon className="footer-social-svg" aria-hidden="true" focusable="false" />
            </a>
            <a 
              href="https://www.facebook.com/share/1JbtkyvkS5/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link footer-social-icon"
              aria-label="Facebook"
              title="Facebook"
            >
              <FacebookIcon className="footer-social-svg" aria-hidden="true" focusable="false" />
            </a>
          </div>
        </div>
        
        <p className="footer-copyright">
          © {new Date().getFullYear()} Booksy. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer

