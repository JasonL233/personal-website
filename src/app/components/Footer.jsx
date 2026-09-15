import React from "react";

const Footer = () => {
  return (
    <footer className="footer border z-10 border-t-[var(--border)] border-b-[var(--border)] border-l-transparent border-r-transparent text-[var(--foreground)]">
      <div className="container mx-auto px-8 py-4 flex items-center justify-between">
        <span className="text-sm">© Jason Lin 2026</span>
        <p className="text-sm text-[var(--muted)]">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;