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
import axiosClient from "@/Services/AxiosRequest";
import Cookies from "js-cookie";

type TeamMember = {
  id?: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: File | string | null;
  isActive: boolean;
};

type TeamDialogProps = {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  currentMember: TeamMember | null;
};

type TeamErrors = {
  name?: string;
  position?: string;
  bio?: string;
  imageUrl?: string;
};

export const TeamDialog = ({
  openDialog,
  setOpenDialog,
  currentMember,
}: TeamDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showLoader, setShowLoader] = useState(false);
  const [errors, setErrors] = useState<TeamErrors>({});
  const [formData, setFormData] = useState<TeamMember>({
    id: "",
    name: "",
    position: "",
    bio: "",
    imageUrl: null,
    isActive: true,
  });

  // Initialize form data
  useEffect(() => {
    if (currentMember) {
      setFormData(currentMember);
    } else {
      setFormData({
        id: "",
        name: "",
        position: "",
        bio: "",
        imageUrl: null,
        isActive: true,
      });
    }
    setErrors({});
  }, [currentMember, openDialog]);

  const validateForm = (): boolean => {
    const newErrors: TeamErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    if (!formData.id && !formData.imageUrl) {
      newErrors.imageUrl = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormData = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData(prev => ({ ...prev, imageUrl: file }));
      setErrors(prev => ({ ...prev, imageUrl: undefined }));
    }
  };

  const handleToggleActive = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
      form.append("name", formData.name);
      form.append("position", formData.position);
      form.append("bio", formData.bio);
      form.append("isActive", String(formData.isActive));

      // Handle image upload
      if (formData.imageUrl instanceof File) {
        form.append("image", formData.imageUrl);
      } else if (typeof formData.imageUrl === "string") {
        form.append("imageUrl", formData.imageUrl);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      // Uncomment when routes are ready
      // const response = formData.id
      //   ? await axiosClient.put(`${Create_Team_Route}/${formData.id}`, form, config)
      //   : await axiosClient.post(Create_Team_Route, form, config);

      // toast.success(
      //   response.data?.message ||
      //     (formData.id ? "Team member updated!" : "Team member added!")
      // );
      // dispatch(getTeamMembers());
      // setOpenDialog(false);
    } catch (err: any) {
      console.error("Error saving team member:", err);
      toast.error(err.response?.data?.message || "Failed to save team member");
    } finally {
      setShowLoader(false);
    }
  };

  const getImagePreview = (): string | null => {
    if (formData.imageUrl instanceof File) {
      return URL.createObjectURL(formData.imageUrl);
    }
    if (typeof formData.imageUrl === "string" && formData.imageUrl) {
      const cleanPath = formData.imageUrl.startsWith("/") 
        ? formData.imageUrl.substring(1) 
        : formData.imageUrl;
      return `${import.meta.env.VITE_SERVER_URL}/${cleanPath}`;
    }
    return null;
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-2xl w-full max-h-[80vh] p-0 flex flex-col">
        <DialogHeader className="flex justify-between items-center p-4 border-b">
          <DialogTitle>
            {formData.id ? "Edit Team Member" : "Add New Team Member"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <ScrollArea className="px-6 py-4 overflow-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
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
                  <Label htmlFor="position">Position *</Label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    value={formData.position}
                    onChange={handleFormData}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.position ? "border-red-500" : ""
                    }`}
                  />
                  {errors.position && (
                    <p className="text-sm text-red-500 mt-1">{errors.position}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bio">Bio *</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleFormData}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.bio ? "border-red-500" : ""
                    }`}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500 mt-1">{errors.bio}</p>
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
                <div>
                  <Label htmlFor="imageUrl">Profile Image *</Label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.imageUrl ? "border-red-500" : ""
                    }`}
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-red-500 mt-1">{errors.imageUrl}</p>
                  )}
                  {getImagePreview() && (
                    <div className="mt-2">
                      <img
                        src={getImagePreview() || ""}
                        alt="Preview"
                        className="w-32 h-32 object-cover border rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Preview</p>
                    </div>
                  )}
                </div>
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
            {formData.id ? "Save Changes" : "Add Member"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};