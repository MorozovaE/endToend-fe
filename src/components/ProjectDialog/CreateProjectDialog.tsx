import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { TextFieldElement } from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  useCreateProjectMutation,
  useGetProjectsQuery,
} from "../../store/features/projectsApiSlice";
import {
  closeProjectDialog,
  projectDialogOpenSelector,
} from "../../store/features/projectsSlice";
import { useAppDispatch } from "../../store/store";
import { IProjectData } from "../ProjectList/ProjectList";

export const CreateProjectDialog = () => {
  const { t } = useTranslation("dialog");
  const dispatch = useAppDispatch();
  const [createProject] = useCreateProjectMutation();
  const { refetch } = useGetProjectsQuery();

  const isOpenDialog = useSelector(projectDialogOpenSelector);

  const formContext = useForm<IProjectData>({
    defaultValues: {
      title: "",
      desc: "",
    },
    shouldUseNativeValidation: false,
  });

  const handleClose = () => {
    resetFormDta();
    dispatch(closeProjectDialog());
  };

  const resetFormDta = () => {
    formContext.reset({
      title: "",
      desc: "",
    });
  };

  const onCreateProject: SubmitHandler<IProjectData> = async (data) => {
    try {
      await createProject({
        title: data.title,
        desc: data.desc,
      }).unwrap();
      handleClose();

      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={isOpenDialog} onClose={handleClose}>
      <FormProvider {...formContext}>
        <DialogTitle>{t("createProjectHeader")}</DialogTitle>
        <DialogContent>
          <TextFieldElement
            name="title"
            id="title"
            validation={{
              required: `${t("requeired")}`,
              maxLength: 30,
            }}
            margin="dense"
            placeholder={t("projectNamePlaceholder")}
            fullWidth
          />
          <TextFieldElement
            name="desc"
            id="desc"
            margin="dense"
            placeholder={t("projectDescPlaceholder")}
            fullWidth
          />
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              {t("close")}
            </Button>
            <Button
              variant="contained"
              onClick={formContext.handleSubmit(onCreateProject)}
            >
              {t("create")}
            </Button>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
