import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Gallery_Media_Route } from "@/Routes";

export const getGalleryMedia = createAsyncThunk(
  "getGalleryImage",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(Get_Gallery_Media_Route);
      //console.log("Media", response?.data);
      return response.data;
    } catch (error) {
      toast.error("Something Wrong on getting Media.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface Medias {
  youTubeUrl: any;
  id: string;
  url: string;
  caption: string;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
  isDeleted: boolean;
  type: string;
}

interface MediasState {
  status: string;
  data: Medias[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: MediasState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const getGalleryMediaSlice = createSlice({
  name: "galleryImage",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGalleryMedia.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getGalleryMedia.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getGalleryMedia.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getGalleryMediaSlice.reducer;
