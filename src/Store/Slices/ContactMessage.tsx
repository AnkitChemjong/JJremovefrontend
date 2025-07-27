import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Client_Request_Route } from "@/Routes";
import Cookies from "js-cookie";

export const contactMessage = createAsyncThunk(
  "contactMessage",
  async (_, thunkAPI) => {
    try {
      let data=null;
      const token=Cookies.get("token");
      if (token) {
      const response = await axiosClient.get(Get_Client_Request_Route,{headers: {
        Authorization: `Bearer ${token}`
      }});
      //console.log("c",response?.data);
      data=response?.data;
      }
      return data;
    } catch (error) {
      toast.error("Something Wrong on getting contact messages");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message:string;
    createdAt: string;
}

interface ContactMessageState {
  status: string;
  data: ContactMessage[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: ContactMessageState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const contactMessageSlice = createSlice({
  name: "contactMessage",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(contactMessage.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(contactMessage.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(contactMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default contactMessageSlice.reducer;
