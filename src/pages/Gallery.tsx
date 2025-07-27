import { useState } from 'react';
import UserFooter from '@/components/UserFooter';
import UserNavbar from '@/components/UserNavbar';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type RootState } from '@/Store';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Gallery = () => {
  const { data: mediaData } = useSelector((state: RootState) => state.galleryMediaData);

  const [currentPages, setCurrentPages] = useState({
    all: 1,
    picture: 1,
    video: 1
  });

  const itemsPerPage = 6;

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredItems = (type: string) => {
    if (!mediaData) return [];
    return mediaData.filter(item => {
      if (type === 'all') return true;
      if (type === 'picture') return item.type === 'Image';
      if (type === 'video') return item.type === 'Video';
      return false;
    });
  };

  const paginatedItems = (type: keyof typeof currentPages) => {
    const items = filteredItems(type);
    const currentPage = currentPages[type];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (type: keyof typeof currentPages) => {
    const items = filteredItems(type);
    return Math.ceil(items.length / itemsPerPage);
  };

  const handlePageChange = (type: keyof typeof currentPages, newPage: number) => {
    setCurrentPages(prev => ({
      ...prev,
      [type]: Math.max(1, Math.min(newPage, totalPages(type)))
    }));
  };

  const renderCard = (item: any) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden group cursor-pointer rounded-lg ${item.type === 'Image' ? 'aspect-square' : 'aspect-video'} bg-gray-100`}
    >
      {item.type === 'Image' ? (
        <img
          src={`${import.meta.env.VITE_SERVER_URL}/${item.url}`}
          alt={item.caption}
          className="w-full h-full object-cover cursor-pointer"
        />
      ) : (
        <>
        <iframe
        
          src={`${item.url.replace('watch?v=', 'embed/')}`}
          className="w-full h-fit"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={item.caption}
        />
         <div className='w-full h-fit md:py-2 bg-black px-4'>
            <h3 className="text-white text-sm font-medium">{item.caption}</h3>
            <p className="text-gray-300 text-xs mt-1">
              {moment(item.createdAt).format('MMMM D, YYYY')}
            </p>
          </div>
        </>
      )}
      {item.type === 'Image' && (
        <div className="absolute inset-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
          <div className="transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="text-white text-sm font-medium">{item.caption}</h3>
            <p className="text-gray-300 text-xs mt-1">
              {moment(item.createdAt).format('MMMM D, YYYY')}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderPagination = (type: keyof typeof currentPages) => (
    totalPages(type) > 1 && (
      <div className="flex items-center justify-between mt-8 px-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPages[type] - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPages[type] * itemsPerPage, filteredItems(type).length)} of{' '}
          {filteredItems(type).length} items
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(type, currentPages[type] - 1)}
            disabled={currentPages[type] === 1}
            className="px-4 py-2 border rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(type, currentPages[type] + 1)}
            disabled={currentPages[type] === totalPages(type)}
            className="px-4 py-2 border rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    )
  );

  return (
    <div className='overflow-x-hidden'>
      <UserNavbar />

      <div className="w-full min-h-screen relative bg-[url('/images/ga.jpg')] bg-no-repeat bg-center bg-cover md:mt-33 mt-28 flex justify-center items-center md:px-0 px-2 shadow-sm shadow-black">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-9 flex flex-col items-center justify-center py-10 md:py-15 rounded-4xl h-fit w-fit px-12 md:px-20 space-y-5 bg-gradient-to-r from-white/20 via-white/30 to-white/20 backdrop-blur-md text-center md:space-y-5"
        >
          <h1 className='text-2xl md:text-4xl text-blue-800 font-bold'>
            Our <span className='text-3xl md:text-5xl text-blue-500'>Work</span> in <span className='text-3xl md:text-5xl text-blue-500'>Action</span>
          </h1>
          <p className='text-sm text-gray-100'>
            Explore our gallery of successful moves, satisfied customers,<br />
            and professional service delivery
          </p>
          <button
            onClick={() => handleScroll('work')}
            className="bg-amber-600 hover:bg-amber-700 cursor-pointer flex flex-row justify-center items-center space-x-2 text-white text-sm py-3 px-6 shrink-0 rounded-full transition-colors"
          >
            <h1>View Our Work</h1>
          </button>
        </motion.div>
      </div>

      <div id='work' className="w-full py-16 px-4 md:px-28 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gallery & Media</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our collection of successful projects and customer experiences
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
              <TabsTrigger className='cursor-pointer' value="all">All</TabsTrigger>
              <TabsTrigger className='cursor-pointer' value="picture">Pictures</TabsTrigger>
              <TabsTrigger className='cursor-pointer' value="video">Videos</TabsTrigger>
            </TabsList>

            {['all', 'picture', 'video'].map(type => (
              <TabsContent key={type} value={type}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {paginatedItems(type as keyof typeof currentPages).map((item: any) => renderCard(item))}
                </div>
                {renderPagination(type as keyof typeof currentPages)}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default Gallery;
