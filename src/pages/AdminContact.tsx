import { useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { FiTrash2 } from 'react-icons/fi';
import AdminTop from '@/components/AdminTop';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/Store';
import Loader from '@/components/Loader';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import axiosClient from '@/Services/AxiosRequest';
import { Get_Client_Request_Route } from '@/Routes';
import { contactMessage } from '@/Store/Slices/ContactMessage';

const AdminContact = () => {
  const { data: contactMessages } = useSelector((state: RootState) => state?.clientRequest);
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 4;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const { data: admin } = useSelector((state: RootState) => state.currentAdmin);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter messages by date range
  const filteredMessages = contactMessages?.filter(message => {
    const messageDate = new Date(message.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && end) {
      return messageDate >= start && messageDate <= end;
    } else if (start) {
      return messageDate >= start;
    } else if (end) {
      return messageDate <= end;
    }
    return true;
  }) || [];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Format date for display (short version)
  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Delete confirmation
  const confirmDelete = (id: string) => {
    setMessageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setShowLoader(true);
      if (messageToDelete) {
        const token = Cookies.get('token');
        if (token) {
          await axiosClient.delete(`${Get_Client_Request_Route}/${messageToDelete}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => {
            dispatch(contactMessage());
            setCurrentPage(1);
            setIsDeleteDialogOpen(false);
            setMessageToDelete(null);
            toast.success(response?.data?.message || "Message deleted successfully");
          }).catch((error: any) => {
            toast.error(error?.response?.data?.message || "Failed to delete message");
          });
        }
      }
    }
    catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to delete message");
    }
    finally {
      setShowLoader(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="lg:ml-64 p-4 md:p-6 w-full">
        <AdminTop />

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>
            <p className="text-gray-600">{filteredMessages.length} filtered messages</p>
          </div>
        </div>

        {/* Date Filter Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Messages List */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Showing Messages ({filteredMessages.length})
            {(startDate || endDate) && (
              <span className="text-sm text-gray-500 ml-2">
                (Filtered: {startDate ? formatShortDate(startDate) : 'Start'} to {endDate ? formatShortDate(endDate) : 'End'})
              </span>
            )}
          </h3>
          
          {currentMessages.length > 0 ? (
            <div className="space-y-6">
              {currentMessages.map((message) => (
                <div key={message.id} className="p-4 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{message?.name}</h4>
                      <span className="text-sm text-gray-500">{message.email}</span>
                      <span className="block text-sm text-gray-500 mt-1">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    {admin?.roles?.includes("MessageAdmin") && (
                      <button
                        onClick={() => confirmDelete(message.id)}
                        className="text-red-600 cursor-pointer hover:text-red-800 hover:bg-red-50 rounded-md p-2"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-600 whitespace-pre-line">{message?.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No messages found{startDate || endDate ? " in the selected date range" : ""}.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={showLoader}
              className='cursor-pointer'
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={showLoader}
              className="bg-red-600 hover:bg-red-700 cursor-pointer flex justify-center items-center gap-10"
            >
              {showLoader && <Loader />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminContact;