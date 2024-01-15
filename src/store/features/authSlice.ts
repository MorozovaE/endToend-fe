import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IAuthState {
  token: string | null;
  isEmailConfirmed: boolean;
}

const initialState: IAuthState = {
  token: localStorage.getItem("token") || null,
  isEmailConfirmed:
    Boolean(Number(localStorage.getItem("isEmailConfirmed"))) || false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; isEmailConfirmed: boolean }>
    ) => {
      const { token, isEmailConfirmed } = action.payload;
      state.token = token;
      state.isEmailConfirmed = isEmailConfirmed;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "isEmailConfirmed",
        String(Number(action.payload.isEmailConfirmed))
      );
    },
    logOut: (state, _: PayloadAction<void>) => {
      state.token = null;
      state.isEmailConfirmed = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isEmailConfirmed");
    },
    confirmEmail: (state, _: PayloadAction<void>) => {
      state.isEmailConfirmed = true;
      localStorage.setItem("isEmailConfirmed", "1");
    },
  },
});

const authState = (state: RootState) => state.auth;

export const isLoggedInSelector = createSelector(authState, (s) =>
  Boolean(s.token)
);

export const isConfirmedEmailSelector = createSelector(
  authState,
  (s) => s.isEmailConfirmed
);
export const { setCredentials, logOut, confirmEmail } = authSlice.actions;

export default authSlice.reducer;
