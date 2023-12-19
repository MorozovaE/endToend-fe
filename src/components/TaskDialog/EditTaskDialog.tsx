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

export const EditTaskDialog = () => {
  const { t } = useTranslation("dialog");

  const dispatch = useAppDispatch();
  const socket = React.useContext(ScoketContext);
  const { projectId } = useParams();
  const { data: sprints } = useGetSprintsQuery(projectId);
  const selectedSprintId = useSelector(selectedSprintIdSelector);
  const isOpenDialog = useSelector(taskDialogOpenSelector);

  const taskId = useSelector(selectedTaskIdSelector);
  const [statusId, setStatusId] = React.useState("1");
  const [sprintId, setSprintId] = React.useState(String(selectedSprintId));

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatusId(event.target.value);
  };
  const handleChangeSprint = (event: SelectChangeEvent) => {
    setSprintId(event.target.value);
  };

  const formContext = useForm<IProjectData>({
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

  const handleClose = () => {
    resetForm();
    dispatch(closeTaskDialog());
  };

  React.useEffect(() => {
    setSprintId(String(sprints?.[0].id));
  }, [sprints]);

  React.useEffect(() => {
    setSprintId(String(selectedSprintId));
  }, [selectedSprintId]);

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
              value={sprintId}
              label="Sprints"
              onChange={handleChangeSprint}
            >
              {sprints?.map((sprint, index) => (
                <MenuItem key={index} value={sprint.id}>
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
