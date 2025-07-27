import { useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import AdminTop from '@/components/AdminTop';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/Store';
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
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import axiosClient from '@/Services/AxiosRequest';
import { Create_Vehicle_Route } from '@/Routes';
import { validateCreateVehicleInput } from '@/Services/ValidateData';
import { type errorVehicle } from '@/Services/ValidateData';
import { getVehicle } from '@/Store/Slices/GetVehicleOptions';

export type Vehicle = {
  name: string;
  description: string;
  capacityCubicMeters: number | null;
  imageUrl: null | File | string;
  isActive: boolean;
  basePrice: number | null;
  sortOrder: number;
  extraNotes: string | null;
};

const AdminVehicle = () => {
  const { data: vehicles } = useSelector((state: RootState) => state?.vehicles);
  const {data:admin}=useSelector((state:RootState)=>state.currentAdmin);
  const [error, setError] = useState<errorVehicle>();
  const dispatch = useDispatch<AppDispatch>();
  
  const [newVehicle, setNewVehicle] = useState<Vehicle>({
    name: '',
    description: '',
    capacityCubicMeters: 0,
    imageUrl: null,
    isActive: true,
    basePrice: 0,
    sortOrder: 0,
    extraNotes: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 4;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Add new vehicle
  const addVehicle = async () => {
    try {
      setShowLoader(true);
      const vehicle: Vehicle = {
        ...newVehicle,
        imageUrl: imageFile
      };
      
      const errors = validateCreateVehicleInput(vehicle);
      setError(errors);
      
      if (errors?.basePrice === '' && 
          errors?.capacityCubicMeters === '' && 
          errors?.name === '' && 
          errors?.description === '' && 
          errors?.extraNotes === '' && 
          errors?.imageUrl === '') {
        
        const token = Cookies.get('token');
        if (!token) {
          toast.error('Authentication required');
          return;
        }

        if (!imageFile) {
          toast.error('Please select an image');
          return;
        }

        const formData = new FormData();
        formData.append('name', vehicle.name);
        formData.append('description', vehicle.description);
        formData.append('capacityCubicMeters', String(vehicle.capacityCubicMeters));
        formData.append('isActive', String(vehicle.isActive));
        formData.append('basePrice', String(vehicle.basePrice));
        formData.append('sortOrder', String(vehicle.sortOrder));
        formData.append('extraNotes', vehicle.extraNotes || '');
        formData.append('imageFile', imageFile);

        const response = await axiosClient.post(Create_Vehicle_Route, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        dispatch(getVehicle());
        toast.success(response?.data?.message || 'Vehicle added successfully');
        
        // Reset form
        setNewVehicle({
          name: '',
          description: '',
          capacityCubicMeters: 0,
          imageUrl: null,
          isActive: true,
          basePrice: 0,
          sortOrder: 0,
          extraNotes: ''
        });
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setShowLoader(false);
    }
  };

  // Delete confirmation
  const confirmDelete = (id: string) => {
    setVehicleToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    setShowLoader(true);
    try {
      if (!vehicleToDelete) {
        toast.error("No vehicle selected for deletion.");
        return;
      }

      const token = Cookies.get('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axiosClient.delete(`${Create_Vehicle_Route}/${vehicleToDelete}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      dispatch(getVehicle());
      setIsDeleteDialogOpen(false);
      setVehicleToDelete(null);
      toast.success(response?.data?.message || 'Vehicle deleted successfully');
    } catch (error: any) {
      console.error("Error deleting vehicle:", error);
      toast.error(error?.response?.data?.message || "Failed to delete vehicle.");
    } finally {
      setShowLoader(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({
      ...prev,
      [name]: name === 'isActive' ? (e.target as HTMLInputElement).checked : 
              name === 'capacityCubicMeters' || name === 'basePrice' || name === 'sortOrder' ? 
              Number(value) : value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Format null values
  const formatValue = (value: number | null, isCurrency: boolean = false): string => {
    if (value === null) return '-';
    return isCurrency ? `$${value.toFixed(2)}` : value.toString();
  };

  // Pagination logic
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles?.slice(indexOfFirstVehicle, indexOfLastVehicle) || [];
  const totalPages = Math.ceil((vehicles?.length || 0) / vehiclesPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="lg:ml-64 p-4 md:p-6 w-full">
        <AdminTop />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vehicle Management</h2>
        </div>

       { admin?.roles?.includes("FormAdmin") &&
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newVehicle.name}
                onChange={handleInputChange}
                placeholder='Enter vehicle name...'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {error?.name && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.name}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={newVehicle.description}
                onChange={handleInputChange}
                placeholder='Enter description...'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {error?.description && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.description}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (m³) *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacityCubicMeters"
                value={newVehicle.capacityCubicMeters || ''}
                onChange={handleInputChange}
                placeholder='Enter Capacity...'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.1"
                min="0"
                required
              />
              {error?.capacityCubicMeters && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.capacityCubicMeters}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Base Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="basePrice"
                value={newVehicle.basePrice || ''}
                onChange={handleInputChange}
                placeholder='Enter base price...'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0"
                required
              />
              {error?.basePrice && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.basePrice}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                value={newVehicle.sortOrder}
                onChange={handleInputChange}
                placeholder='Enter sort order...'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={newVehicle.isActive}
                onChange={handleInputChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active Vehicle
              </label>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="extraNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Extra Notes
              </label>
              <textarea
                id="extraNotes"
                name="extraNotes"
                value={newVehicle.extraNotes || ''}
                onChange={handleInputChange}
                placeholder='Enter extra notes...'
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              {error?.extraNotes && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.extraNotes}</p>}
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Image *
              </label>
              <input
                type="file"
                id="image"
                name="imageUrl"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                required
              />
              {error?.imageUrl && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.imageUrl}</p>}
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-32 object-contain border rounded"
                  />
                  <p className="text-sm text-gray-500 mt-1">Image Preview</p>
                </div>
              )}
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={addVehicle}
                disabled={showLoader}
                className="flex items-center justify-center px-4 py-2 bg-amber-600 text-white cursor-pointer rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {showLoader ? <Loader/> : <FiPlus className="mr-2" />}  
                Add Vehicle
              </button>
            </div>
          </div>
        </div>}

        {/* Vehicles List */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">All Vehicles ({vehicles?.length || 0})</h3>
          
          <div className="space-y-6">
            {currentVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex flex-col md:flex-row gap-6 p-4 border-b border-gray-100 last:border-0">
                <div className="w-full md:w-48 flex-shrink-0">
                  {vehicle.imageUrl && (
                    <img 
                      src={`${import.meta.env.VITE_SERVER_URL}/${vehicle.imageUrl}`} 
                      alt={vehicle.name}
                      className="w-full h-32 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-vehicle.jpg';
                      }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{vehicle.name}</h4>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                        vehicle.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {
                      admin?.roles?.includes("FormAdmin") &&

                    <button
                      onClick={() => confirmDelete(vehicle.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer hover:bg-red-50 rounded-md p-2"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                    }
                  </div>
                  
                  <p className="mt-2 text-gray-600">{vehicle.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <span className="block text-sm text-gray-500">Capacity</span>
                      <span className="font-medium">{formatValue(vehicle.capacityCubicMeters)} m³</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Base Price</span>
                      <span className="font-medium">{formatValue(vehicle.basePrice, true)}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Sort Order</span>
                      <span className="font-medium">{vehicle.sortOrder}</span>
                    </div>
                  </div>
                  
                  {vehicle.extraNotes && (
                    <div className="mt-3">
                      <span className="block text-sm text-gray-500">Extra Notes</span>
                      <p className="text-gray-600">{vehicle.extraNotes}</p>
                    </div>
                  )}
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
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
              Are you sure you want to delete this vehicle? This action cannot be undone.
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
              disabled={showLoader} 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 cursor-pointer flex justify-center items-center gap-2"
            >
              {showLoader && <Loader className="animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminVehicle;