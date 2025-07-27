import React, { useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { 
  FaTh, 
  FaConciergeBell, 
  FaStar, 
  FaBullhorn, 
  FaEnvelope,
  FaCar,
  FaAddressBook,
  FaBars, 
  FaTimes,
  FaQuestionCircle,
  FaImages,
  FaUserCog,
  FaUsers,
  FaUserShield
} from 'react-icons/fa';

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: <FaTh />, path: '/admin/dashboard' },
    { name: 'Admins', icon: <FaUserShield />, path: '/admin/admins' },
    { name: 'Services', icon: <FaConciergeBell />, path: '/admin/services' },
    { name: 'Vehicles', icon: <FaCar />, path: '/admin/vehicles' },
    { name: 'Contacts', icon: <FaAddressBook />, path: '/admin/contacts' },
    { name: 'Reviews', icon: <FaStar />, path: '/admin/reviews' },
    { name: 'Notice', icon: <FaBullhorn />, path: '/admin/notice' },
    { name: 'Requests', icon: <FaEnvelope />, path: '/admin/requests' },
    { name: 'FAQ', icon: <FaQuestionCircle />, path: '/admin/faq' },
    { name: 'Media', icon: <FaImages />, path: '/admin/media' },
    { name: 'Personal Options', icon: <FaUserCog />, path: '/admin/personal-option' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <div className={`fixed inset-y-0 left-0 w-64 bg-white text-black shadow-lg shadow-black transition-all duration-300 z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} rounded-r-3xl flex flex-col`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold mb-2 px-4">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto pb-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={`w-full flex items-center px-4 py-2.5 rounded-md transition-colors text-sm
                    ${isActive(item.path) ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={`mr-3 ${isActive(item.path) ? 'text-white' : 'text-gray-600'}`}>
                    {item.icon}
                  </span>
                  <span className={`truncate ${isActive(item.path) ? 'font-medium' : ''}`}>
                    {item.name}
                  </span>
                  {isActive(item.path) && (
                    <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminNavbar;