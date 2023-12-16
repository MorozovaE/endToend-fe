import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ProjectState {
  dialogOpen: boolean;
  dialogType: "edit" | "create" | null;
  selectedProjectId: number | null;
}

const initialState: ProjectState = {
  dialogOpen: false,
  dialogType: null,
  selectedProjectId: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    openCreateProjectDialog(state) {
      state.dialogOpen = true;
      state.dialogType = "create";
    },
    openEditProjectDialog(state, action) {
      state.dialogOpen = true;
      state.dialogType = "edit";
      state.selectedProjectId = action.payload.id;
    },
    closeProjectDialog(state) {
      state.dialogOpen = false;
      state.selectedProjectId = null;
    },
  },
});

const projectsState = (state: RootState) => state.projects;

export const projectDialogOpenSelector = createSelector(
  projectsState,
  (s) => s.dialogOpen
);

export const projectDialogTypeSelector = createSelector(
  projectsState,
  (s) => s.dialogType
);

export const selectedProjectIdSelector = createSelector(
  projectsState,
  (s) => s.selectedProjectId
);

export const { openCreateProjectDialog, openEditProjectDialog, closeProjectDialog } =
  projectsSlice.actions;

export default projectsSlice.reducer;
