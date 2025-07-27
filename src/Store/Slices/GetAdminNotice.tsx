import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Admin_Notice_Route } from "@/Routes";
import Cookies from "js-cookie";

export const getAdminNotice = createAsyncThunk(
  "getAdminNotice",
  async (_, thunkAPI) => {
    try {
        let data=null;
        const token=Cookies.get("token");
        if (token) {
            const response = await axiosClient.get(Get_Admin_Notice_Route,{headers:{
                'Authorization': `Bearer ${token}`
            }});
            //console.log("adminNotice", response?.data);
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
interface AdminNotice {
    id: string;
    content:string;
    type: number;
    isActive: boolean;
    sortOrder: number;
    moreInfo?:string;
    imageUrl?:string;
    createdAt: string;
    updatedAt: string;
}

interface AdminNoticeState {
  status: string;
  data: AdminNotice[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: AdminNoticeState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const getAdminNoticeSlice = createSlice({
  name: "reviews",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminNotice.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getAdminNotice.pending, (state, action) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getAdminNotice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getAdminNoticeSlice.reducer;
