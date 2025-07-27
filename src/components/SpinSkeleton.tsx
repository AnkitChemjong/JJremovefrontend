import { Skeleton } from "./ui/skeleton";
import { LuLoader } from "react-icons/lu";

const SpinSkeleton = () => {
  return (
      <Skeleton className="flex justify-center items-center h-screen w-screen">
      <LuLoader size={90} className="animate-spin transition-all duration-150 text-amber-600"/>
      </Skeleton>
  );
}

export default SpinSkeleton
