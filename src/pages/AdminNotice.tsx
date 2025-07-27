import { useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { FiTrash2, FiPlus, FiEdit, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AdminTop from '@/components/AdminTop';
import type { AppDispatch, RootState } from '@/Store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import axiosClient from '@/Services/AxiosRequest';
import { Get_Notices_Route } from '@/Routes';
import { getAdminNotice } from '@/Store/Slices/GetAdminNotice';
import { getNotice } from '@/Store/Slices/GetNotice';
import Loader from '@/components/Loader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface AdminNotice {
  id: string;
  content: string;
  type: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  moreInfo?: string;
  imageUrl?: string;
}

interface NoticeFormData {
  id?: string;
  content: string;
  type: number;
  isActive: boolean;
  sortOrder: number;
  moreInfo?: string;
}

const AdminNotices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: noticesData } = useSelector((state: RootState) => state.adminNotice);
  const { data: admin } = useSelector((state: RootState) => state.currentAdmin);

  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState('');
  const [edit, setEdit] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 4;

  const [formData, setFormData] = useState<NoticeFormData>({
    content: '',
    type: 0,
    isActive: true,
    sortOrder: 0,
    moreInfo: ''
  });

  // Calculate pagination
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = noticesData?.slice(indexOfFirstNotice, indexOfLastNotice) || [];
  const totalPages = Math.ceil((noticesData?.length || 0) / noticesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'type' || name === 'sortOrder' ? Number(value) : value
    }));
    if (name === 'content' && error) setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditNotice = (notice: AdminNotice) => {
    setFormData({
      id: notice.id,
      content: notice.content,
      type: notice.type,
      isActive: notice.isActive,
      sortOrder: notice.sortOrder,
      moreInfo: notice.moreInfo
    });
    setEdit(notice.id);
    setError('');
    setImagePreview(notice.imageUrl || null);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateForm = () => {
    if (!formData.content?.trim()) {
      setError('Notice content is required');
      return false;
    }
    if (formData.type === 1 && !formData.moreInfo?.trim()) {
      setError('More info is required for popup notices');
      return false;
    }
    if (formData.type === 1 && !imageFile && !imagePreview) {
      setError('Image is required for popup notices');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({ content: '', type: 0, isActive: true, sortOrder: 0, moreInfo: '' });
    setEdit('');
    setError('');
    setImagePreview(null);
    setImageFile(null);
  };

  const createFormData = () => {
    const data = new FormData();
    
    data.append('content', formData.content);
    data.append('type', String(formData.type));
    data.append('isActive', String(formData.isActive));
    data.append('sortOrder', String(formData.sortOrder));
    
    if (formData.type === 1) {
      if (formData.moreInfo) {
        data.append('moreInfo', formData.moreInfo);
      }
      if (imageFile) {
        data.append('imageFile', imageFile);
      }
    }
    
    return data;
  };

  const addNotice = async () => {
    if (!validateForm()) return;
    setShowLoader(true);
    try {
      const token = Cookies.get('token');
      if (!token) return toast.error('Authentication required');
      
      const data = createFormData();
      
      await axiosClient.post(Get_Notices_Route, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Notice added successfully');
      dispatch(getNotice());
      dispatch(getAdminNotice());
      resetForm();
      setCurrentPage(1); // Reset to first page after adding new notice
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error adding notice');
    } finally {
      setShowLoader(false);
    }
  };

  const updateNotice = async () => {
    if (!validateForm()) return;
    setShowLoader(true);
    try {
      const token = Cookies.get('token');
      if (!token || !formData.id) return;
      
      const data = createFormData();
      
      await axiosClient.put(`${Get_Notices_Route}/${formData.id}`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Notice updated successfully');
      dispatch(getNotice());
      dispatch(getAdminNotice());
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error updating notice');
    } finally {
      setShowLoader(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const token = Cookies.get('token');
      if (!token) return;
      await axiosClient.delete(`${Get_Notices_Route}/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notice deleted');
      dispatch(getNotice());
      dispatch(getAdminNotice());
      setOpenDialog(false);
      
      // Adjust current page if the last item on the page was deleted
      if (currentNotices.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting notice');
    }
  };

  const handleSaveNotice = () => {
    formData.id ? updateNotice() : addNotice();
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="lg:ml-64 p-4 md:p-6 w-full">
        <AdminTop />

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Notice Management</h2>
        </div>

        {admin?.roles?.includes("NoticeAdmin") && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {formData.id ? 'Update Notice' : 'Create New Notice'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  >
                    <option value={0}>Banner</option>
                    <option value={1}>Popup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className={`w-full border rounded p-2 ${error ? 'border-red-500' : ''}`}
                  rows={4}
                />
                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
              </div>
              
              {formData.type === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">More Info *</label>
                    <textarea
                      name="moreInfo"
                      value={formData.moreInfo}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border rounded p-2"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-xs max-h-40 object-contain"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="isActive">Active Notice</label>
              </div>
              <div className="flex justify-end gap-10">
                {edit && (
                  <button
                    onClick={resetForm}
                    disabled={showLoader}
                    className="bg-amber-600 hover:bg-amber-700 cursor-pointer text-white px-6 py-2 rounded shadow"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSaveNotice}
                  disabled={showLoader}
                  className="bg-amber-600 hover:bg-amber-700
                  flex justify-center items-center gap-5
                   cursor-pointer text-white px-6 py-2 rounded shadow"
                >
                  {showLoader ? <Loader />:<FiPlus className=' w-4 h-4'/>} { formData.id ? 'Update Notice' : 'Add Notice'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Current Notices ({noticesData?.length || 0})</h3>
          {currentNotices && currentNotices.length > 0 ? (
            <div className="space-y-4">
              {currentNotices.map((notice) => (
                <div key={notice.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <span className={`px-2 py-1 text-xs rounded font-medium mr-2 ${
                        notice.type === 1 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notice.type === 1 ? 'Popup' : 'Banner'}
                      </span>
                      <span className="text-sm text-gray-600">Order: {notice.sortOrder}</span>
                    </div>
                    <div className="flex gap-2">
                      {
                        admin?.roles?.includes("NoticeAdmin") &&

                      <button
                        onClick={() => handleEditNotice(notice)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                      >
                        <FiEdit />
                      </button>
                      }
                      <span className={`text-xs px-2 py-1 rounded ${
                        notice.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {notice.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {
                        admin?.roles?.includes("NoticeAdmin") &&
                      <button
                        onClick={() => confirmDelete(notice.id)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                      }
                    </div>
                  </div>
                  <p className="mt-2 text-gray-800">{notice.content}</p>
                  {notice.type === 1 && (
                    <div className="mt-2">
                      {notice?.moreInfo && <p className="text-sm text-gray-700">{notice?.moreInfo}</p>}
                      {notice?.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={`${import.meta.env.VITE_SERVER_URL}/${notice?.imageUrl}`} 
                            alt="Notice" 
                            className="max-w-xs max-h-40 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Created: {formatDate(notice.createdAt)}</p>
                </div>
              ))}

              {/* Pagination controls */}
              {noticesData && noticesData.length > noticesPerPage && (
                <div className="flex justify-center items-center mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-l border border-gray-300 disabled:opacity-50"
                  >
                    <FiChevronLeft />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === number ? 'bg-amber-600 text-white' : 'bg-white'}`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-r border border-gray-300 disabled:opacity-50"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No notices found.</p>
          )}
        </div>
      </div>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
            className='cursor-pointer'
             disabled={showLoader}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={showLoader}
              onClick={handleDelete}
              className="bg-red-600 cursor-pointer hover:bg-red-700"
            >
              {showLoader ? <Loader /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminNotices;