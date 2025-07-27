import { motion } from 'framer-motion';
import UserNavbar from '../components/UserNavbar';
import UserFooter from '../components/UserFooter';
import { FaPhone, FaQuoteLeft, FaCheck, FaArrowLeft, FaArrowRight, FaBox, FaDollarSign } from 'react-icons/fa';
import { MdOutlinePreview } from "react-icons/md";
import { packages } from '@/utils/contents';
import ReviewDialog from '@/components/ReviewDialog';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '@/Store';


const Service = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();
    const { data: contactDetails } = useSelector((state: RootState) => state.contact);
    const { data: serviceData } = useSelector((state: RootState) => state.services);
    const { data: vehicleData} = useSelector((state: RootState) => state.vehicles);

    console.log(serviceData)


    const servicesPerPage = 4;
    const totalServices = serviceData?.length || 0;
    const totalPages = Math.ceil(totalServices / servicesPerPage);

    const handleDialog = () => {
        setOpenDialog(!openDialog);
    }

    const navigateToContact = () => {
        try {
            navigate('/contact');
        }
        catch (error) {
            console.log(error);
        }
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    };

    // Get current services for pagination
    const getCurrentServices = () => {
        const startIndex = (currentPage - 1) * servicesPerPage;
        const endIndex = startIndex + servicesPerPage;
        return serviceData?.slice(startIndex, endIndex) || [];
    };

    return (
        <div className='overflow-x-hidden'>
            <UserNavbar />
            <div className="w-full min-h-screen relative bg-[url('/images/about.jpg')]
                bg-no-repeat bg-center bg-cover md:mt-33 mt-28 flex justify-center items-center md:px-0 px-2
                shadow-sm shadow-black">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.7,
                        delay: 0.3
                    }}
                    className="relative z-9 flex flex-col items-center justify-center py-10 md:py-15 rounded-4xl h-fit w-fit px-12 md:px-20  space-y-5 
                    bg-gradient-to-r from-white/20 via-white/30 to-white/20 backdrop-blur-md text-center md:space-y-5">
                    <h1 className='text-2xl md:text-4xl text-blue-800 font-bold'>
                        Our <span className='text-3xl md:text-5xl text-blue-500'>Professional</span> Services
                    </h1>
                    <p className='text-sm text-gray-100'>Comprehensive moving and removal solutions tailored to meet <br />
                        all your relocation needs across Sydney and Australia. From local moves to <br />
                        interstate relocations, we've got you covered.</p>
                    <div className='md:flex gap-2 md:space-y-0 space-y-4'>
                        <button
                            onClick={navigateToContact}
                            className="bg-amber-600 hover:bg-amber-700 cursor-pointer flex flex-row
                            justify-center items-center space-x-2 text-white text-sm py-3 px-6 shrink-0 rounded-full transition-colors">
                            <FaPhone className="text-white rotate-90" />
                            <h1>Contact Now</h1>
                        </button>
                        <button onClick={handleDialog} className="bg-amber-600 hover:bg-amber-700 cursor-pointer flex flex-row
                            justify-center items-center space-x-2 text-white text-sm py-3 px-6 shrink-0 rounded-full transition-colors">
                            <MdOutlinePreview className="text-white" />
                            <h1>Give Review</h1>
                        </button>
                    </div>
                </motion.div>
                {openDialog && <ReviewDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />}
            </div>
            <div className="w-full py-16 px-4 md:px-28 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Comprehensive solutions for all your moving and removal needs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {getCurrentServices().map((service: any, index: number) => (
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

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-8 px-4">
                            <div className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * servicesPerPage + 1} to{' '}
                                {Math.min(currentPage * servicesPerPage, totalServices)} of{' '}
                                {totalServices} services
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <FaArrowLeft /> Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    Next <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {
                (vehicleData? vehicleData?.length:0) >= 1 && (
                <>
                        <div className="w-full py-16 px-4 md:px-28 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                            >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Fleet Options</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                                Choose the perfect vehicle for your move. All our vehicles are well-maintained and driven by professionals.
                            </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {vehicleData?.map((vehicle) => (
                                <motion.div
                                key={vehicle?.id}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                                >
                                <div className="md:flex">
                                    <div className="md:flex-shrink-0">
                                    <img
                                        className="h-48 w-full md:w-64 object-cover"
                                        src={`${import.meta.env.VITE_SERVER_URL}/${vehicle.imageUrl}`}
                                        alt={vehicle?.name}
                                    />
                                    </div>
                                    <div className="p-8">
                                    <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
                                        {vehicle?.name}
                                    </div>
                                    <p className="mt-2 text-gray-600">{vehicle?.description}</p>
                                    
                                    <div className="mt-4">
                                        <ul className="text-sm text-gray-500 space-y-1">
                                        {vehicle?.capacityCubicMeters && (
                                            <li className="flex items-center">
                                            <FaBox className="mr-2 text-blue-500" />
                                            Capacity: {vehicle?.capacityCubicMeters} m³
                                            </li>
                                        )}
                                        {vehicle?.basePrice && (
                                            <li className="flex items-center">
                                            <FaDollarSign className="mr-2 text-blue-500" />
                                            Starting from: ${vehicle?.basePrice}
                                            </li>
                                        )}
                                        </ul>
                                    </div>
                                    </div>
                                </div>
                                </motion.div>
                            ))}
                            </div>

                            <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Not sure which vehicle you need?</h3>
                            <p className="text-gray-600 mb-4">Our moving consultants can help you choose the right option.</p>
                            <button
                                onClick={navigateToContact}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-amber-600 hover:bg-amber-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FaPhone className="mr-2 rotate-90" /> Get Expert Advice
                            </button>
                            </div>
                        </div>
                        </div>
                </>
                )
            }

            <div className="w-full py-16 px-4 md:px-28 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Service Packages & Pricing
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Choose the perfect package for your moving needs. All prices include professional service and basic insurance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {packages.map((pkg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileHover={{
                                    scale: 1.03
                                }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ opacity: { duration: 0.5, delay: index * 0.1 } }}
                                viewport={{ once: true }}
                                className={`bg-white p-6 rounded-lg border-2 cursor-pointer relative ${pkg.highlight ? "border-amber-500 shadow-lg -top-5 "
                                    : 'border-blue-400 shadow-sm'} hover:shadow-md transition-all`}
                            >
                                {pkg.highlight &&
                                    <div className='absolute -top-0.5 md:-top-4 left-28 bg-amber-600 text-white py-1 px-4 rounded-4xl'>Most Popular</div>
                                }
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">{pkg.title}</h3>
                                    <p className="text-blue-600 font-medium text-lg mb-2">{pkg.price}</p>
                                    <p className="text-gray-600">{pkg.description}</p>
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-start space-x-2">
                                            <div className='bg-green-500 p-2 rounded-full'>
                                                <FaCheck className="text-white flex-shrink-0" />
                                            </div>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <motion.button
                                    onClick={navigateToContact}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-2 px-4 rounded-full font-medium cursor-pointer ${pkg.highlight ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}>
                                    Get Free Quote
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Need a custom solution? We're here to help!
                        </h3>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white text-gray-800 cursor-pointer hover:bg-gray-100 font-medium py-2 px-6 rounded-full border border-gray-300 transition-colors flex items-center justify-center gap-2">
                                <FaPhone /> Call: {contactDetails?.phone1 || "0429594408"}, {contactDetails?.phone2 || "0438526871"}
                            </motion.button>
                            <motion.button
                                onClick={navigateToContact}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-amber-600 hover:bg-amber-700 cursor-pointer text-white font-medium py-2 px-6 rounded-full transition-colors flex items-center justify-center gap-2">
                                <FaQuoteLeft /> Request Custom Quote
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
            <UserFooter />
        </div>
    )
}

export default Service;