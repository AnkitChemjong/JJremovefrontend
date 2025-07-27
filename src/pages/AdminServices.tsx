// src/pages/admin/ServicesPage.tsx
import { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { FaEye } from "react-icons/fa";
import AdminNavbar from '@/components/AdminNavbar';
import { ServiceDialog } from '@/components/ServiceDialog';
import ServiceDrawer from '@/components/ServiceDrawer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AdminTop from '@/components/AdminTop';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/Store';
import Cookies from 'js-cookie';
import axiosClient from '@/Services/AxiosRequest';
import Loader from '@/components/Loader';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Create_Service_Route } from '@/Routes';
import { getServices } from '@/Store/Slices/GetServices';

type Service = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  iconUrl: string;
  imageUrl1:string;
  imageUrl2: string;
  imageUrl3:string;
};

const AdminServices = () => {
  const { data: serviceData } = useSelector((state: RootState) => state?.services);
  const {data:admin}=useSelector((state:RootState)=>state.currentAdmin);
  const [openDialog, setOpenDialog] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const dispatch=useDispatch<AppDispatch>();
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);


  const handleAddService = () => {
    setCurrentService({
      id: '',
      name: '',
      description: '',
      sortOrder: 0,
      isActive: true,
      iconUrl: '',
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
    });
    setOpenDialog(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setOpenDialog(true);
  };

  const handleViewClick = (data: Service) => {
    setCurrentService(data);
    setOpenDrawer(true);
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
  };

  const confirmDelete = async () => {
    try{
      setShowLoader(true);
      const token=Cookies.get('token');
      if(token){
      const response=await axiosClient.delete(`${Create_Service_Route}/${serviceToDelete?.id}`, {
        headers:{
          "Authorization": `Bearer ${token}`
        }
      });
      //console.log("Delete response:", response);
      if(response?.status === 204){
      dispatch(getServices());
      toast.success("Service deleted successfully.");
      setServiceToDelete(null); 
      }
      }
    }
    catch(error:any){
         console.log("Error deleting service:", error);
         toast.error(error?.response?.data?.message || "Failed to delete service.");
    }
    finally{
      setShowLoader(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="lg:ml-64 p-4 md:p-6 w-full">
        <AdminTop />

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">All Services ({serviceData?.length})</h2>
            {
              admin?.roles?.includes("FormAdmin") &&

            <button
              onClick={handleAddService}
              className="flex items-center px-4 py-2 bg-amber-600 text-white
              cursor-pointer rounded-md hover:bg-amber-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add New Service
            </button>
            }
          </div>

          <ScrollArea className="w-full whitespace-nowrap rounded-md border h-[calc(100vh-300px)]">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-left min-w-[80px]">No</TableHead>
                  <TableHead className="text-left min-w-[200px]">Title</TableHead>
                  <TableHead className="text-left min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceData?.map((service,index) => (
                  <TableRow key={service.id}>
                    <TableCell className="text-sm text-gray-500">{index+1}</TableCell>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        { admin?.roles?.includes("FormAdmin") &&
                        <>
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-2 text-yellow-600 cursor-pointer hover:text-yellow-800 hover:bg-yellow-50 rounded-md"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                  
                          <button
                            onClick={() => handleDeleteClick(service)}
                            className="p-2 cursor-pointer text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                          }
                    
                        <button
                          onClick={() => handleViewClick(service)}
                          className="p-2 cursor-pointer text-blue-600  hover:text-blue-800 hover:bg-blue-50 rounded-md"
                          title="View"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </div>

      <ServiceDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        currentService={currentService}
      />

      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
            disabled={showLoader}
             className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
            disabled={showLoader}
             className='flex justify-center 
             cursor-pointer items-center gap-10 bg-red-600 hover:bg-red-700' 
             onClick={confirmDelete}>
             {showLoader && <Loader/>} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {openDrawer && currentService && (
        <ServiceDrawer
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          currentService={currentService}
        />
      )}
    </div>
  );
};

export default AdminServices;
