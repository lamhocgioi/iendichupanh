// components/Footer.tsx - Component footer tách riêng
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h3>Liên hệ</h3>
          <div className="contact-vertical">
            <p><i className="fas fa-phone"></i> 0906 283 508</p>
            <p><i className="fas fa-envelope"></i> yenvo1204200@gmail.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Thành Phố Đà Nẵng</p>
          </div>
          <div className="contact-horizontal">
            <span><i className="fas fa-phone"></i> 0906 283 508</span>
            <span><i className="fas fa-envelope"></i> yenvo1204200@gmail.com</span>
            <span><i className="fas fa-map-marker-alt"></i> Thành Phố Đà Nẵng</span>
          </div>
        </div>
        <div className="footer-right">
          <h3>Kết nối với IEN</h3>
          <div className="footer-social-icons">
            <a href="https://facebook.com/nuhygz" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com/ienxan_" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://tiktok.com/@iendichupanh_" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 IENDICHUPANH. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;