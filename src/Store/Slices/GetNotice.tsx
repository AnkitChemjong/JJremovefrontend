import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Notices_Route } from "@/Routes";


export const getNotice = createAsyncThunk(
  "getNotice",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(Get_Notices_Route);
      //console.log("getNotice", response?.data);
      return response.data;
    } catch (error) {
      toast.error("Something Wrong on getting Notices.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface Notices {
   id:string;
    content: string;
    type: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

interface NoticesState {
  status: string;
  data: Notices[] | null | [];
  error: string | null;
  loading: boolean;
};

const initialState: NoticesState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};

const getNoticeSlice = createSlice({
  name: "notices",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotice.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getNotice.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getNotice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getNoticeSlice.reducer;
