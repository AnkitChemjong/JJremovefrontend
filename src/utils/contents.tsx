import  { FaDollarSign, FaUsers, FaGraduationCap, FaClock, FaHeadset,
FaShieldAlt,
FaSmile, FaHistory, FaTruckMoving,
 FaHeart, FaMapMarkerAlt

} from 'react-icons/fa';





export const features = [
    {
      icon: <FaShieldAlt className="text-white" size={24} />,
      title: "Fully Insured",
      description: "Complete protection for all your belongings during the move"
    },
    {
      icon: <FaDollarSign className="text-white" size={24} />,
      title: "Fair Rates, No Hidden Charges",
      description: "Transparent pricing with no surprise fees"
    },
    {
      icon: <FaUsers className="text-white" size={24} />,
      title: "Experienced Team",
      description: "Skilled professionals with years of moving experience"
    },
    {
      icon: <FaGraduationCap className="text-white" size={24} />,
      title: "Trained by the Community",
      description: "Local expertise serving the Sydney community"
    },
    {
      icon: <FaClock className="text-white" size={24} />,
      title: "On Time, Every Time",
      description: "Punctual service that respects your schedule"
    },
    {
      icon: <FaHeadset className="text-white" size={24} />,
      title: "Customer Service Priority",
      description: "Your satisfaction is our top priority"
    }
  ];

  export const stats = [
    { 
      number: "1000+", 
      label: "Happy Customers",
      icon: <FaSmile className="text-white text-2xl " />
    },
    { 
      number: "15+", 
      label: "Years Experience",
      icon: <FaHistory className="text-white text-2xl " />
    },
    { 
      number: "5000+", 
      label: "Successful Moves",
      icon: <FaTruckMoving className="text-white text-2xl " />
    },
    { 
      number: "24/7", 
      label: "Customer Support",
      icon: <FaHeadset className="text-white text-2xl" />
    }
  ];

export  const values = [
  {
    icon: <FaShieldAlt className="text-white" size={24} />,
    title: "Reliability & Trust",
    description: "We are fully licensed and insured, providing you with complete peace of mind during your move."
  },
  {
    icon: <FaDollarSign className="text-white" size={24} />,
    title: "Competitive Pricing",
    description: "Quality service at affordable rates with transparent pricing and no hidden costs."
  },
  {
    icon: <FaUsers className="text-white" size={24} />,
    title: "Professional Team",
    description: "Our experienced professionals handle every move with expertise, care, and attention to detail."
  },
  {
    icon: <FaClock className="text-white" size={24} />,
    title: "Punctuality",
    description: "We respect your time and ensure timely completion of every moving project."
  },
  {
    icon: <FaHeart className="text-white" size={24} />,
    title: "Customer First",
    description: "Your satisfaction is our priority. We go above and beyond to exceed your expectations."
  },
  {
    icon: <FaMapMarkerAlt className="text-white" size={24} />,
    title: "Australia-wide Coverage",
    description: "From local Sydney moves to interstate relocations, we serve customers across Australia."
  }
];

export const packages = [
  {
    title: "Local Moves",
    price: "Starting from $80/hr",
    description: "Perfect for local Sydney moves and small relocations",
    features: [
      "2 Professional movers",
      "Basic moving equipment",
      "Local transport included",
      "Basic insurance coverage",
      "Same-day availability"
    ],
    highlight: false
  },
  {
    title: "Full Service Package",
    price: "Custom Quote",
    description: "Complete moving solution with all services included",
    features: [
      "Full packing & unpacking",
      "Professional team (3-4 movers)",
      "Premium insurance coverage",
      "Furniture assembly/disassembly",
      "Storage solutions available",
      "Interstate capability"
    ],
    highlight: true
  },
  {
    title: "Commercial Moves",
    price: "Custom Quote",
    description: "Specialized business and office relocation services",
    features: [
      "Minimal business downtime",
      "IT equipment specialists",
      "Weekend/after-hours service",
      "Project management included",
      "Equipment installation support"
    ],
    highlight: false
  }
];


