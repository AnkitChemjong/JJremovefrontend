import { useState, type ChangeEvent, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Loader from '@/components/Loader';
import axiosClient from '@/Services/AxiosRequest';
import Cookies from 'js-cookie';
import { Get_Gallery_Media_Route } from '@/Routes';
import { toast } from 'sonner';

export interface MediaFile {
  id?: string;
  url?: string;
  caption: string;
  sortOrder: number;
  type: 'Image' | 'Video';
  youTubeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

interface MediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFile: MediaFile | null;
  onSuccess: () => void;
}

export const MediaDialog = ({ 
  open, 
  onOpenChange, 
  currentFile, 
  onSuccess 
}: MediaDialogProps) => {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [formData, setFormData] = useState<MediaFile>({
    caption: '',
    sortOrder: 0,
    type: 'Image',  // Default to capitalized type
    youTubeUrl: ''
  });
  const [showLoader, setShowLoader] = useState(false);

  // Reset form when currentFile changes
  useEffect(() => {
    if (currentFile) {
      setFormData({
        ...currentFile,
        type: currentFile.type || 'Image'  // Ensure type is always set
      });
    } else {
      setFormData({
        caption: '',
        sortOrder: 0,
        type: 'Image',
        youTubeUrl: ''
      });
    }
    setFileToUpload(null);
  }, [currentFile, open]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sortOrder' ? Number(value) : value
    }));
  };

  const handleSaveMedia = async () => {
    // Validation
    if (!formData.caption.trim()) {
      toast.error('Please enter a caption');
      return;
    }

    if (formData.type === 'Video' && !formData.youTubeUrl?.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (formData.type === 'Image' && !formData.id && !fileToUpload) {
      toast.error('Please select an image file');
      return;
    }

    setShowLoader(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const data = new FormData();
      data.append('caption', formData.caption);
      data.append('sortOrder', String(formData.sortOrder));
      data.append('type', formData.type);
      
      if (formData.type === 'Image') {
        if (fileToUpload) {
          data.append('file', fileToUpload);
        } else if (formData.id && !fileToUpload) {
          // When editing image but not changing the file
          data.append('keepExisting', 'true');
        }
      } else if (formData.type === 'Video') {
        data.append('youTubeUrl', formData.youTubeUrl || '');
      }

      if (formData.id) {
        await axiosClient.put(`${Get_Gallery_Media_Route}/${formData.id}`, data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Media updated successfully');
      } else {
        await axiosClient.post(Get_Gallery_Media_Route, data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Media added successfully');
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error('Error saving media:', err);
      toast.error(err?.response?.data?.message || 'Error saving media');
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formData.id ? 'Edit Media' : 'Add New Media'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="caption">Caption *</Label>
            <input
              id="caption"
              name="caption"
              type="text"
              value={formData.caption}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Media Type *</Label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  checked={formData.type === 'Image'}
                  onChange={() => setFormData(prev => ({...prev, type: 'Image'}))}
                  className="mr-2"
                />
                Image
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  checked={formData.type === 'Video'}
                  onChange={() => setFormData(prev => ({...prev, type: 'Video'}))}
                  className="mr-2"
                />
                Video
              </label>
            </div>
          </div>

          {formData.type === 'Image' ? (
            <div className="space-y-2">
              <Label htmlFor="file">
                Image File {!formData.id && '*'}
                {formData.id && !fileToUpload && ' (Optional)'}
              </Label>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md"
              />
              {formData.url && !fileToUpload && (
                <div className="mt-2">
                  <img 
                    src={`${import.meta.env.VITE_SERVER_URL}${formData.url}`}
                    alt="Current" 
                    className="h-20 object-contain border rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Current image</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="youTubeUrl">YouTube URL *</Label>
              <input
                id="youTubeUrl"
                name="youTubeUrl"
                type="text"
                value={formData.youTubeUrl || ''}
                onChange={handleInputChange}
                placeholder="Enter YouTube URL or video ID"
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-gray-500">
                Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border cursor-pointer rounded-md hover:bg-gray-100"
              disabled={showLoader}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveMedia}
              disabled={showLoader}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 
              flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-24"
            >
              {showLoader && <Loader/>}
              {formData.id ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};