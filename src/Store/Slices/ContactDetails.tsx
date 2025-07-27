import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Contact_Info_Route } from "@/Routes";

export const contactData = createAsyncThunk(
  "contactData",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(Get_Contact_Info_Route);
    //   console.log("contact", response?.data);
      return response.data;
    } catch (error) {
      toast.error("Something Wrong on getting contact data.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface ContactDetails {
  address: string;
  email: string;
  phone1: string;
  phone2: string;
  officeHours: string;
  mapEmbedUrl: string;
  showVehicleOptionsInBookingForm: boolean;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  
}

interface ContactDetailsState {
  status: string;
  data: ContactDetails | null;
  error: string | null;
  loading: boolean;
}
const initialState: ContactDetailsState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const contactDetailsSlice = createSlice({
  name: "contactDetails",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(contactData.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(contactData.pending, (state, action) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(contactData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default contactDetailsSlice.reducer;
