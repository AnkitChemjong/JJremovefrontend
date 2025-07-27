import { useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { FiTrash2, FiPlus, FiEdit } from 'react-icons/fi';
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
import {type AppDispatch, type RootState } from '@/Store';
import Loader from '@/components/Loader';
import { validateFaqInput } from '@/Services/ValidateData';
import { toast } from 'sonner';
import {type FAQError } from '@/Services/ValidateData';
import Cookies from 'js-cookie';
import axiosClient from '@/Services/AxiosRequest';
import { Get_Faq_Route } from '@/Routes';
import { getFaqs } from '@/Store/Slices/GetFaqs';

export type FAQ = {
  id?: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
  updatedAt?: string;
};

const AdminFAQ = () => {
  const { data: faqs } = useSelector((state: RootState) => state?.faqs);
  const {data:admin}=useSelector((state:RootState)=>state.currentAdmin);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [error, setError] = useState<FAQError>({});
  const [editId, setEditId] = useState<string | null>(null);

  const [faqData, setFaqData] = useState<FAQ>({
    question: '',
    answer: '',
    isActive: true,
    sortOrder: 0
  });

  const [currentPage, setCurrentPage] = useState(1);
  const faqsPerPage = 4;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const resetForm = () => {
    setFaqData({
      question: '',
      answer: '',
      isActive: true,
      sortOrder: 0
    });
    setEditId(null);
    setError({});
  };

  const handleEdit = (faq: FAQ) => {
    setFaqData({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
      sortOrder: faq.sortOrder
    });
    setEditId(faq.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFaqData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? (e.target as HTMLInputElement).checked : 
              name === 'sortOrder' ? Number(value) : value
    }));
  };

  const validateForm = () => {
    const errors = validateFaqInput(faqData);
    setError(errors);
    return !errors.question && !errors.answer;
  };

  const addFaq = async () => {
    if (!validateForm()) return;
    
    setShowLoader(true);
    try {
      const token = Cookies.get("token");
      if (!token) return toast.error("Authentication required");

      await axiosClient.post(Get_Faq_Route, faqData, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      toast.success("FAQ Added Successfully.");
      dispatch(getFaqs());
      resetForm();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error adding FAQ");
    } finally {
      setShowLoader(false);
    }
  };

  const updateFaq = async () => {
    if (!validateForm() || !editId) return;
    
    setShowLoader(true);
    try {
      const token = Cookies.get("token");
      if (!token) return toast.error("Authentication required");

      await axiosClient.put(`${Get_Faq_Route}/${editId}`, faqData, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      toast.success("FAQ Updated Successfully.");
      dispatch(getFaqs());
      resetForm();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating FAQ");
    } finally {
      setShowLoader(false);
    }
  };

  const handleSave = () => {
    editId ? updateFaq() : addFaq();
  };

  const confirmDelete = (id: string) => {
    setFaqToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;
    
    setShowLoader(true);
    try {
      const token = Cookies.get("token");
      if (!token) return toast.error("Authentication required");

      await axiosClient.delete(`${Get_Faq_Route}/${faqToDelete}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      toast.success("FAQ Deleted Successfully.");
      dispatch(getFaqs());
      setIsDeleteDialogOpen(false);
      setFaqToDelete(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error deleting FAQ");
    } finally {
      setShowLoader(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = faqs?.slice(indexOfFirstFaq, indexOfLastFaq);
  const totalPages = Math.ceil((faqs?.length || 0) / faqsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="lg:ml-64 p-4 md:p-6 w-full">
        <AdminTop />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">FAQ Management</h2>
        </div>

        {admin?.roles?.includes("FaqAdmin") &&
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {editId ? 'Update FAQ' : 'Add New FAQ'}
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Question *
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={faqData.question}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {error?.question && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.question}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                Answer *
              </label>
              <textarea
                id="answer"
                name="answer"
                value={faqData.answer}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
              {error?.answer && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.answer}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  id="sortOrder"
                  name="sortOrder"
                  value={faqData.sortOrder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={faqData.isActive}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              {editId && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={showLoader}
                className="flex items-center justify-center cursor-pointer px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                {showLoader && <Loader />}
                  <>
                    {editId ? (
                      <>
                        <FiEdit className="mr-2" />
                        Update FAQ
                      </>
                    ) : (
                      <>
                        <FiPlus className="mr-2" />
                        Add FAQ
                      </>
                    )}
                  </>
                
              </button>
            </div>
          </div>
        </div>}

        {/* FAQ List */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">All FAQs ({faqs?.length || 0})</h3>
          
          <div className="space-y-6">
            {currentFaqs?.map((faq) => (
              <div key={faq.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{faq.question}</h4>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      faq.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {faq.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">
                      Sort Order: {faq.sortOrder} | Last Updated: {formatDate(faq.updatedAt)}
                    </span>
                  </div>
                  {
                    admin?.roles?.includes("FaqAdmin") &&

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer hover:bg-blue-50 rounded-md p-2"
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(faq.id)}
                      className="text-red-600 hover:text-red-800
                      cursor-pointer
                       hover:bg-red-50 rounded-md p-2"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                  }
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300
                cursor-pointer
                 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border cursor-pointer
                 border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
            className='cursor-pointer'
             disabled={showLoader}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={showLoader}
              className="bg-red-600 cursor-pointer hover:bg-red-700"
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

export default AdminFAQ;