import { Link, NavLink } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200);
    setSolid(y > 40);
  });

  return (
    <motion.header
      className={`nav ${solid ? "nav--solid" : ""}`}
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to="/" className="brand">
        <span className="brand-dot" /> Lumen
      </Link>
      <nav className="nav-links">
        <NavLink to="/" end>Journal</NavLink>
        <Link to="/#stories">Stories</Link>
        <NavLink to="/about">About</NavLink>
      </nav>
    </motion.header>
  );
}
