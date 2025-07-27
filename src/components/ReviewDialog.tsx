import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Loader from "./Loader";
import axiosClient from "@/Services/AxiosRequest";
import { Customer_Review_Route } from "@/Routes";
import { toast } from "sonner";
import { getCustomerReview } from "@/Store/Slices/GetReview";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/Store";
import Cookies from "js-cookie";
import { getAdminReview } from "@/Store/Slices/GetAdminReviews";


interface ReviewDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  currentReview?: {
    id: string;
    name: string;
    rating: number;
    review: string;
    isShownInWebsite: boolean;
    createdAt: string;
  }|null;
  isEditMode?: boolean;
}

const ReviewDialog = ({ 
  openDialog, 
  setOpenDialog, 
  currentReview, 
  isEditMode = false 
}: ReviewDialogProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState({
    name: "",
    review: "",
    rating: 0,
    isShownInWebsite: true
  });

  useEffect(() => {
    if (currentReview?.id) {
      setData({
        name: currentReview.name,
        review: currentReview.review,
        rating: currentReview.rating,
        isShownInWebsite: currentReview.isShownInWebsite
      });
    } else {
      setData({
        name: "",
        review: "",
        rating: 0,
        isShownInWebsite: true
      });
    }
  }, [currentReview]);

  const handleFormData = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setShowLoader(true);
    
    try {
      const token =Cookies.get('token');

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      let response;
      if (isEditMode && currentReview?.id) {
        if (!token) {
          toast.error('Authentication required');
          return;
        }
        response = await axiosClient.put(
          `${Customer_Review_Route}/${currentReview.id}`,
          data,
          config
        );
      } else {
        
        response = await axiosClient.post(
          Customer_Review_Route,
          data,
          config
        );
      }
      if (response?.status === (isEditMode ? 204 : 201)) {
        dispatch(getCustomerReview());
        dispatch(getAdminReview());
        toast.success(`Review ${isEditMode ? 'updated' : 'submitted'} successfully`);
        setOpenDialog(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setShowLoader(false);
    }
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-md p-6 rounded-lg bg-white">
        <DialogTitle className="text-xl font-semibold mb-4">
          {isEditMode ? 'Edit Review' : 'Share Your Experience'}
        </DialogTitle>
        <DialogDescription ></DialogDescription>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name *</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleFormData}
              placeholder="Enter your name"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="text-2xl focus:outline-none cursor-pointer"
                  onClick={() => setData({...data, rating: star})}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {(hoverRating || data.rating) >= star ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Review *</label>
            <textarea
              name="review"
              value={data.review}
              onChange={handleFormData}
              placeholder="Tell us about your experience..."
              rows={4}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {isEditMode && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isShownInWebsite"
                name="isShownInWebsite"
                checked={data.isShownInWebsite}
                onChange={handleFormData}
                className="h-4 w-4 cursor-pointer"
              />
              <label htmlFor="isShownInWebsite" className="text-sm font-medium">
                Show on website
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={showLoader}
              onClick={() => setOpenDialog(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={data.rating === 0 || showLoader}
              className={`px-4 py-2 rounded-md ${
                data.rating === 0 ? 'bg-amber-300 cursor-not-allowed' : 
                'bg-amber-600 hover:bg-amber-700 cursor-pointer'
              } text-white flex justify-center items-center gap-2`}
            >
              {showLoader && <Loader/>} 
              {isEditMode ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;