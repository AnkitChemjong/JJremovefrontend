import { useSelector } from "react-redux";
import {type RootState } from "@/Store";
import { FaPhone, FaBolt, FaShieldAlt } from "react-icons/fa";

const ContactInfoBanner = () => {
  const contactState = useSelector((state:RootState) => state.contact);
  const {data:contactDetails}=contactState;

  const contactItems = [
      {
        icon: <FaPhone className="text-amber-600 text-2xl" />,
        title: "Call For Free Quote",
        mainText: contactDetails?.phone1,
        subText: "Available 24/7 for emergency moves"
      },
      {
        icon: <FaBolt className="text-amber-600 text-2xl" />,
        title: "Fast Response Time",
        mainText: "Quick quotes within 2 hours",
        subText: "Same day service available"
      },
      {
        icon: <FaShieldAlt className="text-amber-600 text-2xl" />,
        title: "Fully Insured Service",
        mainText: "Complete protection for your belongings",
        subText: "Licensed and certified professionals"
      }
    ];
  
    
  return (
    <div className="w-full bg-gray-100 py-8 px-4 md:px-28">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactItems.map((item, index) => (
          <div key={index} className="flex flex-col cursor-pointer items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="mb-4 bg-gray-100 p-4 rounded-full border-2 border-amber-400 shadow-lg">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-700 font-medium mb-1">{item.mainText}</p>
            <p className="text-gray-500 text-sm">{item.subText}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfoBanner;