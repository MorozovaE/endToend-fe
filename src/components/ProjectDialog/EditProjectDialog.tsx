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
        <DialogTitle>Edit project</DialogTitle>
        <DialogContent>
          <FormLabel htmlFor={"title"} />
          <TextFieldElement
            margin="dense"
            name="title"
            id="title"
            validation={{
              required: "This field is requeired",
              maxLength: 30,
            }}
            placeholder="Enter the project name"
            fullWidth
          />
          <FormLabel htmlFor={"desc"} />

          <TextFieldElement
            name="desc"
            id="desc"
            margin="dense"
            placeholder="Enter the project description"
            fullWidth
          />
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={formContext.handleSubmit(onEditProject)}
            >
              Save
            </Button>
          </DialogActions>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};
