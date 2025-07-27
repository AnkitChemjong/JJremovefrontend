import React from 'react';
import { FaStar, FaConciergeBell, FaAddressBook, FaEnvelope, FaEdit } from 'react-icons/fa';
import AdminNavbar from '@/components/AdminNavbar';
import AdminTop from '@/components/AdminTop';
import { useSelector } from 'react-redux';
import type { RootState } from '@/Store';
import { UpdateContactDialog } from '@/components/UpdateContactInfo';


const AdminDashboard = () => {
  const { data: reviews } = useSelector((state: RootState) => state.adminReview);
  const { data: serviceData } = useSelector((state: RootState) => state.services);
  const { data: contactData } = useSelector((state: RootState) => state.clientRequest);
  const { data: bookingRequestData } = useSelector((state: RootState) => state.bookingRequest);
  const { data: contactInfo } = useSelector((state: RootState) => state.contact);
  const {data: admin}=useSelector((state:RootState)=>state.currentAdmin);
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const stats = [
    { title: 'Total Reviews', value: reviews?.length || 0, icon: <FaStar className="text-blue-500" /> },
    { title: 'Total Services', value: serviceData?.length || 0, icon: <FaConciergeBell className="text-green-500" /> },
    { title: 'Contact Data', value: contactData?.length || 0, icon: <FaAddressBook className="text-yellow-500" /> },
    { title: 'Booking Requests', value: bookingRequestData?.length || 0, icon: <FaEnvelope className="text-red-500" /> }
  ];

  // Get recent 3 booking requests
  const recentBookingRequests = bookingRequestData 
    ? [...bookingRequestData].slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="lg:ml-64 p-4 md:p-6">
        <AdminTop />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="text-2xl">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info and Recent Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Contact Information</h2>
            { admin?.roles?.includes("ContactAdmin") &&
              <button 
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 px-3 py-1 cursor-pointer border rounded hover:bg-gray-100"
            >
              <FaEdit size={14} /> Edit
            </button>}
            </div>
            {contactInfo && (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">{contactInfo.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{contactInfo.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Primary Phone</p>
                    <p className="text-gray-800">{contactInfo.phone1}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Secondary Phone</p>
                    <p className="text-gray-800">{contactInfo.phone2}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Office Hours</p>
                  <p className="text-gray-800">{contactInfo.officeHours}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Map URL</p>
                  <a 
                    href={contactInfo.mapEmbedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View on Map
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Options in Booking</p>
                  <p className="text-gray-800">
                    {contactInfo?.showVehicleOptionsInBookingForm ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Booking Requests */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Booking Requests</h2>
            {recentBookingRequests.length > 0 ? (
              <div className="space-y-4">
                {recentBookingRequests.map((request:any, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center mb-1">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        {request.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h3 className="font-medium">{request.name || 'No Name'}</h3>
                        <p className="text-sm text-gray-500">{request.email || 'No Email'}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 pl-11">
                      {request.serviceType || 'Service not specified'}
                    </p>
                    <p className="text-sm text-gray-500 pl-11">
                      {request.moveDate ? new Date(request.moveDate).toLocaleDateString() : 'No date specified'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent booking requests</p>
            )}
          </div>
        </div>

        {/* Update Contact Dialog */}
        {contactInfo && (
          <UpdateContactDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            contactInfo={contactInfo}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;