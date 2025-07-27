import { useEffect, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Loader from "./Loader";
import { toast } from "sonner";
import type { AppDispatch } from "@/Store";
import { useDispatch } from "react-redux";
import { getServices } from "@/Store/Slices/GetServices";
import axiosClient from "@/Services/AxiosRequest";
import { Create_Service_Route } from "@/Routes";
import Cookies from "js-cookie";

type Service = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  iconUrl: File | string | null;
  imageUrl1: File | string | null;
  imageUrl2: File | string | null;
  imageUrl3: File | string | null;
};

type ServiceDialogProps = {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  currentService: Service | null;
};

type ServiceErrors = {
  name?: string;
  description?: string;
  sortOrder?: string;
  iconUrl?: string;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
};

export const ServiceDialog = ({
  openDialog,
  setOpenDialog,
  currentService,
}: ServiceDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showLoader, setShowLoader] = useState(false);
  const [errors, setErrors] = useState<ServiceErrors>({});
  const [formData, setFormData] = useState<Service>({
    id: "",
    name: "",
    description: "",
    sortOrder: 0,
    isActive: true,
    iconUrl: null,
    imageUrl1: null,
    imageUrl2: null,
    imageUrl3: null,
  });

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(formData).forEach(value => {
        if (value instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(value));
        }
      });
    };
  }, [formData]);

  // Initialize form data
  useEffect(() => {
    if (currentService) {
      setFormData(currentService);
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        sortOrder: 0,
        isActive: true,
        iconUrl: null,
        imageUrl1: null,
        imageUrl2: null,
        imageUrl3: null,
      });
    }
    setErrors({});
  }, [currentService, openDialog]);

  const validateForm = (): boolean => {
    const newErrors: ServiceErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = "Sort order must be 0 or greater";
    }

    if (!formData.id && !formData.iconUrl) {
      newErrors.iconUrl = "Icon is required";
    }

    if (!formData.id && !formData.imageUrl1) {
      newErrors.imageUrl1 = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFiles = (): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSizeMB = 5;

    if (formData.iconUrl instanceof File) {
      if (!validTypes.includes(formData.iconUrl.type)) {
        toast.error('Icon must be a JPEG, PNG, or WebP image');
        return false;
      }
      if (formData.iconUrl.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Icon image must be less than ${maxSizeMB}MB`);
        return false;
      }
    }

    // Validate other images if they exist
    const imageFields = [formData.imageUrl1, formData.imageUrl2, formData.imageUrl3];
    for (const image of imageFields) {
      if (image instanceof File) {
        if (!validTypes.includes(image.type)) {
          toast.error('All images must be JPEG, PNG, or WebP');
          return false;
        }
        if (image.size > maxSizeMB * 1024 * 1024) {
          toast.error(`All images must be less than ${maxSizeMB}MB`);
          return false;
        }
      }
    }

    return true;
  };

  const handleFormData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name in errors) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleToggleActive = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !validateFiles()) {
      return;
    }

    setShowLoader(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const form = new FormData();

      // Append text fields
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("sortOrder", String(formData.sortOrder));
      form.append("isActive", String(formData.isActive));

      // Handle file uploads 
      if (formData.iconUrl instanceof File) {
        form.append("iconFile", formData.iconUrl);
      } else if (typeof formData.iconUrl === "string") {
        form.append("iconFile", formData.iconUrl);
      }

      if (formData.imageUrl1 instanceof File) {
        form.append("imageFile1", formData.imageUrl1);
      } else if (typeof formData.imageUrl1 === "string") {
        form.append("imageFile1", formData.imageUrl1);
      }

      if (formData.imageUrl2 instanceof File) {
        form.append("imageFile2", formData.imageUrl2);
      } else if (typeof formData.imageUrl2 === "string") {
        form.append("imageFile2", formData.imageUrl2);
      }

      if (formData.imageUrl3 instanceof File) {
        form.append("imageFile3", formData.imageUrl3);
      } else if (typeof formData.imageUrl3 === "string") {
        form.append("imageFile3", formData.imageUrl3);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = formData.id
        ? await axiosClient.put(
            `${Create_Service_Route}/${formData.id}`,
            form,
            config
          )
        : await axiosClient.post(Create_Service_Route, form, config);

      toast.success(
        response.data?.message ||
          (formData.id ? "Service updated!" : "Service added!")
      );
      dispatch(getServices());
      setOpenDialog(false);
    } catch (err: any) {
      console.error("Upload error:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
      toast.error(err.response?.data?.message || "Failed to save service. Please check the file formats and sizes.");
    } finally {
      setShowLoader(false);
    }
  };

  const getImagePreview = (field: keyof Service): string | null => {
    const value = formData[field];
    
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    
    if (typeof value === "string" && value) {
      // Remove any leading slash to prevent double slashes
      const cleanPath = value.startsWith("/") ? value.substring(1) : value;
      return `${import.meta.env.VITE_SERVER_URL}/${cleanPath}`;
    }
    
    return null;
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-2xl w-full max-h-[80vh] p-0 flex flex-col">
        <DialogHeader className="flex justify-between items-center p-4 border-b">
          <DialogTitle>
            {formData.id ? "Edit Service" : "Add New Service"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <ScrollArea className="px-6 py-4 overflow-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Service Name *</Label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleFormData}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormData}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.description ? "border-red-500" : ""
                    }`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="sortOrder">Sort Order *</Label>
                  <input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={handleFormData}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.sortOrder ? "border-red-500" : ""
                    }`}
                  />
                  {errors.sortOrder && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.sortOrder}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleToggleActive}
                  />
                  <Label htmlFor="isActive">
                    {formData.isActive ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                {["iconUrl", "imageUrl1", "imageUrl2", "imageUrl3"].map(
                  (field) => {
                    const previewUrl = getImagePreview(field as keyof Service);
                    const isRequired =
                      field === "iconUrl" || (field === "imageUrl1" && !formData.id);

                    return (
                      <div key={field}>
                        <Label htmlFor={field}>
                          {field === "iconUrl"
                            ? "Service Icon"
                            : `Image ${field.slice(-1)}`}
                          {isRequired ? " *" : ""}
                        </Label>
                        <input
                          id={field}
                          name={field}
                          type="file"
                          accept="image/*"
                          onChange={handleFormData}
                          className={`w-full p-2 border rounded-md ${
                            errors[field as keyof ServiceErrors]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors[field as keyof ServiceErrors] && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[field as keyof ServiceErrors]}
                          </p>
                        )}
                        {previewUrl ? (
                          <div className="mt-2">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-32 h-20 object-contain border rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder-image.jpg";
                              }}
                            />
                            <p className="text-xs text-gray-500 mt-1">Preview</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">
                            {isRequired
                              ? "Required"
                              : "Optional"}
                          </p>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="flex justify-end items-center gap-4 p-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpenDialog(false)}
            disabled={showLoader}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={showLoader}
            className="cursor-pointer flex justify-center bg-amber-600 hover:bg-amber-700 items-center gap-2"
          >
            {showLoader && <Loader />}
            {formData.id ? "Save Changes" : "Add Service"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};