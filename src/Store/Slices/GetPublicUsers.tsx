import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Team_Route } from "@/Routes";

export const getTeam = createAsyncThunk(
  "getTeam",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.get(Get_Team_Route);
      //console.log("team", response?.data);
      return response.data;
    } catch (error) {
      toast.error("Something Wrong on getting Team.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);
interface Team {
   id: string;
    name: string;
    email: string;
    roles: string[],
    designation: string;
    description: string;
    photoUrl: string;
    showOnWebsite: boolean;
    joiningDate: string;
    createdAt: string;
    updatedAt: string;
}

interface TeamState {
  status: string;
  data: Team[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: TeamState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const getTeamSlice = createSlice({
  name: "getteam",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeam.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getTeam.pending, (state, action) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getTeam.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getTeamSlice.reducer;
