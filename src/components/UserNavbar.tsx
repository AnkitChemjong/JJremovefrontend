import  { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FaSignInAlt } from "react-icons/fa";
import {motion} from 'motion/react';
import Notice from './Notice';
import { BookingDialog } from './BookServiceDialog';
import { FaBook } from "react-icons/fa";


export const navItem = [
  {
    name: "Home",
    path: "/"
  },
  {
    name: "About Us",
    path: "/about"
  },
  {
    name: "Services",
    path: "/service"
  },
  {
    name: "Gallery",
    path: "/gallery"
  },
  {
    name: "Contact Us",
    path: "/contact"
  }
];

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();
  const navigate=useNavigate();
  
  const handleBookService = () => {
    setOpenDialog(!openDialog);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <Notice/>
    <div className='w-screen min-h-fit py-4 md:px-28 bg-gray-50 shadow-lg fixed z-50 top-10'>
      <div className='flex flex-row justify-between items-center px-4 md:px-0'>
        <motion.div
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}}
        transition={{
          duration:0.7,
          delay:0.3
        }}
        className='flex flex-row justify-between items-center space-x-4'>
          <img src="/images/logo.png" className='w-10 h-10 md:w-15 md:h-15' alt="" />
          <h1 className='text-lg md:text-3xl text-blue-800 font-bold'>JJ<span className='text-2xl md:text-4xl text-blue-500'>Nepali</span>Removal</h1>
        </motion.div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex space-x-6 items-center'>
          {navItem?.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
              initial={{opacity:0,y:10}} 
              animate={{opacity:1,y:0}}
              transition={{
                duration:0.7,
                delay:0.3*index
              }}
              key={index} className='relative group'>
                <Link 
                  to={item?.path} 
                  className={`hover:text-blue-500 transition-colors ${isActive ? 'font-semibold' : ''}`}
                >
                  {item?.name}
                </Link>
                {isActive && (
                  <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1,delay:1 }}
                  className="absolute bottom-[-10px] left-0 h-[2px] bg-black"
                />
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.button
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}}
        transition={{
          opacity:{
            duration:0.7,
            delay:0.3
          }
        }} 
        whileHover={{ scale: 1.09 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBookService}
        className='hidden md:flex justify-center items-center space-x-2  bg-amber-600 py-2 px-4 rounded-full cursor-pointer
         text-white text-sm font-normal hover:bg-amber-700 transition-colors md:flex-row shrink-0'>
           <FaBook className="text-white"/>
           <h1>BOOK SERVICE</h1>
        </motion.button>
        {openDialog && 
        (
          <BookingDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
        )}
        <motion.button
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}}
        transition={{
          opacity:{
            duration:0.7,
            delay:0.3
          }
        }} 
        whileHover={{ scale: 1.09 }}
        whileTap={{ scale: 0.98 }}
        onClick={()=>navigate("/admin/login")}
        className='hidden md:flex justify-center items-center space-x-2  bg-amber-600 py-2 px-4 rounded-full cursor-pointer
         text-white text-sm font-normal hover:bg-amber-700 transition-colors md:flex-row shrink-0'>
           <FaSignInAlt className="text-white"/>
           <h1>Log-In</h1>
        </motion.button>
        <button 
          className='md:hidden text-blue-800 focus:outline-none'
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className='md:hidden bg-gray-50 w-full px-4 py-2'>
          <div className='flex flex-col space-y-4'>
            {navItem?.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <div key={index} className='relative'>
                  <Link 
                    to={item?.path} 
                    className={`hover:text-blue-500 transition-colors py-2 block ${isActive ? 'font-semibold' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item?.name}
                  </Link>
                  {isActive && (
                    <div className='absolute bottom-1 left-0 w-full h-[2px] bg-black'></div>
                  )}
                </div>
              );
            })}
            <div className='flex flex-row justify-evenly items-center'>
            <motion.button
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}}
        transition={{
          opacity:{duration:0.7,
          delay:0.3
          }
        }} 
        whileHover={{ scale: 1.09 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBookService}
        className='bg-amber-600 px-4 flex flex-row justify-center items-center
         space-x-2 py-2 rounded-full cursor-pointer text-white text-sm font-normal hover:bg-amber-700 transition-colors w-fit'>
           <FaBook className="text-white"/>
           <h1>BOOK SERVICE</h1>
        </motion.button>
        
        <motion.button
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}}
        transition={{
          opacity:{
            duration:0.7,
            delay:0.3
          }
        }} 
        whileHover={{ scale: 1.09 }}
        whileTap={{ scale: 0.98 }}
        onClick={()=>navigate("/admin/login")}
        className='bg-amber-600 px-4 flex flex-row justify-center items-center
        space-x-2 py-2 rounded-full cursor-pointer text-white text-sm font-normal hover:bg-amber-700 transition-colors w-fit'>
           <FaSignInAlt className="text-white"/>
           <h1>Log-In</h1>
        </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default UserNavbar;