// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import {type errorType } from '@/Services/ValidateData';
import { toast } from 'sonner';
import axiosClient from '@/Services/AxiosRequest';
import { Login_Route } from '@/Routes';
import { validateLoginInput } from '@/Services/ValidateData';
import Cookies from 'js-cookie';
import Loader from '@/components/Loader';
import { useNavigate } from 'react-router-dom';
import { type AppDispatch } from '@/Store/index';
import { useDispatch } from 'react-redux';
import { adminData } from '@/Store/Slices/GetCurrentAdmin';

export interface FormData{
  username:string;
  password:string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const navigate=useNavigate();
  const dispatch=useDispatch<AppDispatch>();
  const [error,setError]=useState<errorType>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      setLoading(true);
      const errors= validateLoginInput(formData);
      setError(errors);
      if(errors.username=='' && errors.password==''){
        const response=await axiosClient.post(Login_Route, formData);
        if(response?.status === 200){
           Cookies.set("token",response?.data?.token,  { expires: new Date(Date.now() + 2 * 60 * 60 * 1000) });
           dispatch(adminData());
           navigate('/admin/dashboard');
          toast.success(response?.data?.message||"Login Successfull.");
        }
      }
    }
    catch(error:any){
       console.log(error);
       toast.error(error?.response?.data?.message);
    }
    finally{
      setLoading(false);
    }  
  };

  const handleDemoLogin = () => {
    setFormData({
      username: 'admin',
      password: 'admin123'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col justify-center items-center">
      <img src="/images/logo.png" className='w-20 h-20 md:w-30 md:h-30' alt="" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access the dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                 
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {error?.username && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.username}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {error?.password && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.password}</p>}
            </div>
            <div>
              <button
              disabled={loading}
                type="submit"
                className="w-full flex justify-center cursor-pointer gap-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
                 text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading && <Loader />}Sign In
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo Credentials
                </span>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Username:</span> admin<br />
                <span className="font-medium">Password:</span>admin123 <br />
              </p>
              <button
                type="button"
                disabled={loading}
                onClick={handleDemoLogin}
                className="mt-2 w-full cursor-pointer flex justify-center py-1 px-2 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Auto-fill Demo Credentials
              </button>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/"
              className="w-full flex hover:text-blue-700 cursor-pointer items-center justify-center text-sm text-gray-600 "
            >
              <FiArrowLeft className="mr-1" />
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;