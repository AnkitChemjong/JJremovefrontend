import { useState } from 'react';
import { FiTrash2, FiEye } from 'react-icons/fi';
import AdminNavbar from '@/components/AdminNavbar';
import AdminTop from '@/components/AdminTop';
import RequestDetailsDrawer from '@/components/RequestDetailDrawer';
import { useDispatch, useSelector } from 'react-redux';
import {type AppDispatch, type RootState } from '@/Store';
import { getBookingRequest, type AdminBookingRequests } from '@/Store/Slices/GetBookingRequest';
import { toast } from 'sonner';
import axiosClient from '@/Services/AxiosRequest';
import { Create_Booking_Requests_Route } from '@/Routes';
import Cookies from 'js-cookie';

const AdminRequests = () => {
  const { data: requests } = useSelector((state: RootState) => state.bookingRequest);
  const {data:admin}=useSelector((state:RootState)=>state.currentAdmin);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<AdminBookingRequests | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const requestsPerPage = 4;
  const dispatch=useDispatch<AppDispatch>();

  const handleDelete =async (id: string) => {
   try{
    const token=Cookies.get('token');
       if(token){
         await axiosClient.delete(`${Create_Booking_Requests_Route}/${id}`,{headers:{
          "Authorization":`Bearer ${token}`
         }}).then((response)=>{
          dispatch(getBookingRequest());
          toast.success(response?.data?.messag||"Successfully Deleted.")
         }).catch((error:any)=>{
          console.log(error);
           toast.error(error?.response?.data?.message||"Error on deleting Request.");
         })
       }
       else{
        toast.error("Not Authorized.");
       }
   }
   catch(error:any){
    console.log(error);
    toast.error(error?.response?.data?.message||"Error on deleting Request.");
   }
  };

  const handleView = (request: AdminBookingRequests) => {
    setSelectedRequest(request);
    setIsDrawerOpen(true);
  };

  const filteredRequests = requests?.filter(req => {
    const submittedDate = new Date(req.submittedAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return submittedDate >= start && submittedDate <= end;
    } else if (start) {
      return submittedDate >= start;
    } else if (end) {
      return submittedDate <= end;
    }
    return true;
  });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests?.slice(indexOfFirstRequest, indexOfLastRequest);

  const totalPages = Math.ceil((filteredRequests?.length || 0) / requestsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="lg:ml-64 p-4 md:p-6 w-full">
        <AdminTop />

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Customer Requests</h2>
          <p className="text-gray-600">{requests?.length} total requests</p>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dropoff Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desired Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRequests?.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.contactNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {request.pickupAddress.unitOrHouseNo} {request.pickupAddress.suburb}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {request.dropoffAddress.unitOrHouseNo} {request.dropoffAddress.suburb}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.desiredDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(request)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer"
                          title="View Details"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        {
                         admin?.roles?.includes("BookingAdmin") &&
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * requestsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * requestsPerPage, filteredRequests?.length || 0)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{filteredRequests?.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isDrawerOpen &&
      <RequestDetailsDrawer 
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        request={selectedRequest}
      />}
    </div>
  );
};

export default AdminRequests;