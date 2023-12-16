import { IProjectData } from "../../components/ProjectList/ProjectList";
import { apiSlice } from "../api/apiSlice";

export const projectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProject: builder.query({
      query: (id) => {
        if (!id) {
          return "";
        }
        return `/projects/${id}`;
      },
    }),
    getProjects: builder.query<any, void>({
      query: () => "/projects",
    }),
    createProject: builder.mutation({
      query: (credentials: IProjectData) => ({
        url: "/projects",
        method: "POST",
        body: credentials,
      }),
    }),
    editProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteProject: builder.mutation({
      query: ({ id }) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProjectQuery,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useEditProjectMutation,
  useDeleteProjectMutation,
} = projectsApiSlice;
