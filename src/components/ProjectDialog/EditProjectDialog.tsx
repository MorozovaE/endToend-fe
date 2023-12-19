import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
} from "@mui/material";
import React from "react";
import {
  FormProvider,
  SubmitHandler,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  useEditProjectMutation,
  useGetProjectQuery,
  useGetProjectsQuery,
} from "../../store/features/projectsApiSlice";
import {
  closeProjectDialog,
  projectDialogOpenSelector,
  selectedProjectIdSelector,
} from "../../store/features/projectsSlice";
import { useAppDispatch } from "../../store/store";
import { IProjectData } from "../ProjectList/ProjectList";

export const EditProjectDialog = () => {
  const { t } = useTranslation("dialog");

  const dispatch = useAppDispatch();
  const projectId = useSelector(selectedProjectIdSelector);
  const isOpenDialog = useSelector(projectDialogOpenSelector);

  const projectResult = useGetProjectQuery(projectId);
  const projectsResults = useGetProjectsQuery();
  const [editProject] = useEditProjectMutation();

  const formContext = useForm<IProjectData>({
    defaultValues: {
      title: "",
      desc: "",
    },
    shouldUseNativeValidation: false,
  });
  const handleClose = () => {
    dispatch(closeProjectDialog());
  };

  React.useEffect(() => {
    if (!projectResult.isLoading) {
      formContext.reset(projectResult.data);
    }
  }, [projectResult.data]);

  const onEditProject: SubmitHandler<IProjectData> = async (data) => {
    try {
      await editProject({
        id: projectId,
        data: {
          title: data?.title,
          desc: data?.desc,
        },
      }).unwrap();

      handleClose();
      projectsResults.refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={isOpenDialog} onClose={handleClose}>
      <FormProvider {...formContext}>
        <DialogTitle>{t("editProjectHeader")}</DialogTitle>
        <DialogContent>
          <FormLabel htmlFor={"title"} />
          <TextFieldElement
            margin="dense"
            name="title"
            id="title"
            validation={{
              required: `${t("requeired")}`,
              maxLength: 30,
            }}
            placeholder={t("projectNamePlaceholder")}
            fullWidth
          />
          <FormLabel htmlFor={"desc"} />

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
              onClick={formContext.handleSubmit(onEditProject)}
            >
            {t("сохранить")}
            </Button>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
