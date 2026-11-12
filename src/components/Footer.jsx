import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-big">
        <span>Look</span> <em>closer.</em>
      </div>
      <div className="footer-row">
        <Link to="/" className="brand">
          <span className="brand-dot" /> Lumen
        </Link>
        <p className="muted">Photography from Unsplash &amp; Picsum contributors. © {new Date().getFullYear()} Lumen Journal.</p>
      </div>
    </footer>
  );
}
