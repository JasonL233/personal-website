"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import ThemeSwitch from "./ThemeSwitch";

const navLinks = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Projects", path: "/projects" },
  { title: "Experience", path: "/experience" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <nav className="w-full px-6 sm:px-12 py-3 border-b border-[var(--border)]" aria-label="Main navigation">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl text-[var(--foreground)] font-semibold chinese-font" aria-label="Jason Lin — Home">枫</Link>
        <div className="flex items-center gap-4 sm:gap-7">
        <button type="button" onClick={() => setOpen(!open)} className="md:hidden text-[var(--foreground)] p-1" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="main-menu">
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        <ul className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map(link => <li key={link.path}><Link href={link.path} aria-current={pathname === link.path ? "page" : undefined} className="text-[var(--foreground)] hover:text-[var(--accent)] font-medium">{link.title}</Link></li>)}
        </ul>
        <ThemeSwitch />
        </div>
      </div>
      <ul id="main-menu" className={`${open ? "flex" : "hidden"} md:hidden flex-col items-center gap-4 py-5`}>
        {navLinks.map(link => <li key={link.path}><Link href={link.path} onClick={() => setOpen(false)} aria-current={pathname === link.path ? "page" : undefined} className="text-[var(--foreground)] hover:text-[var(--accent)] font-medium">{link.title}</Link></li>)}
      </ul>
    </nav>
  );
}
