import { useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { FiTrash2, FiPlus, FiEdit } from 'react-icons/fi';
import AdminTop from '@/components/AdminTop';
import type { AppDispatch, RootState } from '@/Store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import axiosClient from '@/Services/AxiosRequest';
import { Get_Personal_Options_Route } from '@/Routes';
import Loader from '@/components/Loader';
import { personalOptions } from '@/Store/Slices/GetPersonalOption';
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

interface PersonalOption {
  id: string;
  name: string;
  description: string;
}

const AdminPersonalOption = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: personalData } = useSelector((state: RootState) => state.personalOption);
  const { data: admin } = useSelector((state: RootState) => state.currentAdmin);

  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState({ name: '', description: '' });
  const [edit, setEdit] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<PersonalOption>>({
    name: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError({ name: '', description: '' });
  };

  const handleEditOption = (option: PersonalOption) => {
    setFormData(option);
    setEdit(option.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEdit('');
    setError({ name: '', description: '' });
  };

  const validateForm = () => {
    const newError = { name: '', description: '' };
    let isValid = true;
    if (!formData.name?.trim()) {
      newError.name = 'Name is required';
      isValid = false;
    }
    if (!formData.description?.trim()) {
      newError.description = 'Description is required';
      isValid = false;
    }
    setError(newError);
    return isValid;
  };

  const addOption = async () => {
    if (!validateForm()) return;
    setShowLoader(true);
    try {
      const token = Cookies.get('token');
      if (!token) return toast.error('Authentication required');

      await axiosClient.post(Get_Personal_Options_Route, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Option added successfully');
      dispatch(personalOptions());
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error adding option');
    } finally {
      setShowLoader(false);
    }
  };

  const updateOption = async () => {
    if (!validateForm()) return;
    setShowLoader(true);
    try {
      const token = Cookies.get('token');
      if (!token || !formData.id) return;

      await axiosClient.put(`${Get_Personal_Options_Route}/${formData.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Option updated successfully');
      dispatch(personalOptions());
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error updating option');
    } finally {
      setShowLoader(false);
    }
  };

  const confirmDelete = (id: string) => {
    setOptionToDelete(id);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (!optionToDelete) return;
    setShowLoader(true);
    try {
      const token = Cookies.get('token');
      if (!token) return;

      await axiosClient.delete(`${Get_Personal_Options_Route}/${optionToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Option deleted successfully');
      dispatch(personalOptions());
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting option');
    } finally {
      setShowLoader(false);
      setOpenDialog(false);
      setOptionToDelete(null);
    }
  };

  const handleSaveOption = () => {
    formData.id ? updateOption() : addOption();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="lg:ml-64 p-4 md:p-6 w-full">
        <AdminTop />

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Personal Options Management</h2>
        </div>

        {admin?.roles?.includes("FormAdmin") && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {formData.id ? 'Update Personal Option' : 'Create New Personal Option'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  placeholder="Enter option name"
                />
                {error?.name && <p className="text-red-600 text-sm mt-1">{error?.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="Enter option description"
                />
                {error?.description && <p className="text-red-600 text-sm mt-1">{error?.description}</p>}
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
                  onClick={handleSaveOption}
                  disabled={showLoader}
                  className="bg-amber-600 hover:bg-amber-700 flex justify-center items-center gap-10 cursor-pointer text-white px-6 py-2 rounded shadow"
                >
                  {showLoader && <Loader />} {formData.id ? 'Update Option' : 'Add Option'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Current Personal Options ({personalData?.length || 0})
          </h3>
          {personalData && personalData.length > 0 ? (
            <div className="space-y-4">
              {personalData.map((option) => (
                <div key={option.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{option.name}</h4>
                      <p className="text-gray-600 mt-1">{option.description}</p>
                    </div>
                    {admin?.roles?.includes("FormAdmin") && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditOption(option)}
                          className="text-blue-600 cursor-pointer p-1 hover:bg-blue-50 rounded"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => confirmDelete(option.id)}
                          className="text-red-600 cursor-pointer p-1 hover:bg-red-50 rounded"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No personal options found.</p>
          )}
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The option will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
            className='cursor-pointer'
             disabled={showLoader}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={showLoader} className="bg-red-600 cursor-pointer hover:bg-red-700">
              {showLoader && <Loader/>} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPersonalOption;
