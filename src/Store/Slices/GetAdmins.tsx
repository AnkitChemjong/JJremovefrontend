import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/Services/AxiosRequest";
import { toast } from "sonner";
import { Get_Admins_Route } from "@/Routes";
import Cookies from "js-cookie";

export interface Users {
          id: string;
          username: string;
          name: string;
          email: string;
          roles: string[];
          createdAt: string;
          updatedAt: string;
}

export const getUsers = createAsyncThunk(
  "getUsers",
  async (_, thunkAPI) => {
    try {
        let data=null;
        const token=Cookies.get("token");
        if (token) {
            const response = await axiosClient.get(Get_Admins_Route,{headers:{
                'Authorization': `Bearer ${token}`
            }});
            //console.log("Admin Data", response?.data);
            data = response?.data;
        }
      return data;
    } catch (error) {
      toast.error("Something Wrong on getting admins.");
      console.log(error);
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

interface UsersState{
  status: string;
  data: Users[] | null | [];
  error: string | null;
  loading: boolean;
}
const initialState: UsersState = {
  status: "pending",
  data: null,
  error: null,
  loading: true,
};
const getUsersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getUsers.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message!;
        state.loading = false;
      });
  },
});

export default getUsersSlice.reducer;
