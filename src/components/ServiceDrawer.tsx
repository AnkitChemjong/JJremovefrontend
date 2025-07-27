import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { FiX } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";

type Service = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  iconUrl: string;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
}

type ServiceDrawerProps = {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  currentService: Service | null;
}

const ServiceDrawer = ({
  openDrawer,
  setOpenDrawer,
  currentService
}: ServiceDrawerProps) => {
  if (!currentService) return null;

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
      <DrawerContent className="h-[90vh] max-w-none w-full">
        <div className="mx-auto w-full max-w-4xl px-4 overflow-y-auto">
          <DrawerHeader className="text-left">
            <div className="flex justify-between items-start">
              <div>
                <DrawerTitle className="text-2xl font-bold">
                  {currentService.name}
                </DrawerTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge 
                    variant={currentService.isActive ? "default" : "secondary"}
                    className="text-sm "
                  >
                    {currentService.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <FiX className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="p-6 space-y-8">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Description</h3>
              <p className="text-gray-600 pl-1">{currentService.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-lg">Service Media</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Icon</h4>
                  {currentService.iconUrl ? (
                    <img 
                      src={`${import.meta.env.VITE_SERVER_URL}${currentService.iconUrl}`}
                      alt="Service Icon"
                      className="h-24 w-24 object-contain border rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="h-24 w-24 flex items-center justify-center border rounded-lg text-gray-400 bg-gray-50">
                      No Icon
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-3">Images</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[currentService.imageUrl1, currentService.imageUrl2, currentService.imageUrl3].map((url, index) => (
                      url ? (
                        <div key={index} className="aspect-square">
                          <img
                            src={`${import.meta.env.VITE_SERVER_URL}/${url}`}
                            alt={`Service Image ${index + 1}`}
                            className="h-full w-full object-cover rounded-lg border shadow-sm"
                          />
                        </div>
                      ) : (
                        <div key={index} className="aspect-square flex items-center justify-center border rounded-lg text-gray-400 bg-gray-50">
                          No Image {index + 1}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Sort Order</h3>
                <p className="text-gray-600 pl-1">{currentService.sortOrder}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Service ID</h3>
                <p className="text-gray-600 text-sm font-mono pl-1">{currentService.id}</p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default ServiceDrawer