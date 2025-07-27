import { useState, useRef, useEffect } from 'react';
import { CiSettings } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import {type AppDispatch, type RootState } from '@/Store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { adminData } from '@/Store/Slices/GetCurrentAdmin';
import AdminSideDialog from './AdminSideDialog';

const AdminTop = () => {
  const { data: admin } = useSelector((state: RootState) => state.currentAdmin);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsIconRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch=useDispatch<AppDispatch>();
  const [showDialog,setShowDialog]=useState(false);
  const [showDialog1,setShowDialog1]=useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        settingsIconRef.current &&
        !settingsIconRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
   try{
     Cookies?.remove('token');
     dispatch(adminData());
     toast.success("Logout Successful");
     navigate('/admin/login');
   }
   catch(error:any){
    console.log(error);
    toast.error(error?.response?.data?.message);
   }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handlePassChange=()=>{
    setShowDropdown(false);
    setShowDialog(true);
  }
  return (
    <div className="mb-8 flex flex-col md:flex-row text-black bg-white py-4 rounded-2xl shadow-sm shadow-black justify-between md:justify-center items-start md:items-center md:gap-28 gap-4 px-4 relative">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to Admin Dashboard. Manage your services, reviews, notices, and customer requests from here.
        </p>
      </div>
      
      <div className='flex text-black justify-start md:justify-center items-center space-x-4'>
        <h1 className='text-base uppercase'>{admin?.username || "Admin"}</h1>
        <div ref={settingsIconRef}>
          <CiSettings 
            size={20} 
            className='cursor-pointer hover:scale-[1.5] transition-all duration-150' 
            onClick={toggleDropdown}
          />
        </div>
      </div>
      {
        showDialog &&
        <AdminSideDialog type="passchange" openDialog={showDialog} setOpenDialog={setShowDialog}/>
      }
      {
        showDialog1 &&
        <AdminSideDialog type="createuser" openDialog={showDialog1} setOpenDialog={setShowDialog1}/>
      }

      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 top-45 md:top-18 bg-white rounded-lg 
          shadow-md py-2 z-50 border border-gray-200 min-w-[180px] "
        >
          {
            admin && admin?.roles?.includes('FormAdmin') &&
            <>
          <button
            className="w-full text-left cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={handlePassChange}
          >
            Change Password
          </button>
          <button
            className="w-full text-left cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => {
              setShowDropdown(false);
              setShowDialog1(true);
            }}
          >
            Create User
          </button>
            </>
          }
          <button
            className="w-full text-left cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
            onClick={() => {
              setShowDropdown(false);
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTop;