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
import { useTranslation } from "react-i18next";
import { useGetSprintsQuery } from "../../store/features/sprintApiSlice";
import { selectedSprintIdSelector } from "../../store/features/sprintsSlice";
import {
    closeTaskDialog,
    taskDialogOpenSelector,
} from "../../store/features/tasksDialogSlice";
import { useAppDispatch } from "../../store/store";
import { SocketContext } from "../BoardTaskList/BoardTaskList";
import { columns } from "../Dnd/DndMain";
import { IProjectData } from "../ProjectList/ProjectList";

export interface ITask {
  title: string;
  desc: string;
}
export const CreateTaskDialog = () => {
  const { t } = useTranslation("dialog");
  const selectedSprintId = useSelector(selectedSprintIdSelector);

  const { projectId } = useParams();
  const [statusId, setStatusId] = React.useState("1");
  const [sprintId, setSprintId] = React.useState(selectedSprintId);

  const socket = React.useContext(SocketContext);
  const { data: sprints } = useGetSprintsQuery(projectId);
  const BACKLOG_STRING = "Backlog";

  const [sprintIdOrBacklog, setSprintIdOrBacklog] =
    React.useState<string>(BACKLOG_STRING);

  React.useEffect(() => {
    if (sprintId === null) {
      setSprintIdOrBacklog(BACKLOG_STRING);
    } else {
      setSprintIdOrBacklog(String(sprintId));
    }
  }, [sprintId]);

  const dispatch = useAppDispatch();
  const isOpenDialog = useSelector(taskDialogOpenSelector);

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatusId(event.target.value);
  };

  const handleChangeSprint = (event: SelectChangeEvent) => {
    const value = event.target.value;

    if (value === BACKLOG_STRING) {
      setSprintId(null);
    } else {
      setSprintId(Number(value));
    }
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
    setSprintId(selectedSprintId);
    setStatusId("1");
  };

  React.useEffect(() => {
    setSprintId(selectedSprintId);
  }, [selectedSprintId]);

  const handleClose = () => {
    resetForm();
    dispatch(closeTaskDialog());
  };

  const onCreateTask: SubmitHandler<IProjectData> = async (data) => {
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
        <DialogTitle>{t("createTaskHeader")}</DialogTitle>
        <DialogContent>
          <TextFieldElement
            autoFocus
            name="title"
            id="title"
            validation={{
              required: `${t("requeired")}`,
              maxLength: 30,
            }}
            margin="dense"
            placeholder={t("taskNamePlaceholder")}
            fullWidth
          />
          <TextFieldElement
            name="desc"
            id="desc"
            margin="dense"
            placeholder={t("taskDescPlaceholder")}
            fullWidth
          />

          <FormControl sx={{ mt: 2, minWidth: 120, mr: 2 }}>
            <InputLabel id="demo-simple-select-helper-label">
              {t("status")}
            </InputLabel>
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
            <InputLabel id="demo-simple-select-helper-label">
              {t("sprint")}
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={sprintIdOrBacklog}
              label="Sprints"
              onChange={handleChangeSprint}
            >
              <MenuItem value={BACKLOG_STRING}>Backlog</MenuItem>
              {sprints?.map((sprint, index) => (
                <MenuItem value={String(sprint.id)} key={index}>
                  {sprint.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              {t("close")}
            </Button>
            <Button
              variant="contained"
              onClick={formContext.handleSubmit(onCreateTask)}
            >
              {t("create")}
            </Button>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
