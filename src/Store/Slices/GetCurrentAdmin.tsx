import Cookies from "js-cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Current_Admin_Route } from "@/Routes";

export const adminData = createAsyncThunk(
  "adminData",
  async (_, thunkAPI) => {
    try {
        let data=null;
        const token=Cookies.get("token");
        if (token) {
            const response = await axiosClient.get(Get_Current_Admin_Route,{headers: {
                Authorization: `Bearer ${token}`
              }});
            data=response?.data;
            //console.log("Media", response?.data);
        }
        return data;
    } catch (error) {
      toast.error("Something Wrong on getting Media.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface AdminData {
  id: string;
  username: string;
  roles: [string];
  name: string;
  email: string;
}

interface AdminDataState {
  status: string;
  data: AdminData | null;
  error: string | null;
  loading: boolean;
}
const initialState: AdminDataState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const adminDataSlice = createSlice({
  name: "galleryImage",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminData.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(adminData.pending, (state, action) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(adminData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default adminDataSlice.reducer;
