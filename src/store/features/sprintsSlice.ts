import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SprintState {
  selectedSprintId: number | null;
  sprintLoading: boolean;
}

const initialState: SprintState = {
  selectedSprintId: null,
  sprintLoading: false,
};

const sprintSlice = createSlice({
  name: "sprints",
  initialState,
  reducers: {
    selectSprintId(state, action) {
      state.selectedSprintId = action.payload;
    },
    setSprintLoading(state, action: PayloadAction<boolean>) {
      state.sprintLoading = action.payload;
    },
  },
});

const sprintsState = (state: RootState) => state.sprints;

export const selectedSprintIdSelector = createSelector(
  sprintsState,
  (s) => s.selectedSprintId
);

export const selectedSprintLoading = createSelector(
  sprintsState,
  (s) => s.sprintLoading
);

export const { selectSprintId, setSprintLoading } = sprintSlice.actions;

export default sprintSlice.reducer;
