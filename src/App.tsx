import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Service from "./pages/Service";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import Gallery from "./pages/Gallery";
import AdminServices from "./pages/AdminServices";
import AdminReviews from "./pages/AdminReviews";
import AdminNotices from "./pages/AdminNotice";
import AdminRequests from "./pages/AdminRequest";
import Login from "./pages/Login";
import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { contactData } from "./Store/Slices/ContactDetails";
import { contactMessage } from "./Store/Slices/ContactMessage";
import { type RootState, type AppDispatch } from "./Store/index";
import { getFaqs } from "./Store/Slices/GetFaqs";
import { getGalleryMedia } from "./Store/Slices/GalleryMedia";
import { getCustomerReview } from "./Store/Slices/GetReview";
import { getVehicle } from "./Store/Slices/GetVehicleOptions";
import { getServices } from "./Store/Slices/GetServices";
import { personalOptions } from "./Store/Slices/GetPersonalOption";
import { getNotice } from "./Store/Slices/GetNotice";
import { adminData } from "./Store/Slices/GetCurrentAdmin";
import SpinSkeleton from "./components/SpinSkeleton";
import { getAdminReview } from "./Store/Slices/GetAdminReviews";
import AdminContact from "./pages/AdminContact";
import AdminVehicle from "./pages/AdminVehicle";
import AdminFAQ from "./pages/AdminFAQ";
import AdminMedia from "./pages/AdminMedia";
import { getBookingRequest } from "./Store/Slices/GetBookingRequest";
import { getAdminNotice } from "./Store/Slices/GetAdminNotice";
import AdminPersonalOption from "./pages/AdminPersonalOption";
import { getUsers } from "./Store/Slices/GetAdmins";
import AdminList from "./pages/AdminList";
import { getTeam } from "./Store/Slices/GetPublicUsers";

const useInitialDispatch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: ContactDetails } = useSelector((state: RootState) => state.contact);
  const { data: clientMessage } = useSelector((state: RootState) => state.clientRequest);
  const { data: faqsData } = useSelector((state: RootState) => state.faqs);
  const { data: mediaData } = useSelector((state: RootState) => state.galleryMediaData);
  const { data: reviewData } = useSelector((state: RootState) => state.customerReview);
  const { data: vehicleData } = useSelector((state: RootState) => state.vehicles);
  const { data: serviceData } = useSelector((state: RootState) => state.services);
  const { data: optionData } = useSelector((state: RootState) => state.personalOption);
  const { data: noticeData } = useSelector((state: RootState) => state.notices);
  const { data: userData } = useSelector((state: RootState) => state.currentAdmin);
  const { data: adminReviewData } = useSelector((state: RootState) => state.adminReview);
  const { data: bookingData } = useSelector((state: RootState) => state.bookingRequest);
  const { data: adminNotice } = useSelector((state: RootState) => state.adminNotice);
  const { data: usersData } = useSelector((state: RootState) => state.users);
  const { data: teamData } = useSelector((state: RootState) => state.teams);

  useEffect(() => {
    if (ContactDetails == null) {
      dispatch(contactData());
    }
    if (teamData == null) {
      dispatch(getTeam());
    }
    if (clientMessage == null) {
      dispatch(contactMessage());
    }
    if (faqsData == null) {
      dispatch(getFaqs());
    }
    if (mediaData == null) {
      dispatch(getGalleryMedia());
    }
    if (reviewData == null) {
      dispatch(getCustomerReview());
    }
    if (usersData === null) {
      dispatch(getUsers());
    }
    if (serviceData == null) {
      dispatch(getServices());
    }
    if (vehicleData == null) {
      dispatch(getVehicle());
    }
    if (optionData == null) {
      dispatch(personalOptions());
    }
    if (noticeData == null) {
      dispatch(getNotice());
    }
    if (userData == null) {
      dispatch(adminData());
    }
    if (adminReviewData == null) {
      dispatch(getAdminReview());
    }
    if (bookingData == null) {
      dispatch(getBookingRequest());
    }
    if (adminNotice == null) {
      dispatch(getAdminNotice());
    }
  }, [dispatch,userData]);
};

const SecureAdminDashboard = ({ children }: { children: ReactNode }) => {
  const { data: userData, loading } = useSelector((state: RootState) => state.currentAdmin);

  if (loading) {
    return <SpinSkeleton />;
  }

  if (!userData || !userData?.roles?.includes("LoginAdmin")) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const SecureUserPages = ({ children }: { children: ReactNode }) => {
  const { data: userData, loading } = useSelector((state: RootState) => state.currentAdmin);

  if (loading) {
    return <SpinSkeleton />;
  }

  if (userData && userData?.roles?.includes("LoginAdmin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  useInitialDispatch();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SecureUserPages><Home /></SecureUserPages>} />
        <Route path="/about" element={<SecureUserPages><About /></SecureUserPages>} />
        <Route path="/service" element={<SecureUserPages><Service /></SecureUserPages>} />
        <Route path="/contact" element={<SecureUserPages><Contact /></SecureUserPages>} />
        <Route path="/gallery" element={<SecureUserPages><Gallery /></SecureUserPages>} />
        <Route path="/admin/dashboard" element={<SecureAdminDashboard><AdminDashboard /></SecureAdminDashboard>} />
        <Route path="/admin/services" element={<SecureAdminDashboard><AdminServices /></SecureAdminDashboard>} />
        <Route path="/admin/reviews" element={<SecureAdminDashboard><AdminReviews /></SecureAdminDashboard>} />
        <Route path="/admin/notice" element={<SecureAdminDashboard><AdminNotices /></SecureAdminDashboard>} />
        <Route path="/admin/requests" element={<SecureAdminDashboard><AdminRequests /></SecureAdminDashboard>} />
        <Route path="/admin/contacts" element={<SecureAdminDashboard><AdminContact /></SecureAdminDashboard>} />
        <Route path="/admin/vehicles" element={<SecureAdminDashboard><AdminVehicle /></SecureAdminDashboard>} />
        <Route path="/admin/faq" element={<SecureAdminDashboard><AdminFAQ /></SecureAdminDashboard>} />
        <Route path="/admin/media" element={<SecureAdminDashboard><AdminMedia /></SecureAdminDashboard>} />
        <Route path="/admin/personal-option" element={<SecureAdminDashboard><AdminPersonalOption /></SecureAdminDashboard>} />
        <Route path="/admin/admins" element={<SecureAdminDashboard><AdminList/></SecureAdminDashboard>} />
        <Route path="/admin/login" element={<SecureUserPages><Login /></SecureUserPages>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
