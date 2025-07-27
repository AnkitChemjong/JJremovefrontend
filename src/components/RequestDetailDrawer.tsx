import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
  } from "@/components/ui/drawer";
  import type { AdminBookingRequests } from '@/Store/Slices/GetBookingRequest';
  
  interface RequestDetailsDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    request: AdminBookingRequests | null;
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const RequestDetailsDrawer = ({ 
    isOpen, 
    onOpenChange, 
    request 
  }: RequestDetailsDrawerProps) => {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Request Details</DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-4">
            {request && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Customer Information</h3>
                    <p><span className="text-gray-500">Name:</span> {request.name}</p>
                    <p><span className="text-gray-500">Contact:</span> {request.contactNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Moving Details</h3>
                    <p><span className="text-gray-500">Desired Date:</span> {formatDate(request.desiredDate)}</p>
                    <p><span className="text-gray-500">Desired Time:</span> {request.desiredTime}</p>
                  </div>
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Pickup Address</h3>
                    <p>{request.pickupAddress.unitOrHouseNo}</p>
                    <p>{request.pickupAddress.suburb}</p>
                    <p>{request.pickupAddress.city} {request.pickupAddress.postCode}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Dropoff Address</h3>
                    <p>{request.dropoffAddress.unitOrHouseNo}</p>
                    <p>{request.dropoffAddress.suburb}</p>
                    <p>{request.dropoffAddress.city} {request.dropoffAddress.postCode}</p>
                  </div>
                </div>
  
                <div className="space-y-2">
                  <h3 className="font-medium">Additional Information</h3>
                  <p><span className="text-gray-500">Submitted At:</span> {formatDate(request.submittedAt)}</p>
                  <p><span className="text-gray-500">Request ID:</span> {request.id}</p>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  };
  
  export default RequestDetailsDrawer;