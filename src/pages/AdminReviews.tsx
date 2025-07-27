import { useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { FiStar, FiTrash2, FiEdit } from 'react-icons/fi';
import AdminTop from '@/components/AdminTop';
import { useSelector } from 'react-redux';
import { type RootState } from '@/Store';
import ReviewDialog from '@/components/ReviewDialog';
import axiosClient from '@/Services/AxiosRequest';
import { Customer_Review_Route } from '@/Routes';
import { toast } from 'sonner';
import { getCustomerReview } from '@/Store/Slices/GetReview';
import { useDispatch } from 'react-redux';
import { type AppDispatch } from '@/Store';
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
import Loader from '@/components/Loader';
import Cookies from 'js-cookie';
import { getAdminReview } from '@/Store/Slices/GetAdminReviews';

type Review = {
  id: string;
  name: string;
  rating: number;
  createdAt: string;
  review: string;
  isShownInWebsite: boolean;
};

const AdminReviews = () => {
  const { data: reviews = [] } = useSelector((state: RootState) => state.adminReview);
  const {data:admin}=useSelector((state:RootState)=>state.currentAdmin);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const reviewsPerPage = 4;
  const dispatch = useDispatch<AppDispatch>();
  const [showLoader, setShowLoader] = useState(false);

  // Format date as "Month Day, Year" (e.g., "January 15, 2024")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            className={`${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-500">({rating}/5)</span>
      </div>
    );
  };

  // Delete review function
  const deleteReview = async () => {
    if (!reviewToDelete) return;
     setShowLoader(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axiosClient.delete(
        `${Customer_Review_Route}/${reviewToDelete}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response?.status === 200||204) {
        dispatch(getCustomerReview());
        dispatch(getAdminReview());
        setOpenDeleteDialog(false);
        setReviewToDelete(null);
        if (currentReviews?.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        toast.success('Review deleted successfully');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete review");
    } finally {
      setShowLoader(false);
    }
  };

  // Edit review function
  const editReview = (review: Review) => {
    setCurrentReview(review);
    setOpenDialog(true);
  };

  // Handle review deletion click
  const handleDeleteClick = (id: string) => {
    setReviewToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews?.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil((reviews? reviews?.length:0) / reviewsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="lg:ml-64 p-4 md:p-6 w-full">
        <AdminTop/>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Review Management</h2>
          <p className="text-gray-600">{reviews?.length} total reviews</p>
        </div>

        {(reviews? reviews?.length:0) > 0 ? (
          <>
            <div className="space-y-6 mb-8">
              {currentReviews?.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{review.name}</h3>
                      <div className="mt-1">
                        {renderStars(review.rating)}
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                          review.isShownInWebsite 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {review.isShownInWebsite ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{review.review}</p>
                  {
                    admin?.roles?.includes("ReviewAdmin") &&

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                    <button 
                      onClick={() => editReview(review)}
                      className="p-2 text-blue-600 hover:text-blue-800
                      cursor-pointer hover:bg-blue-50 rounded-md"
                      title="Edit review"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(review.id)}
                      className="p-2 text-red-600 hover:text-red-800
                      cursor-pointer hover:bg-red-50 rounded-md"
                      title="Delete review"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  }
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h3 className="text-lg font-medium text-gray-700">No Reviews Found</h3>
            <p className="text-gray-500 mt-2">There are no reviews to display at this time.</p>
          </div>
        )}
      </div>

      {/* Review Dialog for editing */}
      <ReviewDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        currentReview={currentReview}
        isEditMode={true}
      />

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer' disabled={showLoader}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteReview}
              disabled={showLoader}
              className="bg-red-600 hover:bg-red-700 flex justify-center cursor-pointer items-center gap-10"
            >
              {showLoader && <Loader/>} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReviews;