import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Create_Booking_Requests_Route } from "@/Routes";
import Cookies from "js-cookie";

export interface PickDropAddress {
  unitOrHouseNo:string;
        suburb: string;
        city: string;
        postCode:string;
}
export interface AdminBookingRequests {
      id: string;
      desiredDate:string;
      desiredTime: string;
      name:string;
      contactNumber: string;
      pickupAddress: PickDropAddress;
      dropoffAddress: PickDropAddress;
      vehicleOptionId: string;
      personnelOptionId: string;
      submittedAt: string;
}

export const getBookingRequest = createAsyncThunk(
  "getBookingRequest",
  async (_, thunkAPI) => {
    try {
        let data=null;
        const token=Cookies.get("token");
        if (token) {
            const response = await axiosClient.get(Create_Booking_Requests_Route,{headers:{
                'Authorization': `Bearer ${token}`
            }});
            //console.log("Booking request", response?.data);
            data = response?.data;
        }
      return data;
    } catch (error) {
      toast.error("Something Wrong on getting Videos.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

interface AdminBookingRequestsState{
  status: string;
  data: AdminBookingRequests[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: AdminBookingRequestsState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const getBookingRequestSlice = createSlice({
  name: "bookingrequest",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBookingRequest.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getBookingRequest.pending, (state, action) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getBookingRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getBookingRequestSlice.reducer;
