import UserNavbar from "@/components/UserNavbar"
import UserFooter from "@/components/UserFooter"
import {motion} from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { useState, type ChangeEvent } from "react";
import Loader from "@/components/Loader";
import {type AppDispatch, type RootState } from "@/Store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import aixosClient from "@/Services/AxiosRequest";
import { Post_User_Contact_Route } from "@/Routes";
import {type FormEvent} from "react";
import { contactMessage } from "@/Store/Slices/ContactMessage";

const Contact = () => {
    const [showLoader,setShowLoader]=useState(false);
    const {data:contactDetails} = useSelector((state:RootState) => state.contact);
    const dispatch=useDispatch<AppDispatch>();


    const [data,setData]=useState({
        name:"",
        email:"",
        message:""
    });

    const checkInput = (): boolean => {
        return !data.name.trim() || !data.email.trim() || !data.message.trim();
      };

    const handleSubmit =async (e:FormEvent) => {
        setShowLoader(true);
        e.preventDefault();
       try{
        const response=await aixosClient.post(Post_User_Contact_Route,data);
        if(response?.status === 201){
          dispatch(contactMessage());
          setData({name:"",
            email:"",
            message:""})
            toast.success("Contact Submitted Successfully.Thankyou!");
        }
       }
       catch(error:any){
           console.log(error);
           toast.error(error?.response?.data?.message || "Something went wrong");
       }
       finally{
        setShowLoader(false);
       }
      };

    const officeTime=contactDetails?.officeHours?.split(",");
    const handleFormData=(e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>{
       try{
           const {name,value}=e.target;
           setData((e)=>({...e,[name]:value}));
       }
       catch(error){
        console.log(error);
       }
      }
    
  return (
    <div>
        <UserNavbar/>
        <div className="w-full min-h-screen relative bg-[url('./images/contact.jpg')]
      bg-no-repeat bg-center bg-cover md:mt-33 mt-28 flex justify-center items-center md:px-0 px-2
      shadow-sm shadow-black">
        <motion.div
        initial={{opacity:0,y:10}} 
        animate={{opacity:1,y:0}}
        transition={{
          duration:0.7,
          delay:0.3
        }}
         className="relative z-9 flex flex-col items-center justify-center py-10 md:py-15 rounded-4xl h-fit w-fit px-12 md:px-20  space-y-5 
        bg-gradient-to-r from-white/20 via-white/30 to-white/20 backdrop-blur-md text-center md:space-y-5">
          <h1 className='text-2xl md:text-4xl text-blue-800 font-bold'>
          Get In <span className='text-3xl md:text-5xl text-blue-500'>Touch</span>
          </h1>
          <p className='text-sm text-gray-100'>Ready to move? Contact JJ Nepali Removal for professional, <br/>
            reliable, and affordable moving services across Sydney.</p>
             
              <button className="bg-amber-600 hover:bg-amber-700 cursor-pointer flex flex-row
               justify-center items-center space-x-2 text-white text-sm py-3 px-6 shrink-0 rounded-full transition-colors">
              <FaPhone className="text-white rotate-90" />
              <h1>Call Now: {contactDetails?.phone1}</h1>
            </button>
        </motion.div>
      </div>
      <div className="w-full py-16 px-4 md:px-28 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-sm border-2 border-green-500"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to Move? Let's Talk!</h2>
            <p className="text-gray-600 mb-8">
              Get your free quote today. Our friendly team is ready to help make your move smooth and stress-free.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  name="name"
                  type="text"
                  value={data?.name}
                  onChange={handleFormData}
                  id="name"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                name="email"
                  type="email"
                  id="email"
                  value={data?.email}
                  onChange={handleFormData}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                name="message"
                  id="message"
                  value={data?.message}
                  onChange={handleFormData}
                  rows={5}
                  placeholder="Tell us about your moving requirements, dates, locations, and any special instructions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">0/1000 characters</p>
              </div>
              
              <button
                type="submit"
                disabled={showLoader || checkInput() }
                className={`w-full bg-amber-600 ${checkInput()? "cursor-not-allowed":" cursor-pointer"} hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex justify-center
                items-center gap-10`}
              >
              {showLoader && <Loader/>} Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            
            <div className="bg-white p-8 rounded-xl shadow-sm sticky top-0 border-2 border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaPhone className="text-blue-600" />
                    <h4 className="font-medium">Call Us Now</h4>
                  </div>
                  <div className="space-y-1 ml-8">
                    <p className="text-gray-700">{contactDetails?.phone1}</p>
                    <p className="text-gray-700">{contactDetails?.phone2}</p>
                    <p className="text-sm text-gray-500">Available 24/7 for emergency moves</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaEnvelope className="text-blue-600" />
                    <h4 className="font-medium">Email Us</h4>
                  </div>
                  <div className="ml-8">
                    <p className="text-gray-700">{contactDetails?.email}</p>
                    <p className="text-sm text-gray-500">Quick response within 2 hours</p>
                    <p className="text-sm text-gray-500">Send us your requirements</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <h4 className="font-medium">Service Area</h4>
                  </div>
                  <div className="ml-8">
                    <p className="text-gray-700">Greater Sydney Area</p>
                    <p className="text-gray-700">Lidcombe NSW 2141</p>
                    <p className="text-sm text-gray-500">Serving all Sydney suburbs</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaClock className="text-blue-600" />
                    <h4 className="font-medium">Business Hours</h4>
                  </div>
                  <div className="ml-8">
                    <p className="text-gray-700">{officeTime&&officeTime[0]}</p>
                    <p className="text-gray-700">{officeTime&&officeTime[1]}</p>
                    <p className="text-gray-700">Public Holidays: By Appointment</p>
                    <p className="text-sm text-gray-500">Emergency moves available anytime!</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>


    <section className="px-6 md:px-20 py-10">

  <motion.div 
  initial={{ opacity: 0, y:10}}
  whileInView={{ opacity: 1,y:0 }}
  transition={{ duration: 0.6 }}
  className="text-center mb-10">
    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 flex items-center justify-center gap-2">
      <span>📍</span> Our Service Area
    </h2>
    <p className="text-gray-600 mt-2">
      JJ Nepali Removal proudly serves the Greater Sydney area with professional moving and removal services.
    </p>
  </motion.div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
    <div className="md:col-span-2 space-y-6">
     
      <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
       className="bg-blue-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-4">
          <span>🏢</span> Head Office Location
        </h3>
        <p className="text-gray-700">{contactDetails?.address}</p>
        <p className="text-gray-700 mt-1">📞 {contactDetails?.phone1}, {contactDetails?.phone2}</p>
        <p className="text-gray-700 mt-1">📧 jjnepaliremoval@gmail.com</p>
      </motion.div>

      
      <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
       className="bg-orange-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-orange-600 flex items-center gap-2 mb-4">
          <span>📍</span> Service Coverage
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-700 text-sm">
          <p>• Inner West Sydney</p>
          <p>• Western Sydney</p>
          <p>• North Shore</p>
          <p>• Canterbury Bankstown</p>
          <p>• Blacktown Area</p>
          <p>• Penrith Area</p>
          <p>• Eastern Suburbs</p>
          <p>• Northern Beaches</p>
          <p>• South Sydney</p>
          <p>• Parramatta Area</p>
          <p>• Liverpool Area</p>
          <p>• Sutherland Shire</p>
        </div>
      </motion.div>
    </div>

    <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full h-[300px] rounded-lg overflow-hidden shadow-sm">
      <iframe
        src={`${contactDetails?.mapEmbedUrl}`||"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313.7585828490857!2d151.03704611521012!3d-33.8703941806569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12be74071d73cb%3A0x5017d681632b5f0!2sLidcombe%20NSW%202141!5e0!3m2!1sen!2sau!4v1619405972629!5m2!1sen!2sau"}
        width="100%"
        height="100%"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </motion.div>
  </div>
</section>


        <UserFooter/>
      
    </div>
  )
}

export default Contact
