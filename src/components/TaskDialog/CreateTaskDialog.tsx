import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { TextFieldElement } from "react-hook-form-mui";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import React from "react";
import { useGetSprintsQuery } from "../../store/features/sprintApiSlice";
import { selectedSprintIdSelector } from "../../store/features/sprintsSlice";
import {
  closeTaskDialog,
  taskDialogOpenSelector,
} from "../../store/features/tasksDialogSlice";
import { useAppDispatch } from "../../store/store";
import { ScoketContext } from "../BoardTaskList/BoardTaskList";
import { columns } from "../Dnd/DndMain";
import { IProjectData } from "../ProjectList/ProjectList";

export interface ITask {
  title: string;
  desc: string;
}
export const CreateTaskDialog = () => {
  const socket = React.useContext(ScoketContext);
  const { projectId } = useParams();
  const selectedSprintId = useSelector(selectedSprintIdSelector);

  const { data: sprints } = useGetSprintsQuery(projectId);
  const [statusId, setStatusId] = React.useState("1");
  const [sprintId, setSprintId] = React.useState(String(selectedSprintId));

  const dispatch = useAppDispatch();
  const isOpenDialog = useSelector(taskDialogOpenSelector);

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatusId(event.target.value);
  };
  const handleChangeSprint = (event: SelectChangeEvent) => {
    setSprintId(event.target.value);
  };

  const formContext = useForm<ITask>({
    defaultValues: {
      title: "",
      desc: "",
    },
    shouldUseNativeValidation: false,
  });

  const resetForm = () => {
    formContext.reset({
      title: "",
      desc: "",
    });
    setSprintId(String(selectedSprintId));
    setStatusId("1");
  };

  React.useEffect(() => {
    setSprintId(String(sprints?.[0].id));
  }, [sprints]);

  React.useEffect(() => {
    setSprintId(String(selectedSprintId));
  }, [selectedSprintId]);

  const handleClose = () => {
    resetForm();
    dispatch(closeTaskDialog());
  };

  const onCreateTask: SubmitHandler<IProjectData> = async (data) => {
    const obj = {
      title: data.title,
      desc: data.desc,
      projectId,
      sprintId,
      statusId,
    };

    socket.emit("createTask", {
      title: data.title,
      desc: data.desc,
      projectId,
      sprintId,
      statusId,
    });
    handleClose();
  };

  return (
    <Dialog open={isOpenDialog} onClose={handleClose}>
      <FormProvider {...formContext}>
        <DialogTitle>Create new task</DialogTitle>
        <DialogContent>
          <TextFieldElement
            autoFocus
            name="title"
            id="title"
            validation={{
              required: "This field is requeired",
              maxLength: 30,
            }}
            margin="dense"
            placeholder="Enter the project name"
            fullWidth
          />
          <TextFieldElement
            name="desc"
            id="desc"
            margin="dense"
            placeholder="Enter the project description"
            fullWidth
          />

          <FormControl sx={{ mt: 2, minWidth: 120, mr: 2 }}>
            <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={statusId}
              label="Status"
              onChange={handleChangeStatus}
            >
              {columns.map((el, i) => (
                <MenuItem key={i} value={++i}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Sprint</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={sprintId}
              label="Sprints"
              onChange={handleChangeSprint}
            >
              {sprints?.map((sprint, index) => (
                <MenuItem value={sprint.id} key={index}>
                  {sprint.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={formContext.handleSubmit(onCreateTask)}
            >
              Create
            </Button>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
