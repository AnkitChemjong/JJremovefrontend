import UserFooter from '../components/UserFooter';
import UserNavbar from '../components/UserNavbar';
import { motion } from 'framer-motion';
import { FaPhone, FaQuoteLeft } from 'react-icons/fa';
import { stats, values } from '../utils/contents';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '@/Store';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const About = () => {
  const navigate = useNavigate();
  const { data: contactDetails } = useSelector((state: RootState) => state.contact);
  const { data: teamData } = useSelector((state: RootState) => state.teams);
  console.log(teamData);

  const navigateToContact = () => {
    try {
      navigate('/contact');
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // ✅ Filter and Paginate Team Data
  const filteredTeam = teamData?.filter((member) => member.showOnWebsite) || [];
  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = filteredTeam.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="overflow-x-hidden">
      <UserNavbar />
      <div
        className="w-full min-h-screen relative bg-[url('/images/about.jpg')]
      bg-no-repeat bg-center bg-cover md:mt-33 mt-28 flex justify-center items-center md:px-0 px-2
      shadow-sm shadow-black"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.3,
          }}
          className="relative z-9 flex flex-col items-center justify-center py-10 md:py-15 rounded-4xl h-fit w-fit px-12 md:px-20  space-y-5 
        bg-gradient-to-r from-white/20 via-white/30 to-white/20 backdrop-blur-md text-center md:space-y-5"
        >
          <h1 className="text-2xl md:text-4xl text-blue-800 font-bold">
            <span className="text-lg md:text-3xl text-cyan-700">About</span> JJ
            <span className="text-3xl md:text-5xl text-blue-500">Nepali</span>Removal
          </h1>
          <p className="text-sm text-gray-100">
            Your trusted moving partner with years of experience in providing seamless, <br />
            dependable service throughout Sydney and across Australia.
          </p>

          <button
            onClick={navigateToContact}
            className="bg-amber-600 hover:bg-amber-700 cursor-pointer flex flex-row
               justify-center items-center space-x-2 text-white text-sm py-3 px-6 shrink-0 rounded-full transition-colors"
          >
            <FaPhone className="text-white rotate-90" />
            <h1>Contact Now</h1>
          </button>
        </motion.div>
      </div>

      {/* Story Section */}
      <div className="w-full py-16 px-4 md:px-28 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-600">Story</span>
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          </motion.div>

          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-700 mb-6 leading-relaxed">
                  At <span className="font-semibold text-blue-800">JJ Nepali Removal</span>, we have a team of experienced
                  professionals in the removals industry, delivering top-quality moving services across Sydney and throughout
                  Australia. With years of expertise, we've successfully completed countless moves, ensuring a smooth and
                  stress-free experience for thousands of satisfied customers.
                </p>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  Our dedicated team is focused on providing exceptional customer service. Our streamlined process allows you to
                  easily request an online quote or speak with us directly for a personalized estimate. Whether you're moving
                  locally within Sydney or interstate, we offer a full range of services at competitive prices.
                </p>

                <p className="text-gray-700 mb-8 leading-relaxed">
                  We ensure your furniture is carefully padded, wrapped, and safely transported to your new home or destination.
                  For affordable, professional moving services in Sydney, reach out to our friendly team today at{' '}
                  <span className="font-semibold">0429594408</span> or <span className="font-semibold">0438526871</span>, or
                  request an online quote for your upcoming move.
                </p>
              </motion.div>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-amber-500 hover:bg-amber-600 cursor-pointer
                 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all flex-1"
                >
                  <FaPhone className="rotate-90" />
                  Call Now: {contactDetails?.phone1 || '0429594408'}
                </motion.button>

                <motion.button
                  onClick={navigateToContact}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer
                py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all flex-1"
                >
                  <FaQuoteLeft />
                  Free Quote
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="lg:w-1/2 rounded-xl p-8 text-white flex gap-10 justify-center items-center"
            >
              <div
                className="w-40 h-40 md:w-60 relative bottom-2 md:bottom-5 md:h-52 bg-[url('/images/abdata.jpeg')] 
    bg-cover bg-center rounded-lg shadow-md shadow-black"
              ></div>
              <div
                className=" w-40 h-40 md:w-60 relative top-2 md:top-5 md:h-52 bg-[url('/images/aboutda.jpeg')] 
    bg-cover bg-center rounded-lg shadow-md  shadow-black"
              ></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="w-full py-16 px-4 md:px-28 bg-blue-800 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Achievements</h2>
            <p className="text-blue-200 max-w-2xl mx-auto text-lg">
              Numbers that speak for our commitment to excellence and customer satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center flex flex-col items-center"
              >
                <div className="bg-blue-500 p-4 w-fit h-fit rounded-full flex justify-center items-center mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-amber-400 mb-3">{stat.number}</div>
                <div className="text-base font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="w-full py-16 px-4 md:px-28 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">The principles that guide us in delivering exceptional moving services</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="mt-1 bg-blue-500 p-3 rounded-full">{value.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet Our Team with Pagination */}
      <div className="w-full py-16 px-4 md:px-28 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">The dedicated professionals behind JJ Nepali Removal's success</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-64 overflow-hidden">
                  {member.photoUrl ? (
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}/${member.photoUrl}`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src= '/path/to/default/image.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No photo available</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.designation}</p>
                  <p className="text-gray-600">{member.description || 'No description available'}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ✅ Pagination Buttons */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 cursor-pointer disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 cursor-pointer rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default About;
