import { createSelector, createSlice } from "@reduxjs/toolkit";
import { ITask } from "../../components/TaskDialog/CreateTaskDialog";
import { RootState } from "../store";

interface TaskState {
  tasks: ITask[];
}
const initialState: TaskState = {
  tasks: [],
};
// const initialState: ITask[] = [];

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      return state;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      return state;
    },
  },
});

const tasksState = (state: RootState) => state.tasks;
export const tasksSelector = createSelector(tasksState, (s) => s);

export const { setTasks, addTask } = tasksSlice.actions;

export default tasksSlice.reducer;
