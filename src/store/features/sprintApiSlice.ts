import { FetchArgs } from "@reduxjs/toolkit/query";
import { apiSlice } from "../api/apiSlice";

export interface ISprint {
  id: number;
  title: string;
  desc: string;
}

export interface ISprintData {
  title: string;
  desc: string;
}

export interface ICreateSprint {
  title: string;
  desc: string;
  projectId: number;
}

export interface IEditSprint extends FetchArgs {
  id: string;
  data: ISprintData;
}

export const sprintApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSprints: builder.query<ISprint[], string | undefined>({
      query: (id) => `/sprints?projectId=${id}`,
    }),
    getSprint: builder.query({
      query: (id) => {
        if (!id) {
          return "";
        }
        return `/sprints/${id}`;
      },
    }),
    createSprint: builder.mutation({
      query: (credentials: ICreateSprint) => ({
        url: "/sprints",
        method: "POST",
        body: credentials,
      }),
    }),
    editSprint: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sprints/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteSprint: builder.mutation({
      query: ({ id }) => ({
        url: `/sprints/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSprintsQuery,
  useCreateSprintMutation,
  useGetSprintQuery,
  useDeleteSprintMutation,
  useEditSprintMutation,
} = sprintApiSlice;
