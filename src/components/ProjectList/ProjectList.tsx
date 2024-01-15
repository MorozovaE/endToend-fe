import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useGetIncomingRequestsQuery } from "../../store/features/project_memberApiSlice";
import { useGetProjectsQuery } from "../../store/features/projectsApiSlice";
import {
  openCreateProjectDialog,
  projectDialogTypeSelector,
} from "../../store/features/projectsSlice";
import { useAppDispatch } from "../../store/store";
import { IncomingRequest } from "../IncomingRequest/IncomingRequest";
import { OutgoingRequest } from "../OutgoingRequest/OutgoingRequest";
import { ProjectCard } from "../ProjectCard/ProjectCard";
import { CreateProjectDialog } from "../ProjectDialog/CreateProjectDialog";
import { EditProjectDialog } from "../ProjectDialog/EditProjectDialog";

export interface IProjectData {
  title: string;
  desc: string;
}

export const ProjectList = () => {
  const { t } = useTranslation("projectsPage");
  const { data } = useGetIncomingRequestsQuery();

  const {
    data: projects = [],
    isLoading,
    isError,
    refetch,
  } = useGetProjectsQuery();

  const dialogType = useSelector(projectDialogTypeSelector);
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();

  const handleClickOpen = () => {
    dispatch(openCreateProjectDialog());
  };

  React.useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token]);

  if (isLoading) return <div>loading </div>;
  if (isError) return <div>Error</div>;

  return (
    <Container sx={{ mt: 5 }}>
      <Box display={"flex"} justifyContent={"space-between"} mb={"25px"}>
        <Typography variant="h2">{t("header")}</Typography>
        <Button onClick={handleClickOpen}>
          {t("create-project")}
          <AddIcon />
        </Button>
      </Box>
      {dialogType === "create" ? (
        <CreateProjectDialog />
      ) : dialogType === "edit" ? (
        <EditProjectDialog />
      ) : (
        ""
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {projects.map((el: any, i: number) => (
          <ProjectCard project={el} key={i} />
        ))}
      </Box>

      <Box display={"flex"} flexWrap={"wrap"}>
        {!!data?.length && <IncomingRequest />}
        <OutgoingRequest />
      </Box>
    </Container>
  );
};
