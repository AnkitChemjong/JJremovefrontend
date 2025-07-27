import { useState,type ChangeEvent } from 'react';
import { format } from 'date-fns';
import { FaCalendarAlt } from 'react-icons/fa';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSelector } from 'react-redux';
import { type RootState } from '@/Store';
import axiosClient from '@/Services/AxiosRequest';
import { Create_Booking_Requests_Route } from '@/Routes';
import Loader from './Loader';
import { toast } from 'sonner';

interface BookingDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

export function BookingDialog({ openDialog, setOpenDialog }: BookingDialogProps) {
  const { data: vehicleData } = useSelector((state: RootState) => state.vehicles);
  const { data: personalData } = useSelector((state: RootState) => state.personalOption);
  const [showLoader,setShowLoader]=useState<boolean>(false);


  const [formData, setFormData] = useState({
    desiredDate: new Date(),
    desiredTime: "",
    name: "",
    contactNumber: "",
    vehicleOptionId: "",
    personnelOptionId: ""
  });
   
  
  const [pickupAddress, setPickupAddress] = useState({
    unitOrHouseNo: "",
    suburb: "",
    city: "",
    postCode: ""
  });



  const [dropoffAddress, setDropoffAddress] = useState({
    unitOrHouseNo: "",
    suburb: "",
    city: "",
    postCode: ""
  });

  const checkInput = (): boolean => {
  if (
    !formData.name.trim() ||
    !formData.contactNumber.trim() ||
    !formData.desiredTime ||
    !formData.vehicleOptionId ||
    !formData.personnelOptionId
  ) {
    return false;
  }

  if (
    !pickupAddress.unitOrHouseNo.trim() ||
    !pickupAddress.suburb.trim() ||
    !pickupAddress.city.trim() ||
    !pickupAddress.postCode.trim()
  ) {
    return false;
  }

  if (
    !dropoffAddress.unitOrHouseNo.trim() ||
    !dropoffAddress.suburb.trim() ||
    !dropoffAddress.city.trim() ||
    !dropoffAddress.postCode.trim()
  ) {
    return false;
  }

  if (
    !formData.desiredDate ||
    formData.desiredDate < new Date(new Date().setHours(0, 0, 0, 0))
  ) {
    return false;
  }

  return true;
};


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    try {
      const { name, value } = e.target;
      
      // Handle form data fields
      if (name in formData) {
        setFormData(prev => ({ ...prev, [name]: value }));
      } 
      // Handle pickup address fields
      else if (name.startsWith('pickup_')) {
        const fieldName = name.replace('pickup_', '');
        setPickupAddress(prev => ({ ...prev, [fieldName]: value }));
      }
      // Handle dropoff address fields
      else if (name.startsWith('dropoff_')) {
        const fieldName = name.replace('dropoff_', '');
        setDropoffAddress(prev => ({ ...prev, [fieldName]: value }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, desiredDate: date }));
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setShowLoader(true);
    try{
      const completeData = {
        ...formData,
        desiredDate: format(formData.desiredDate, 'yyyy-MM-dd'),
        pickupAddress,
        dropoffAddress
      };
      //console.log(completeData)
      const response=await axiosClient.post(Create_Booking_Requests_Route, completeData);
      if(response?.status==201){
         toast.success("Thankyou, for booking the service.");
        setOpenDialog(false);
      }
    }
    catch(error:any){
      toast.error("Error on submitting the form Try again.");
      console.log(error?.response?.data?.message);
    }
    finally{
      setShowLoader(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Book Moving Service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg border-b pb-2">Your Information</h3>
            <div>
              <label className="block mb-1 text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                pattern="[0-9]*"
                maxLength={10}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg border-b pb-2">Moving Details</h3>
            <div>
              <label className="block mb-1 text-sm font-medium">Moving Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full p-2 border rounded flex items-center justify-between hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                  >
                    <span>{format(formData.desiredDate, "PPP")}</span>
                    <FaCalendarAlt className="h-4 w-4 text-gray-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.desiredDate}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Preferred Time</label>
              <input
                type="time"
                name="desiredTime"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.desiredTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Pickup Address */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg border-b pb-2">Pickup Address</h3>
            <div>
              <label className="block mb-1 text-sm font-medium">Unit/House No</label>
              <input
                type="text"
                name="pickup_unitOrHouseNo"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={pickupAddress.unitOrHouseNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-sm font-medium">Suburb</label>
                <input
                  type="text"
                  name="pickup_suburb"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={pickupAddress.suburb}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Post Code</label>
                <input
                  type="text"
                   name="pickup_postCode"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={pickupAddress.postCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">City</label>
              <input
                type="text"
                name="pickup_city"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={pickupAddress.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Dropoff Address */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg border-b pb-2">Dropoff Address</h3>
            <div>
              <label className="block mb-1 text-sm font-medium">Unit/House No</label>
              <input
                type="text"
                name="dropoff_unitOrHouseNo"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dropoffAddress.unitOrHouseNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-sm font-medium">Suburb</label>
                <input
                  type="text"
                  name="dropoff_suburb"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={dropoffAddress.suburb}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Post Code</label>
                <input
                  type="text"
                  name="dropoff_postCode"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={dropoffAddress.postCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">City</label>
              <input
                type="text"
                name="dropoff_city"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dropoffAddress.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg border-b pb-2">Vehicle Options</h3>
            <div>
              <label className="block mb-1 text-sm font-medium">Select Vehicle</label>
              <select
                name="vehicleOptionId"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.vehicleOptionId}
                onChange={handleChange}
                required
              >
                <option value="">Select a vehicle</option>
                {vehicleData?.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} - {vehicle.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personnel Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg border-b pb-2">Crew Options</h3>
            <div>
              <label className="block mb-1 text-sm font-medium">Select Crew</label>
              <select
                name="personnelOptionId"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.personnelOptionId}
                onChange={handleChange}
                required
              >
                <option value="">Select crew option</option>
                {personalData?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} - {option.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end mt-6 gap-2">
          <button
              type="button"
              onClick={()=>setOpenDialog(false)}
              disabled={showLoader}
              className="px-6 py-2 bg-amber-600 text-white rounded-md cursor-pointer
               hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={showLoader || !checkInput()}
              className="px-6 py-2 bg-amber-600 text-white rounded-md cursor-pointer
               hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:ring-offset-2 transition-colors flex justify-center items-center gap-2"
            >
             {showLoader && <Loader/>} Confirm Booking
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}