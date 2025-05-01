"use client"

import React, { useState } from 'react';
import Link from 'next/link'
import NavLink from "./NavLink"
import MenuOverlay from './MenuOverlay';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"

const navLinks = [
    {
        title: "Home",
        path: "/",
    },
    {
        title: "About",
        path: "/about",
    },
    {
        title: "Projects",
        path: "/projects",
    }
]

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  
  return (
    <nav className="w-full px-12 py-3 shadow-sm">
        <div className="flex items-center justify-between">
            <div className="text-2xl text-black font-semibold chinese-font">
                枫
            </div>
            <div className="mobile-menu block md:hidden">
                {!navbarOpen ? (
                    <button onClick={() => setNavbarOpen(true)} className="text-black hover:text-gray-600">
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                ) : (
                    <button onClick={() => setNavbarOpen(false)} className="text-black hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                )}
            </div>
            <div className="menu hidden md:block md:w-auto">
                <ul className="flex items-center space-x-12">
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            <Link 
                                href={link.path} 
                                className="text-black hover:text-gray-600 font-medium text-lg"
                            >
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        {navbarOpen ? <MenuOverlay links={navLinks}/> : null}
    </nav>
  );
};

export default Navbar;
