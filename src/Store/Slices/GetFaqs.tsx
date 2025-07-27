import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Faq_Route } from "@/Routes";

export const getFaqs = createAsyncThunk(
  "getFaqs",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(Get_Faq_Route);
      //console.log("FAQs", response?.data);
      return response.data;
    } catch (error) {
      toast.error("Something Wrong on getting FAQs.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface Faqs {
    answer:string;
    createdAt:string;
    id:string;
    isActive:boolean; 
    question:string;
    sortOrder:number;
    updatedAt:string;
}

interface FaqsState {
  status: string;
  data: Faqs[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: FaqsState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const faqsSlice = createSlice({
  name: "faqs",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFaqs.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getFaqs.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getFaqs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default faqsSlice.reducer;
