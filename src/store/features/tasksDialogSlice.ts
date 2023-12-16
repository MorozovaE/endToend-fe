import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface TaskDialogState {
  dialogOpen: boolean;
  dialogType: "edit" | "create" | null;
  selectedTaskId: number | null;
}

const initialState: TaskDialogState = {
  dialogOpen: true,
  dialogType: null,
  selectedTaskId: null,
};

const tasksDialogSlice = createSlice({
  name: "tasksDialog",
  initialState,
  reducers: {
    openCreateTaskDialog(state) {
      state.dialogOpen = true;
      state.dialogType = "create";
    },
    openEditTaskDialog(state, action) {
      state.dialogOpen = true;
      state.dialogType = "edit";
      state.selectedTaskId = action.payload.id;
    },
    closeTaskDialog(state) {
      state.dialogOpen = false;
      state.selectedTaskId = null;
    },
  },
});

const tasksDialogState = (state: RootState) => state.tasksDialog;

export const taskDialogOpenSelector = createSelector(
  tasksDialogState,
  (s) => s.dialogOpen
);

export const taskDialogTypeSelector = createSelector(
  tasksDialogState,
  (s) => s.dialogType
);

export const selectedTaskIdSelector = createSelector(
  tasksDialogState,
  (s) => s.selectedTaskId
);

export const {
  openCreateTaskDialog,
  openEditTaskDialog,
  closeTaskDialog,
} = tasksDialogSlice.actions;

export default tasksDialogSlice.reducer;
