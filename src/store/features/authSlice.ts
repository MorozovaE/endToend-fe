import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IAuthState {
  token: string | null;
}

const initialState: IAuthState = {
  token: localStorage.getItem("token") || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.token = token;
      localStorage.setItem("token", action.payload.token);
    },
    logOut: (state, _: PayloadAction<void>) => {
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    },
  },
});

const authState = (state: RootState) => state.auth;

export const isLoggedInSelector = createSelector(authState, (s) =>
  Boolean(s.token)
);
export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
