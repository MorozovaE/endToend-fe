import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { TextFieldElement } from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetSprintsQuery } from "../../store/features/sprintApiSlice";
import { selectedSprintIdSelector } from "../../store/features/sprintsSlice";
import {
  closeTaskDialog,
  selectedTaskIdSelector,
  taskDialogOpenSelector,
} from "../../store/features/tasksDialogSlice";
import { useAppDispatch } from "../../store/store";
import { ScoketContext } from "../BoardTaskList/BoardTaskList";
import { columns } from "../Dnd/DndMain";
import { IProjectData } from "../ProjectList/ProjectList";
import { ITask } from "./CreateTaskDialog";

export const EditTaskDialog = () => {
  const taskId = useSelector(selectedTaskIdSelector);
  const { t } = useTranslation("dialog");

  const socket = React.useContext(ScoketContext);
  const { projectId } = useParams();
  const selectedSprintId = useSelector(selectedSprintIdSelector);
  const { data: sprints } = useGetSprintsQuery(projectId);
  const [statusId, setStatusId] = React.useState("1");
  const [sprintId, setSprintId] = React.useState(selectedSprintId);
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

  React.useEffect(() => {
    if (taskId) {
      socket.emit("getTask", taskId, (data: any) => {
        formContext.reset({
          title: data.title,
          desc: data.desc,
        });
        setStatusId(data.status.id);
      });
    }
  }, [taskId, formContext, socket]);

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
    dispatch(closeTaskDialog());
    resetForm();
  };

  const onEditProject: SubmitHandler<IProjectData> = async (data) => {
    const updatedTask = {
      id: taskId,
      title: data.title,
      desc: data.desc,
      sprintId,
      statusId,
    };
    socket.emit("editTask", updatedTask);
    handleClose();
  };

  return (
    <Dialog open={isOpenDialog} onClose={handleClose}>
      <FormProvider {...formContext}>
        <DialogTitle>{t("editTaskHeader")}</DialogTitle>
        <DialogContent>
          <FormLabel htmlFor={"title"} />
          <TextFieldElement
            autoFocus
            margin="dense"
            name="title"
            id="title"
            validation={{
              required: `${t("requeired")}`,
              maxLength: 30,
            }}
            placeholder={t("taskNamePlaceholder")}
            fullWidth
          />

          <FormLabel htmlFor={"desc"} />
          <TextFieldElement
            name="desc"
            id="desc"
            margin="dense"
            placeholder={t("taskDescPlaceholder")}
            fullWidth
          />

          <FormControl sx={{ mt: 2, mr: 2, minWidth: 120 }}>
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
              {columns.map((el, id) => (
                <MenuItem key={id} value={++id}>
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
              onClick={formContext.handleSubmit(onEditProject)}
            >
              {t("save")}
            </Button>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
