import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { apiSlice } from "./api/apiSlice";
import auth from "./features/authSlice";
import projects from "./features/projectsSlice";
import sprints from "./features/sprintsSlice";
import tasksDialog from "./features/tasksDialogSlice";
import tasks from "./features/tasksSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth,
    projects,
    sprints,
    tasks,
    tasksDialog,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
