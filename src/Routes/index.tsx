export const serverUrl=import.meta.env.VITE_SERVER_URL;

export const Customer_Review_Route=`${serverUrl}/api/customer-reviews`;
export const Get_Contact_Info_Route=`${serverUrl}/api/contact-info`;
export const Get_Client_Request_Route=`${serverUrl}/api/contact-messages`;
export const Get_Faq_Route=`${serverUrl}/api/faqs`;
export const Get_Gallery_Media_Route=`${serverUrl}/api/GalleryMedia`;
export const Get_User_Review_Route=`${serverUrl}/api/customer-reviews`;
export const Post_User_Contact_Route=`${serverUrl}/api/contact-messages`;
export const Get_Service_Route=`${serverUrl}/api/services`;
export const Get_Vehicle_Route=`${serverUrl}/api/vehicle-options`;
export const Get_Personal_Options_Route=`${serverUrl}/api/booking-helper-options`;

export const Create_Booking_Requests_Route=`${serverUrl}/api/booking-requests`;
export const Get_Notices_Route=`${serverUrl}/api/notices`;
export const Login_Route=`${serverUrl}/api/auth/login`;
export const Get_Current_Admin_Route=`${serverUrl}/api/auth/me`;
export const Admin_Change_Pass_Route=`${serverUrl}/api/auth/change-password`;
export const Create_User_Route=`${serverUrl}/api/auth/create-user`;
export const Update_User_Route=`${serverUrl}/api/auth/update-user`;
export const Get_Admins_Route=`${serverUrl}/api/auth/users`;
export const Delete_Admin_Route=`${serverUrl}/api/auth/delete-user`;

export const Create_Service_Route=`${serverUrl}/api/services`;
export const Get_Admin_Review_Route=`${Get_User_Review_Route}/admin`;
export const Create_Vehicle_Route=`${serverUrl}/api/vehicle-options`;
export const Get_Admin_Notice_Route=`${serverUrl}/api/notices/admin-all`;

export const Get_Team_Route=`${serverUrl}/api/auth/public-team`;

