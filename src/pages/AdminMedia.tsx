import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FiTrash2, FiEdit, FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/Store';
import { toast } from 'sonner';
import axiosClient from '@/Services/AxiosRequest';
import { Get_Gallery_Media_Route } from '@/Routes';
import { getGalleryMedia } from '@/Store/Slices/GalleryMedia';
import { MediaDialog } from '@/components/MediaDialog';
import Cookies from 'js-cookie';
import AdminNavbar from '@/components/AdminNavbar';
import AdminTop from '@/components/AdminTop';
import { type MediaFile } from '@/components/MediaDialog';
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

const AdminMedia = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: mediaData } = useSelector((state: RootState) => state.galleryMediaData);
  const { data: admin } = useSelector((state: RootState) => state.currentAdmin);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFile, setCurrentFile] = useState<MediaFile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 6;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedia = mediaData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((mediaData?.length || 0) / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const extractYouTubeId = (url?: string): string => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleDeleteConfirmation = (id: string) => {
    setMediaToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMedia = async () => {
    if (!mediaToDelete) return;
    
    try {
      setIsDeleting(true);
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      await axiosClient.delete(`${Get_Gallery_Media_Route}/${mediaToDelete}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      toast.success('Media deleted successfully');
      dispatch(getGalleryMedia());
      
      // Adjust pagination if we deleted the last item on the page
      if (currentMedia?.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error deleting media');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setMediaToDelete(null);
    }
  };

  const handleOpenDialog = (file?: any) => {
    setCurrentFile(file || null);
    setOpenDialog(true);
  };

  const handleSuccess = () => {
    dispatch(getGalleryMedia());
    setCurrentPage(1);
  };

  const getImageUrl = (url: string) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    return `${baseUrl}${url}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="lg:ml-64 p-4 md:p-6">
        <AdminTop />

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Media Gallery ({mediaData?.length || 0})
          </h2>

          {admin?.roles?.includes("GalleryAdmin") &&
            <Button 
              onClick={() => handleOpenDialog()} 
              className="bg-amber-600 hover:bg-amber-700 cursor-pointer"
            >
              <FiPlus className="mr-2" /> Add Media
            </Button>
          }
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          {(mediaData?.length || 0) > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {currentMedia?.map((media) => (
                  <div key={media.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {media.type === 'Image' ? (
                      <div className="relative aspect-square bg-gray-100">
                        <img 
                          src={getImageUrl(media.url)} 
                          alt={media.caption} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                            console.error('Failed to load image:', media.url);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-video bg-gray-100">
                        {media?.url ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(media.url)}?rel=0`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={media.caption}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500">No video URL provided</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800 line-clamp-2">
                          {media.caption}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded ml-2 ${
                          media.type === 'Image' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {media.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">
                          Order: {media.sortOrder}
                        </span>
                        {admin?.roles?.includes("GalleryAdmin") &&
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenDialog(media)}
                            className="text-blue-600 hover:bg-blue-50 cursor-pointer"
                          >
                            <FiEdit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteConfirmation(media.id)}
                            className="text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <FiTrash2 size={16} />
                          </Button>
                        </div>
                        }
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Added: {formatDate(media.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No media found in your gallery</p>
              <Button 
                onClick={() => handleOpenDialog()} 
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <FiPlus className="mr-2" /> Add Your First Media
              </Button>
            </div>
          )}
        </div>

        <MediaDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          currentFile={currentFile}
          onSuccess={handleSuccess}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this media item? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                disabled={isDeleting}
                className="cursor-pointer"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteMedia}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 cursor-pointer flex items-center gap-2"
              >
                {isDeleting && <Loader className="h-4 w-4 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default AdminMedia;