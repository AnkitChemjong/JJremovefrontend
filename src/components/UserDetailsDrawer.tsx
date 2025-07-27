import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import axiosClient from '@/Services/AxiosRequest';
import { Delete_Admin_Route } from '@/Routes';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/Store';
import { getUsers } from '@/Store/Slices/GetAdmins';
import Loader from '@/components/Loader';
import AdminSideDialog from './AdminSideDialog';

interface UserDetailsDrawerProps {
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
    photoUrl?: string;
    designation?: string;
    description?: string;
    showOnWebsite?: boolean;
    joiningDate?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsDrawer = ({ user, isOpen, onClose }: UserDetailsDrawerProps) => {
  const { data: currentAdmin } = useSelector((state: RootState) => state?.currentAdmin);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = async () => {
    try {
      setShowLoader(true);
      const token = Cookies.get('token');
      if (token) {
        await axiosClient.delete(`${Delete_Admin_Route}/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          dispatch(getUsers());
          setIsDeleteDialogOpen(false);
          onClose();
          toast.success(response?.data?.message || "Admin deleted successfully");
        }).catch((error: any) => {
          toast.error(error?.response?.data?.message || "Failed to delete admin");
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to delete admin");
    } finally {
      setShowLoader(false);
    }
  };

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  return (
    <>
      {/* Drawer */}
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[95vh] pb-10">
          <ScrollArea className="h-full w-full">
            <div className="mx-auto w-full max-w-2xl flex flex-col h-full">
              <DrawerHeader>
                <DrawerTitle>User Details</DrawerTitle>
                <DrawerDescription>
                  View and manage user information
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-4 space-y-6 pb-6 flex-1">
                {/* User Photo Section */}
                <div className="flex justify-center">
                  {user.photoUrl ? (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL}/${user.photoUrl}`}
                        alt={`${user.name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 flex justify-center items-center border-gray-200">
                      <h1 className='text-black font-bold text-2xl'>{user?.username[0].toUpperCase()}</h1>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium break-all">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Roles</p>
                    <p className="font-medium">{user.roles.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <DrawerFooter className="flex-row justify-end gap-3 pt-0">
                {currentAdmin?.roles?.includes("FormAdmin") && currentAdmin?.id!=user?.id && (
                  <Button
                    variant="outline"
                    className="gap-2 text-white hover:text-white bg-amber-600 hover:bg-amber-700 cursor-pointer"
                    onClick={handleEdit}
                  >
                    <FiEdit2 className="h-4 w-4" />
                    Edit
                  </Button>
                )}

                {currentAdmin?.roles?.includes("FormAdmin") && user?.id !== currentAdmin?.id && (
                  <Button
                    variant="destructive"
                    className="gap-2 cursor-pointer"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Delete
                  </Button>
                )}

                <Button variant="outline" className='cursor-pointer' onClick={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Edit Dialog */}
      {showEditDialog && (
        <AdminSideDialog
          type="edituser"
          openDialog={showEditDialog}
          setOpenDialog={setShowEditDialog}
          editUser={user}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 cursor-pointer hover:bg-red-700 gap-2"
            >
              {showLoader && <Loader />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserDetailsDrawer;