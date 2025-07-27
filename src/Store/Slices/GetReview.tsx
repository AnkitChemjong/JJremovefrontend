import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_User_Review_Route } from "@/Routes";

export const getCustomerReview = createAsyncThunk(
  "getCustomerReview",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(Get_User_Review_Route);
      //console.log("customerReview", response?.data);
      return response.data;
    } catch (error) {
      toast.error("Something Wrong on getting Videos.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface Reviews {
    id: string;
    name: string;
    review: string;
    rating:number;
    createdAt: string;
    isShownInWebsite:boolean;
}

interface ReviewsState {
  status: string;
  data: Reviews[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: ReviewsState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const getCustomerReviewsSlice = createSlice({
  name: "reviews",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerReview.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getCustomerReview.pending, (state, action) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getCustomerReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getCustomerReviewsSlice.reducer;
