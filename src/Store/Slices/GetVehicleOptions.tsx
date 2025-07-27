import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Vehicle_Route } from "@/Routes";

export const getVehicle = createAsyncThunk(
  "getVehicle",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(Get_Vehicle_Route);
      //console.log("getVehicle", response?.data);
      return response.data;
    } catch (error) {
      toast.error("Something Wrong on getting Videos.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface Vehicle {
    id: string;
    name: string;
    description: string;
    capacityCubicMeters: null;
    imageUrl: string;
    isActive: boolean;
    basePrice: null;
    sortOrder: number;
    extraNotes: null;
    showInBookingForm: boolean;
    imageBase64: null;
}

interface VehicleState {
  status: string;
  data: Vehicle[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: VehicleState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const getVehicleSlice = createSlice({
  name: "getVehicle",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVehicle.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getVehicle.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getVehicle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getVehicleSlice.reducer;
