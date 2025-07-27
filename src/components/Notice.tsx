import { useEffect,useRef } from 'react'
import {motion,useAnimation} from 'framer-motion';
import {type RootState} from '@/Store';
import { useSelector } from 'react-redux';

const Notice:React.FC = () => {
     const wheelDirection=useRef<number>(1);
     const controls = useAnimation();
     const {data:noticeData} = useSelector((state:RootState) => state.notices);
     const activeNotice=noticeData?.find((e)=>e.isActive===true&&e.type===0);

    useEffect(()=>{
        const handleMouseEvent=(e:WheelEvent)=>{
            const delta = e.deltaY;
            wheelDirection.current = delta > 0 ? 1 : -1;
      controls.start({
        x: [0, wheelDirection.current * 1000],
        transition: {
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        },
       
      }); }
        window.addEventListener("wheel",handleMouseEvent);
        return ()=>window.removeEventListener("wheel",handleMouseEvent)
    },[controls]);

    const handleAnimationStop=()=>{
        controls.stop();
      }
      const handleAnimationStart=()=>{
          controls.start({
            x: [0, wheelDirection.current * 1000],
            transition: {
              duration: 10,
              ease: "linear",
              repeat: Infinity,
            },
          });
      }
  return (
    <div
    onMouseEnter={handleAnimationStop}
    onMouseLeave={handleAnimationStart}
    className="overflow-hidden w-full h-fit py-3 bg-black flex flex-col items-center gap-10
    fixed top-0 left-0 right-0 bottom-0 z-10 cursor-pointer">
      <motion.div
        animate={controls}
        // Tailwind handles base transform, Framer Motion overrides with dynamic `x`
        className="flex transform -translate-x-100 whitespace-nowrap text-white text-xl"
      >
         {/* {"🚀 Welcome to the Marquee Effect ".repeat(10)} */}
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="flex text-sm items-center gap-2 mx-4">
            🚀 {activeNotice?.content|| "No active Notice..."} 
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default Notice
