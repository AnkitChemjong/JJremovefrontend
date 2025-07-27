import UserNavbar from '../components/UserNavbar';
import ContactInfoBanner from '../components/ContactInfoBanner';
import { FaCheck, FaTruckMoving, FaMapMarkerAlt, FaShieldAlt,FaStar,
  FaPhone,
  FaQuoteLeft
} from 'react-icons/fa';
import {features } from '../utils/contents';
import { Button } from '@/components/ui/button';
import {motion} from 'motion/react';
import UserFooter from '../components/UserFooter';
import { useNavigate } from 'react-router-dom';
import  {type RootState } from '@/Store';
import { useSelector } from 'react-redux';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Notice {
  id: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  isActive: boolean;
  moreInfo?: string;
  type: number;
  updatedAt: string;
}

const Home = () => {
  const navigate=useNavigate();
  const {data:faqsDatas} = useSelector((state:RootState) => state.faqs);
  const faqsData=faqsDatas?.slice(0,3);
  const {data:customerReview} = useSelector((state:RootState) => state.customerReview);
  const top3=customerReview?.slice(0,3) || [];
  const {data:servicesData} = useSelector((state:RootState) => state.services);
  const serviceData=servicesData?.slice(0,4) || [];
  const {data:noticeData} = useSelector((state:RootState) => state.notices);
  const activeNotice: Notice | undefined = noticeData?.find((e: Notice) => 
    e.isActive === true && e.type === 1
  );
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (activeNotice) {
      try {
        const dismissedNoticeId = localStorage.getItem('dismissedNoticeId');
        if (activeNotice.id !== dismissedNoticeId) {
          setShowNotice(true);
        }
      } catch (e) {
        console.error("LocalStorage access error:", e);
      }
    }
  }, [activeNotice]);

  const handleCloseNotice = () => {
    if (activeNotice) {
      try {
        localStorage.setItem('dismissedNoticeId', activeNotice.id);
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    }
    setShowNotice(false);
  };


  const navigateToContact=()=>{
    try{
      navigate('/contact');
    }
    catch(error){
      console.log(error);
    }
  }
  
  return (
    <div className='overflow-x-hidden'>
      <UserNavbar />
      {/* Notice Dialog */}
      {activeNotice && (
        <Dialog open={showNotice} onOpenChange={setShowNotice}>
        <DialogContent className="sm:max-w-[80vw] max-w-[90vw] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-left">Important Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {activeNotice?.imageUrl && (
              <div className="w-full max-h-[50vh] overflow-hidden rounded-md flex justify-center bg-gray-100">
                <img
                  src={`${import.meta.env.VITE_SERVER_URL || ''}/${activeNotice.imageUrl}`}
                  alt="Notice"
                  className="max-w-full max-h-[50vh] object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}
            
            {activeNotice.content && (
              <div 
                className="prose prose-sm max-w-none p-2"
                dangerouslySetInnerHTML={{ __html: activeNotice.content }}
              />
            )}
            
            {activeNotice.moreInfo && (
              <div className="bg-blue-50 p-4 rounded-md text-sm">
                <p>{activeNotice.moreInfo}</p>
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleCloseNotice} className='cursor-pointer bg-red-600 hover:bg-red-700'>Don't Show Again</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      )}
      <div className="w-full min-h-screen relative bg-[url('/images/happy.jpg')]
      bg-no-repeat bg-center bg-cover md:mt-33 mt-28 flex justify-start items-center md:px-0 px-2">
        <motion.div
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}}
        transition={{
          duration:0.7,
          delay:0.3
        }}
         className="relative z-9 flex flex-col items-center justify-center py-10 rounded-4xl md:ml-10 h-fit w-fit px-12  space-y-5 
        bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-md">
          <h1 className='text-2xl md:text-4xl text-blue-800 font-bold'>
            JJ<span className='text-3xl md:text-5xl text-blue-500'>Nepali</span>Removal
          </h1>
          <p className='text-sm text-gray-100'>Moving the Local Community - We are a team of skilled professionals<br/>
             with extensive experience in the removals industry, delivering<br/>
              top-quality moving services throughout Sydney and across Australia.</p>
              <div className='flex flex-row justify-center items-center gap-10'>
              <motion.button
              onClick={navigateToContact}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
              className="bg-amber-600 hover:bg-amber-700 cursor-pointer flex flex-row
               justify-center items-center space-x-2 text-white text-sm py-3 px-6 shrink-0 rounded-full transition-colors">
              <FaPhone className="text-white rotate-90" />
              <h1>Contact Now</h1>
              </motion.button>
             <motion.button
             onClick={navigateToContact}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-amber-600 hover:bg-amber-700 cursor-pointer flex flex-row
                            justify-center items-center space-x-2 text-white text-sm py-3 px-6 shrink-0 rounded-full transition-colors">
                            <FaQuoteLeft className="text-white"/>
                            <h1>Free Quote</h1>
                </motion.button>
              </div>
        </motion.div>

      </div>
      <ContactInfoBanner/>
      <div className="w-full py-12 px-4 md:px-28 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">
              About <span className="text-blue-500">J.J Nepali Removal</span>
            </h2>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              J.J Nepali Removal boasts a team of skilled professionals with extensive experience in the removals industry. We specialize in delivering top-quality moving services throughout Sydney and across Australia, ensuring your belongings are handled with the utmost care and professionalism.
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our commitment to excellence and customer satisfaction has made us one of the most trusted removal companies in the region. From residential moves to commercial relocations, we handle every project with precision and dedication.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-2">
                <div className='p-3 bg-green-500 rounded-full '>
                <FaCheck className="text-white" />
                </div>
                <span className="text-gray-800 font-medium">Fully Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2">
              <div className='p-3 bg-green-500 rounded-full '>
                <FaCheck className="text-white " />
                </div>
                <span className="text-gray-800 font-medium">Experienced Professional Team</span>
              </div>
              <div className="flex items-center space-x-2">
              <div className='p-3 bg-green-500 rounded-full '>
                <FaCheck className="text-white" />
                </div>
                <span className="text-gray-800 font-medium">Australia-wide Service Coverage</span>
              </div>
            </div>
            
            <button className="bg-amber-600 hover:bg-amber-700 cursor-pointer text-white font-bold py-3 px-6 rounded-full transition-colors">
              Learn More
            </button>
          </div>
          


          <div 
  className="min-w-[400px] w-1/2 h-full min-h-[400px] cursor-pointer group rounded-xl overflow-hidden relative flex items-center justify-center"
  style={{
    backgroundImage: `url('/images/truck.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
  <div className="relative md:top-60 w-fit h-fit md:p-2 px-10 flex md:opacity-0 group-hover:opacity-100 group-hover:top-0 transition-all duration-200 ">
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="bg-white/5 backdrop-blur-sm border border-white/30 rounded-xl p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all shadow-lg">
        <FaTruckMoving className="text-white text-3xl mb-3 drop-shadow-md" />
        <h4 className="font-bold text-white drop-shadow-md">Professional Movers</h4>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm border border-white/30 rounded-xl p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all shadow-lg">
        <FaShieldAlt className="text-white text-3xl mb-3 drop-shadow-md" />
        <h4 className="font-bold text-white drop-shadow-md">Fully Insured</h4>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm border border-white/30 rounded-xl p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all shadow-lg">
        <FaMapMarkerAlt className="text-white text-3xl mb-3 drop-shadow-md" />
        <h4 className="font-bold text-white drop-shadow-md">Nationwide</h4>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm border border-white/30 rounded-xl p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all shadow-lg">
        <div className="text-white text-3xl font-bold mb-3 drop-shadow-md">24/7</div>
        <h4 className="font-bold text-white drop-shadow-md">Availability</h4>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
    

    <div className="w-full py-16 px-4 md:px-28 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    {/* Animated Header */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
        Why Choose <span className="text-blue-500">Us?</span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        We provide reliable, professional moving services with a commitment to excellence that sets us apart from the competition.
      </p>
    </motion.div>

 
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.1
          }}
          viewport={{ once: true }}
          whileHover={{ 
            y: -5,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}
          className="bg-white p-6 cursor-pointer rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
        >
          <div className="flex items-start space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mt-1 bg-blue-800 rounded-full p-3"
            >
              {feature.icon}
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</div>

    <div className="w-full py-16 px-4 md:px-28 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Our <span className="text-blue-600">Services</span>
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We offer comprehensive moving and removal services to meet all your relocation needs across Sydney and Australia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {serviceData?.map((service: any, index: number) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                            >
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    {service.iconUrl && (
                                        <div className="w-16 h-16 rounded-full overflow-hidden">
                                            <img 
                                                src={`${import.meta.env.VITE_SERVER_URL}/${service.iconUrl}`} 
                                                alt={service.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                                </div>
                                <p className="text-gray-600 mb-6">{service.description}</p>
                                
                               
                                <div className="flex gap-2 mb-6">
                                    {service.imageUrl1 && (
                                        <img 
                                        src={`${import.meta.env.VITE_SERVER_URL}/${service.imageUrl1}`} 
                                            alt={service.name} 
                                            className="w-1/3 h-24 object-cover rounded"
                                        />
                                    )}
                                    {service.imageUrl2 && (
                                        <img 
                                        src={`${import.meta.env.VITE_SERVER_URL}/${service.imageUrl2}`} 
                                            alt={service.name} 
                                            className="w-1/3 h-24 object-cover rounded"
                                        />
                                    )}
                                    {service.imageUrl3 && (
                                        <img 
                                        src={`${import.meta.env.VITE_SERVER_URL}/${service.imageUrl3}`} 
                                            alt={service.name} 
                                            className="w-1/3 h-24 object-cover rounded"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <button
          onClick={()=>navigate('/service')}
           className="bg-gradient-to-r bg-amber-600 hover:bg-amber-700 cursor-pointer text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
            View All Services
          </button>
        </motion.div>
      </div>
    </div>

    <div className="w-full py-20 px-4 md:px-28 bg-gradient-to-br from-gray-50 to-blue-50">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Happy <span className="text-blue-600">Customers</span>
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Don't just take our word for it. Here's what our satisfied customers have to say about our moving services across Sydney and Australia.
      </p>
    </motion.div>

    {/* Conditional rendering based on reviews availability */}
    {top3.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {top3.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ 
              y: -5,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}
            className="bg-white p-8 cursor-pointer rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100/50"
          >
            {/* Stars */}
            <div className="flex mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="text-amber-400" />
              ))}
            </div>
            
            <motion.p 
              className="text-gray-700 mb-6 italic relative"
              whileHover={{ scale: 1.02 }}
            >
              <span className="absolute top-0 left-0 text-6xl text-blue-100 font-serif -mt-4 -ml-2">"</span>
              {review.review}
            </motion.p>
            
            <div>
              <p className="font-bold text-gray-900">{review.name}</p>
              <p className="text-gray-500 text-sm">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100/50"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <FaStar className="text-gray-300 text-4xl" />
          <h3 className="text-xl font-medium text-gray-700">No Reviews Available</h3>
          <p className="text-gray-500 max-w-md">
            We haven't received any reviews yet. Be the first to share your experience with us!
          </p>
        </div>
      </motion.div>
    )}

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      viewport={{ once: true }}
      className="text-center mt-16"
    >
      <button 
        onClick={()=>navigate('/service')}
        className="bg-amber-600 hover:bg-amber-700 cursor-pointer text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        Share Your Experience
      </button>
    </motion.div>
  </div>
</div>
{
  faqsData && faqsData.length > 0 ? (
    <div className='w-full py-16 px-4 md:px-28 bg-gray-50'>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find answers to common questions about our moving and removal services.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqsData.map((faq: any, index: number) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <AccordionItem 
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left group cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {faq.question}
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </div>
  ) : (
    <div className='w-full py-16 px-4 md:px-28 bg-gray-50'>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100/50"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-gray-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700">No FAQs Available</h3>
            <p className="text-gray-500 max-w-md">
              We're currently preparing our frequently asked questions. Please check back later or contact us directly.
            </p>
            <button 
              onClick={navigateToContact}
              className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-medium shadow-sm hover:shadow-md transition-all"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
    <UserFooter/>
    </div>
  )
}

export default Home;
