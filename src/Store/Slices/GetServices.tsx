import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Service_Route } from "@/Routes";

export const getServices = createAsyncThunk(
  "getServices",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(Get_Service_Route);
      //console.log("getServices", response?.data);
      return response.data;
    } catch (error) {
      toast.error("Something Wrong on getting Videos.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface Services {
    id: string;
    name: string;
    description: string;
    sortOrder: number;
    isActive: boolean;
    iconUrl:string;
    imageUrl1: string;
    imageUrl2: string;
    imageUrl3: string;
}

interface ServicesState {
  status: string;
  data: Services[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: ServicesState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const getServicesSlice = createSlice({
  name: "getServices",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getServices.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getServices.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getServicesSlice.reducer;
