import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { ScrollArea } from './ui/scroll-area';
import type { AppDispatch, RootState } from '@/Store';
import { useDispatch, useSelector } from 'react-redux';
import { validateChangePassInput } from '@/Services/ValidateData';
import axiosClient from '@/Services/AxiosRequest';
import Cookies from 'js-cookie';
import { Admin_Change_Pass_Route, Create_User_Route, Update_User_Route } from '@/Routes';
import { toast } from 'sonner';
import Loader from './Loader';
import { getUsers } from '@/Store/Slices/GetAdmins';
import { getTeam } from '@/Store/Slices/GetPublicUsers';

export interface AdminFormData1 {
  currentPassword: string;
  newPassword: string;
}

export interface UserFormData {
  name: string;
  email: string;
  designation: string;
  description: string;
  photoFile?: File | null;
  showOnWebsite: boolean;
  joiningDate: string;
  currentPassword?: string; 
  newPassword?: string;
  // Admin upgrade fields
  upgradeToAdmin: boolean;
  username: string;
  password: string;
  roles: string[];
}

// Define a union type for all possible error types
export type FormErrors = {
  name?: string;
  email?: string;
  designation?: string;
  description?: string;
  photoFile?: string;
  currentPassword?: string;
  newPassword?: string;
  username?: string;
  password?: string;
  roles?: string;
};

interface AdminSideDialogProps {
  type: string;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  editUser?: {
    id: string;
    username: string;
    name: string;
    email: string;
    roles: string[];
    photoUrl?: string;
    designation?: string;
    description?: string;
    showOnWebsite?: boolean;
    joiningDate?: string;
  };
}

const ADMIN_ROLES = [
  "LoginAdmin",
  "BookingAdmin",
  "ContactAdmin",
  "MessageAdmin",
  "ReviewAdmin",
  "FaqAdmin",
  "NotesAdmin",
  "GalleryAdmin",
  "NoticeAdmin",
  "FormAdmin",
  "SocialLinkAdmin"
];



const AdminSideDialog = ({ type, openDialog, setOpenDialog, editUser }: AdminSideDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: admin } = useSelector((state: RootState) => state.currentAdmin);
  const [showLoader, setShowLoader] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    designation: '',
    description: '',
    photoFile: null,
    showOnWebsite: true,
    joiningDate: new Date().toISOString(),
    upgradeToAdmin: false,
    username: '',
    password: '',
    roles: []
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<FormErrors>({});


  const validateUserInput = (data: UserFormData) => {
    const errors: FormErrors = {};
    if (!data.name.trim()) {
      errors.name = 'Full name is required';
    } else if (data.name.length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    } else if (data.name.length > 50) {
      errors.name = 'Full name cannot exceed 50 characters';
    }
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!data.designation.trim()) {
      errors.designation = 'Designation is required';
    } else if (data.designation.length > 50) {
      errors.designation = 'Designation cannot exceed 50 characters';
    }
  
    if (data.description && data.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
  
    if (type === 'createuser' && !data.photoFile) {
      errors.photoFile = 'Profile photo is required';
    }
  
    // Admin upgrade validations
    if (data.upgradeToAdmin) {
      if (!data.username.trim()) {
        errors.username = 'Username is required';
      } else if (data.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      }
      
      if ((type === 'createuser' || (type === 'edituser' && data.password)) && !data.password.trim()) {
        errors.password = 'Password is required';
      } else if (data.password && data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (data.roles.length === 0) {
        errors.roles = 'At least one role must be selected';
      }
    }
  
    return errors;
  };

  // Initialize form data when editing
  useEffect(() => {
    if (type === 'edituser' && editUser) {
      setFormData({
        name: editUser.name || '',
        email: editUser.email || '',
        designation: editUser.designation || '',
        description: editUser.description || '',
        photoFile: null,
        showOnWebsite: editUser.showOnWebsite ?? true,
        joiningDate: editUser.joiningDate || new Date().toISOString(),
        upgradeToAdmin: editUser.roles && editUser.roles.length > 0,
        username: editUser.username || '',
        password: '',
        roles: editUser.roles || []
      });
      
      // Set preview image if exists
      if (editUser.photoUrl) {
        setPreviewImage(`${import.meta.env.VITE_SERVER_URL}/${editUser.photoUrl}`);
      }
    }
  }, [type, editUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));

    // Clear error when user types
    if (error[name as keyof typeof error]) {
      setError(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
    
    if (error.roles) {
      setError(prev => ({ ...prev, roles: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file (JPEG, PNG, etc.)');
        setError(prev => ({ ...prev, photoFile: 'Invalid file type' }));
        return;
      }
      
      // Validate file size (e.g., 5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        setError(prev => ({ ...prev, photoFile: 'File size too large' }));
        return;
      }

      setFormData(prev => ({ ...prev, photoFile: file }));
      setError(prev => ({ ...prev, photoFile: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoader(true);
    
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Authentication token missing');
        return;
      }

      if (type === "passchange") {
        const payload = {
          adminId: admin?.id,
          currentPassword: formData.currentPassword || '',
          newPassword: formData.newPassword || ''
        };
        
        const errors = validateChangePassInput(payload);
        setError(errors);
        
        if (errors.currentPassword || errors.newPassword) {
          return;
        }

        const response = await axiosClient.post(Admin_Change_Pass_Route, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response?.status === 200) {
          setOpenDialog(false);
          setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
          setError({});
          toast.success(response?.data?.message || 'Password changed successfully');
        }
      } 
      else if (type === "createuser" || type === "edituser") {
        // Validate user input
        const errors = validateUserInput(formData);
        setError(errors);
        
        // Check if there are any errors
        if (Object.values(errors).some(error => error)) {
          return;
        }

        // Create FormData object for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('designation', formData.designation);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('showOnWebsite', formData.showOnWebsite.toString());
        formDataToSend.append('joiningDate', formData.joiningDate);
        
        if (formData.photoFile) {
          formDataToSend.append('photo', formData.photoFile);
        }

        // Add admin fields if upgrading
        if (formData.upgradeToAdmin) {
          formDataToSend.append('username', formData.username);
          if (formData.password) {
            formDataToSend.append('password', formData.password);
          }
          formData.roles.forEach(role => {
            formDataToSend.append('roles', role);
          });
        }

        let response;
        if (type === "createuser") {
          response = await axiosClient.post(Create_User_Route, formDataToSend, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          response = await axiosClient.put(`${Update_User_Route}/${editUser?.id}`, formDataToSend, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        if (response?.status === 200) {
          setOpenDialog(false);
          dispatch(getUsers());
          dispatch(getTeam());
          resetForm();
          toast.success(response?.data?.message || 
            (type === "createuser" ? 'User created successfully' : 'User updated successfully'));
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setShowLoader(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      designation: '',
      description: '',
      photoFile: null,
      showOnWebsite: true,
      joiningDate: new Date().toISOString(),
      upgradeToAdmin: false,
      username: '',
      password: '',
      roles: []
    });
    setPreviewImage(null);
    setError({});
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderChangePasswordForm = () => (
    <>
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
          Current Password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.currentPassword || ''}
          onChange={handleChange}
        />
        {error?.currentPassword && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.currentPassword}</p>}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.newPassword || ''}
          onChange={handleChange}
          minLength={8}
        />
        {error?.newPassword && <p className='text-sm text-red-600 font-normal mt-2 ml-5'>{error?.newPassword}</p>}
      </div>
    </>
  );

  const renderUserForm = () => (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
          />
          {error?.name && <p className='text-sm text-red-600 font-normal mt-1'>{error?.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
          />
          {error?.email && <p className='text-sm text-red-600 font-normal mt-1'>{error?.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="designation" className="block text-sm font-medium mb-1">
            Designation *
          </label>
          <input
            id="designation"
            name="designation"
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.designation}
            onChange={handleChange}
          />
          {error?.designation && <p className='text-sm text-red-600 font-normal mt-1'>{error?.designation}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
          {error?.description && <p className='text-sm text-red-600 font-normal mt-1'>{error?.description}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">
            Profile Photo {type === 'createuser' ? '*' : ''}
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={triggerFileInput}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
            >
              Choose File
            </button>
            {previewImage && (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.photoFile ? formData.photoFile.name : (type === 'edituser' ? 'Keep existing photo or select new one' : 'No file selected')}
          </p>
          {error?.photoFile && <p className='text-sm text-red-600 font-normal mt-1'>{error?.photoFile}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="joiningDate" className="block text-sm font-medium mb-1">
            Joining Date
          </label>
          <input
            id="joiningDate"
            name="joiningDate"
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.joiningDate.slice(0, 16)}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showOnWebsite"
            name="showOnWebsite"
            checked={formData.showOnWebsite}
            onChange={handleChange}
            className="h-4 w-4 rounded cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="showOnWebsite" className="text-sm font-medium text-gray-700">
            Show on Website
          </label>
        </div>

        {/* Upgrade to Admin Section */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="upgradeToAdmin"
              name="upgradeToAdmin"
              checked={formData.upgradeToAdmin}
              onChange={handleChange}
              className="h-4 w-4 rounded cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="upgradeToAdmin" className="text-sm font-medium text-gray-700">
              Upgrade to Admin
            </label>
          </div>

          {formData.upgradeToAdmin && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-md">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username *
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.username}
                  onChange={handleChange}
                />
                {error?.username && <p className='text-sm text-red-600 font-normal mt-1'>{error?.username}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password {type === 'createuser' ? '*' : '(Leave empty to keep current)'}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                />
                {error?.password && <p className='text-sm text-red-600 font-normal mt-1'>{error?.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">
                  Admin Roles *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ADMIN_ROLES.map(role => (
                    <div key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        id={role}
                        checked={formData.roles.includes(role)}
                        onChange={(e) => handleRoleChange(role, e.target.checked)}
                        className="h-4 w-4 rounded cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={role} className="ml-2 text-sm text-gray-700">
                        {role.replace('Admin', '')}
                      </label>
                    </div>
                  ))}
                </div>
                {error?.roles && <p className='text-sm text-red-600 font-normal mt-1'>{error?.roles}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent className="w-full max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-hidden">
    <DialogHeader>
      <DialogTitle>
        {type === "passchange"
          ? "Change Password"
          : type === "createuser"
          ? "Create New User"
          : "Edit User"}
      </DialogTitle>
      <DialogDescription>
        {type === "passchange"
          ? "Update your account password"
          : type === "createuser"
          ? "Fill in the details to create a new user"
          : "Update user details"}
      </DialogDescription>
    </DialogHeader>

    <ScrollArea className="max-h-[70vh] w-full rounded-md px-2 sm:px-4">
      <form onSubmit={handleSubmit} className="space-y-4 pb-6">
        {type === "passchange"
          ? renderChangePasswordForm()
          : renderUserForm()}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setOpenDialog(false);
              resetForm();
            }}
            className="px-4 py-2 border cursor-pointer rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 cursor-pointer text-white rounded-md text-sm font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center gap-5"
            disabled={showLoader}
          >
            {showLoader && <Loader />}
            {type === "passchange"
              ? "Change Password"
              : type === "createuser"
              ? "Create User"
              : "Update User"}
          </button>
        </div>
      </form>
    </ScrollArea>
  </DialogContent>
</Dialog>

  );
};

export default AdminSideDialog;