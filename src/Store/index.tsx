import {configureStore} from '@reduxjs/toolkit';
import contactDetailsSlice from './Slices/ContactDetails';
import contactMessageSlice from './Slices/ContactMessage';
import faqsSlice from './Slices/GetFaqs';
import getGalleryMediaSlice from './Slices/GalleryMedia';
import getCustomerReviewSlice from './Slices/GetReview';
import getServicesSlice from './Slices/GetServices';
import getVehicleSlice from './Slices/GetVehicleOptions';
import personalOptionsSlice from './Slices/GetPersonalOption';
import getNoticesSlice from './Slices/GetNotice';
import adminDataSlice from './Slices/GetCurrentAdmin';
import getAdminReviewSlice from './Slices/GetAdminReviews';
import getBookingRequestSlice from './Slices/GetBookingRequest';
import getAdminNoticeSlice from './Slices/GetAdminNotice';
import getUsersSlice from './Slices/GetAdmins';
import getTeamSlice from './Slices/GetPublicUsers'


const Store=configureStore({
    reducer:{
        contact:contactDetailsSlice,
        clientRequest:contactMessageSlice,
        faqs:faqsSlice,
        galleryMediaData:getGalleryMediaSlice,
        customerReview:getCustomerReviewSlice,
        services:getServicesSlice,
        vehicles:getVehicleSlice,
        personalOption:personalOptionsSlice,
        notices:getNoticesSlice,
        currentAdmin: adminDataSlice,
        adminReview:getAdminReviewSlice,
        bookingRequest:getBookingRequestSlice,
        adminNotice:getAdminNoticeSlice,
        users:getUsersSlice,
        teams:getTeamSlice
    }
});

export default Store;
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;