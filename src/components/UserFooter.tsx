import { FaFacebook, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope,FaCalendarAlt } from 'react-icons/fa';
import {motion} from 'framer-motion';
import { navItem } from './UserNavbar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '@/Store';

const UserFooter = () => {
  const navigate=useNavigate();
  const contactState = useSelector((state:RootState) => state.contact);
  const {data:contactDetails}=contactState;

   
   
  const navigateToContact=()=>{
    try{
      navigate('/contact');
    }
    catch(error){
      console.log(error);
    }
  }
  return (
    <>
     <div className="w-full py-16 px-4 md:px-28 bg-gradient-to-r from-blue-800 to-blue-600">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-8"
        >
     
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className='bg-gray-100 p-4 rounded-full border-2 border-amber-400 shadow-lg'>
              <FaPhone className="text-amber-600 text-xl" />
              </div>
              <h3 className="text-2xl font-bold">Call: {contactDetails?.phone1 || "0429594408"}, {contactDetails?.phone2 || "0438526871"}</h3>
            </div>
            <p className="text-blue-100 max-w-lg">
              Ready to move? Contact us today for a free quote and experience the best moving service in Sydney and across Australia.
            </p>
          </div>

         
          <motion.button
          onClick={navigateToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-600 hover:bg-amber-700 cursor-pointer text-white font-bold py-4 px-8 rounded-full shadow-lg flex items-center gap-3 transition-all"
          >
            <FaCalendarAlt />
            Book a Free Consultation
          </motion.button>
        </motion.div>
      </div>
    </div>
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-4 md:px-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className='flex flex-row justify-between items-center md:space-x-2'>
            <img src="/images/logo.png" className='w-10 h-10 md:w-15 md:h-15' alt="" />
            <h1 className='text-base md:text-2xl text-blue-800 font-bold'>
            JJ<span className='text-lg md:text-3xl text-blue-500'>Nepali</span>Removal
          </h1>
            </div>
            <p className="text-gray-400">
              Professional moving services throughout Sydney and across Australia. Your trusted partner for all relocation needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {navItem.map((item,index) => (
                <li key={index}>
                  <a href={item?.path} className="text-gray-400 hover:text-white transition-colors">
                    {item?.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Our Services</h3>
            <ul className="space-y-2">
              {[
                'Local & Interstate Moving',
                'Commercial Relocation',
                'Furniture Delivery',
                'Rubbish Removal',
                'Storage Solutions'
              ].map((service) => (
                <li key={service} className="text-gray-400 hover:text-white transition-colors">
                  {service}
                </li>
              ))}
            </ul>
          </div>


          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaPhone className="text-blue-400 mt-1" />
                <div>
                  <p className="text-gray-400">{contactDetails?.phone1}</p>
                  <p className="text-gray-400">{contactDetails?.phone2}</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FaEnvelope className="text-blue-400 mt-1" />
                <a href="mailto:info@jinepaliremoval.com" className="text-gray-400 hover:text-white transition-colors">
                  {contactDetails?.email}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-blue-400 mt-1" />
                <p className="text-gray-400">{contactDetails?.address}</p>
              </li>
            </ul>
          </div>
        </div>

   
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} JJ Nepali Removal. All rights reserved. | Professional Moving Services Sydney & Australia
          </p>
        </div>
      </div>
    </footer>

    </>
  );
};

export default UserFooter;