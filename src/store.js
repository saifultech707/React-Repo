import { configureStore, createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    name: "",
    mobile: "",
    picture: null,
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