import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Loader from './Loader';
import { toast } from 'sonner';
import axiosClient from '@/Services/AxiosRequest';
import { Get_Contact_Info_Route } from '@/Routes';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from '@/Store';
import { contactData } from '@/Store/Slices/ContactDetails';
import Cookies from 'js-cookie';
import { validateContactInput, type errorContact } from '@/Services/ValidateData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';


export interface ContactInfo {
  address: string;
  email: string;
  phone1: string;
  phone2: string;
  officeHours: string;
  mapEmbedUrl: string;
  showVehicleOptionsInBookingForm?: boolean;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

interface UpdateContactDialogProps {
  open: boolean;
  onClose: () => void;
  contactInfo: ContactInfo;
}

export const UpdateContactDialog: React.FC<UpdateContactDialogProps> = ({
  open,
  onClose,
  contactInfo,
}) => {
  const [formData, setFormData] = useState<ContactInfo>({
    address: contactInfo?.address || '',
    email: contactInfo?.email || '',
    phone1: contactInfo?.phone1 || '',
    phone2: contactInfo?.phone2 || '',
    officeHours: contactInfo?.officeHours || '',
    mapEmbedUrl: contactInfo?.mapEmbedUrl || '',
    showVehicleOptionsInBookingForm: contactInfo?.showVehicleOptionsInBookingForm || false,
  });

  const [error, setError] = useState<errorContact>({});
  const dispatch = useDispatch<AppDispatch>();
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      const token = Cookies.get('token');
      if (token) {
        const errors = validateContactInput(formData);
        setError(errors);
        if (errors?.address=='' || errors?.email=='' || errors?.phone1=='' || errors?.phone2==''
             || errors?.officeHours=='' || errors?.mapEmbedUrl=='') {
          await axiosClient
            .put(Get_Contact_Info_Route, formData,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })
            .then((response) => {
              dispatch(contactData());
              toast.success(response?.data?.message || 'Contact information updated successfully.');
              onClose();
            })
            .catch((error: any) => {
              console.log(error);
              toast.error(
                error?.response?.data?.message ||
                  'Something went wrong while updating contact information.'
              );
            });
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          'Something went wrong while updating contact information.'
      );
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <FaEdit /> Update Contact Information
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
            {error?.address && (
              <p className="text-sm text-red-600 mt-1">{error.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {error?.email && (
                <p className="text-sm text-red-600 mt-1">{error.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Office Hours</label>
              <input
                name="officeHours"
                value={formData.officeHours}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {error?.officeHours && (
                <p className="text-sm text-red-600 mt-1">{error.officeHours}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Phone</label>
              <input
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {error?.phone1 && (
                <p className="text-sm text-red-600 mt-1">{error.phone1}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Phone</label>
              <input
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              {error?.phone2 && (
                <p className="text-sm text-red-600 mt-1">{error.phone2}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Map Embed URL</label>
            <input
              name="mapEmbedUrl"
              value={formData.mapEmbedUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {error?.mapEmbedUrl && (
              <p className="text-sm text-red-600 mt-1">{error.mapEmbedUrl}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="vehicleOptions"
              name="showVehicleOptionsInBookingForm"
              checked={formData.showVehicleOptionsInBookingForm}
              onChange={handleChange}
            />
            <label htmlFor="vehicleOptions">Show Vehicle Options in Booking Form</label>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
            className='cursor-pointer bg-gray-200 hover:bg-gray-300'
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={showLoader}
            >
              Cancel
            </Button>
            <Button type="submit" 
            className='cursor-pointer bg-amber-600 hover:bg-amber-700'
             disabled={showLoader}>
              {showLoader && <Loader />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
