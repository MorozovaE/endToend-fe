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
    getOutgoingRequests: builder.query<any, void>({
      query: () => "/projectMember/outgoing",
    }),
    getIncomingRequests: builder.query<any, void>({
      query: () => "/projectMember/incoming",
    }),
    acceptRequest: builder.mutation({
      query: ({
        projectId,
        userId,
      }: {
        projectId: number;
        userId: number;
      }) => ({
        url: `projectMember/${projectId}/${userId}`,
        method: "PUT",
      }),
    }),
    declineRequest: builder.mutation({
      query: ({
        projectId,
        userId,
      }: {
        projectId: number;
        userId: number;
      }) => ({
        url: `projectMember/${projectId}/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useGetOutgoingRequestsQuery,
  useGetIncomingRequestsQuery,
  useAcceptRequestMutation,
  useDeclineRequestMutation,
} = projectMemberApiSlice;
