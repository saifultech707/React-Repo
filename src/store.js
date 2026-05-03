import { configureStore, createSlice } from "@reduxjs/toolkit";
import defultpicture from "./assets/IMG_20260206_154654.jpg";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    name: "vc",
    mobile: "v",
    picture: defultpicture,
  },
  reducers: {
    setProfile: (state, action) => {
      state.name = action.payload.name;
      state.mobile = action.payload.mobile;
      state.picture = action.payload.picture;
    },
  },
});

export const { setProfile } = profileSlice.actions;
export default configureStore({
  reducer: {
    profile: profileSlice.reducer,
  },
});
