import { ILoginData } from "../../pages/Login";
import { ISignupData } from "../../pages/Signup";
import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: ILoginData) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials: ISignupData) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    verify: builder.mutation({
      query: (token: string) => ({
        url: `/auth/verify?token=${token}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useVerifyMutation } =
  authApiSlice;
