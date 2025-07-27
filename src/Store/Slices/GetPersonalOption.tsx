import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Personal_Options_Route } from "@/Routes";

export const personalOptions = createAsyncThunk(
  "personalOpetions",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(Get_Personal_Options_Route);
      //console.log("persona review", response?.data);
      return response.data;
    } catch (error) {
      toast.error("Something Wrong on getting personalOptions.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface Options {
   id: string;
    name: string;
    description: string;
}

interface OptionsState {
  status: string;
  data: Options[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: OptionsState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const personalOptionsSlice = createSlice({
  name: "galleryVideo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(personalOptions.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(personalOptions.pending, (state, action) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(personalOptions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default personalOptionsSlice.reducer;
