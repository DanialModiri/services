
import React, { useState } from 'react';
import { Link } from '../lib/router';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: 'صفحه اصلی' },
    { href: '#services', label: 'خدمات' },
    { href: '#about', label: 'درباره ما' },
    { href: '#contact', label: 'تماس با ما' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-teal-600">
          میز خدمت آنلاین
        </div>
        <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-600 hover:text-teal-600 transition-colors duration-300 font-medium">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4 space-x-reverse">
          <a href="#contact" className="bg-teal-600 text-white py-2 px-5 rounded-lg hover:bg-teal-700 transition-colors duration-300 font-semibold">
            درخواست مشاوره
          </a>
           <Link to="/login">
              <a className="border border-blue-600 text-blue-600 py-2 px-5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 font-semibold">
                ورود به پنل
              </a>
            </Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="block text-center py-2 px-4 text-gray-600 hover:bg-teal-50 hover:text-teal-600" onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="px-4 mt-4 space-y-2">
             <a href="#contact" className="block text-center w-full bg-teal-600 text-white py-2 px-5 rounded-lg hover:bg-teal-700 transition-colors duration-300 font-semibold" onClick={() => setIsMenuOpen(false)}>
              درخواست مشاوره
            </a>
            <Link to="/login">
                <a className="block text-center w-full border border-blue-600 text-blue-600 py-2 px-5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 font-semibold" onClick={() => setIsMenuOpen(false)}>
                  ورود به پنل
                </a>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
