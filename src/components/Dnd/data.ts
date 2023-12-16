export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN PROGRESS",
  DONE = "DONE",
}

export type Task = {
  id: string;
  title: string;
  desc: string;
  status: TaskStatus;
  sprint: string;
};

export const stringToStatus: Record<string, TaskStatus> = {
  TODO: TaskStatus.TODO,
  IN_PROGRESS: TaskStatus.IN_PROGRESS,
  DONE: TaskStatus.DONE,
};

function getTask(list: any): Task {
  return {
    id: String(list[0]),
    title: list[1],
    desc: list[2],
    status: list[3],
    sprint: list[4],
  };
}

export const tasksInit: Task[] = [
  [1, "Task 1", TaskStatus.TODO],
  [2, "Task 2", TaskStatus.DONE],
  [3, "Task 3", TaskStatus.TODO],
  [4, "Task 4", TaskStatus.IN_PROGRESS],
  [5, "Task 5", TaskStatus.TODO],
  [6, "Task 6", TaskStatus.DONE],
  [7, "Task 7", TaskStatus.IN_PROGRESS],
].map(getTask);
