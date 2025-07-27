import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
  } from "@/components/ui/drawer";
  import { Button } from "@/components/ui/button";
  import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
  
  type TeamMember = {
    id?: string;
    name: string;
    position: string;
    bio: string;
    imageUrl: string;
    isActive: boolean;
  };
  
  type TeamDrawerProps = {
    openDrawer: boolean;
    setOpenDrawer: (open: boolean) => void;
    currentMember: TeamMember | null;
  };
  
  export const TeamDrawer = ({
    openDrawer,
    setOpenDrawer,
    currentMember,
  }: TeamDrawerProps) => {
    if (!currentMember) return null;
  
    return (
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl">{currentMember.name}</DrawerTitle>
            <DrawerDescription>{currentMember.position}</DrawerDescription>
          </DrawerHeader>
          
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage 
                  src={currentMember.imageUrl} 
                  alt={`${currentMember.name}'s profile`}
                />
                <AvatarFallback>
                  {currentMember.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <p className="text-lg font-medium">{currentMember.name}</p>
                <p className="text-sm text-gray-500">{currentMember.position}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    currentMember.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {currentMember.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
  
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Bio</h3>
                <p className="mt-1 text-gray-600">{currentMember.bio}</p>
              </div>
            </div>
          </div>
  
          <div className="p-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setOpenDrawer(false)}
              className="w-full cursor-pointer"
            >
              Close
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  };