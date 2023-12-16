import { apiSlice } from "../api/apiSlice";

export interface IProjectMember {
  uuid: string;
}

export const projectMemberApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRequest: builder.mutation({
      query: (uuid: string) => ({
        url: `/projectMember/${uuid}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useCreateRequestMutation } = projectMemberApiSlice;
