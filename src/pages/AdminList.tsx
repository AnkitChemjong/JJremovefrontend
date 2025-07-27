import { useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { FiEye } from 'react-icons/fi';
import AdminTop from '@/components/AdminTop';
import { useSelector } from 'react-redux';
import type { RootState } from '@/Store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserDetailsDrawer from '../components/UserDetailsDrawer';

interface Admin {
  id: string;
  username: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

const AdminList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 10;
  const [selectedUser, setSelectedUser] = useState<Admin | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: users } = useSelector((state: RootState) => state.users);

  const handleViewUser = (user: Admin) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  // Pagination logic
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = users?.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil((users?.length || 0) / adminsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="lg:ml-64 p-4 md:p-6 w-full">
        <AdminTop />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        </div>

        {/* Admins Table */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">All Admins ({users?.length || 0})</h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAdmins?.map((admin: Admin, index: number) => (
                <TableRow key={admin.id}>
                  <TableCell>{indexOfFirstAdmin + index + 1}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.username||"NA"}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleViewUser(admin)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer hover:bg-blue-50 rounded-md p-2"
                      title="View Details"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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

      {/* User Details Drawer */}
      {selectedUser && (
        <UserDetailsDrawer 
          user={selectedUser}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminList;