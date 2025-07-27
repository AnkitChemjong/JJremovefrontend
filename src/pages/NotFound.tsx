// src/pages/NotFoundPage.tsx
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import type { RootState } from '@/Store';

const NotFound = () => {
  const {data:adminData}=useSelector((state:RootState)=> state.currentAdmin);
  const navigate=useNavigate();

  const handleBack=()=>{
    if(adminData){
         navigate("/admin/dashboard");
    }
    else{
      navigate("/");
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
     
      <div className="mb-8">
        <img 
          src="/images/logo.png" 
          alt="Company Logo" 
          className="h-12 w-auto" 
        />
      </div>


      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={handleBack}
          className="inline-flex items-center cursor-pointer px-4 py-2 
          border border-transparent text-sm font-medium rounded-md shadow-sm
           text-white bg-amber-600 hover:bg-amber-700 focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiArrowLeft className="mr-2" />
          {adminData ? "Back to Dashboard":"Back to Home"}
        </button>
      </div>

    </div>
  );
};

export default NotFound;