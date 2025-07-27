import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Admin_Review_Route } from "@/Routes";
import Cookies from "js-cookie";

export const getAdminReview = createAsyncThunk(
  "getAdminReview",
  async (_, thunkAPI) => {
    try {
        let data=null;
        const token=Cookies.get("token");
        if (token) {
            const response = await axiosClient.get(Get_Admin_Review_Route,{headers:{
                'Authorization': `Bearer ${token}`
            }});
            //console.log("adminReview", response?.data);
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
interface AdminReviews {
    id: string;
    name: string;
    review: string;
    rating:number;
    createdAt: string;
    isShownInWebsite:boolean;
}

interface AdminReviewsState {
  status: string;
  data: AdminReviews[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: AdminReviewsState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const getAdminReviewsSlice = createSlice({
  name: "reviews",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminReview.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getAdminReview.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getAdminReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getAdminReviewsSlice.reducer;
