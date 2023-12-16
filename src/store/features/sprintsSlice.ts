import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SprintState {
  selectedSprintId: number | null;
}

const initialState: SprintState = {
  selectedSprintId: null,
};

const sprintSlice = createSlice({
  name: "sprints",
  initialState,
  reducers: {
    selectSprintId(state, action) {
      state.selectedSprintId = action.payload;
    },
  },
});

const sprintsState = (state: RootState) => state.sprints;

export const selectedSprintIdSelector = createSelector(
  sprintsState,
  (s) => s.selectedSprintId
);

export const { selectSprintId } = sprintSlice.actions;

export default sprintSlice.reducer;
