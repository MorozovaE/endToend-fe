import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from "../../store/features/projectsApiSlice";
import { openEditProjectDialog } from "../../store/features/projectsSlice";
import { useAppDispatch } from "../../store/store";

export interface IProject {
  id: number;
  title: string;
  desc: string;
  uuid: string;
}

export const ProjectCard = ({ project }: { project: IProject }) => {
  const { t } = useTranslation("projectsPage");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleteProject] = useDeleteProjectMutation();
  const { refetch } = useGetProjectsQuery();
  const [open, setOpen] = React.useState(false);

  const handleCopyUuid = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(true);
    navigator.clipboard.writeText(project.uuid);
  };
  function openProject() {
    navigate(`/board/${project.id}`);
  }

  const handleEditProject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(openEditProjectDialog({ id: project.id }));
  };

  const handleDeleteProject = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    await deleteProject({ id: project.id }).unwrap();
    refetch();
  };

  return (
    <Box>
      <Card sx={{ maxWidth: 345, pt: 2, pl: 2, pb: 1, pr: 2 }}>
        <CardActionArea onClick={openProject} component="a">
          <CardContent>
            <Box>
              <Typography
                fontSize={"18px"}
                gutterBottom
                variant="h5"
                component="div"
              >
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project.desc}
              </Typography>
            </Box>
          </CardContent>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <CardActions>
              <Button size="small">{t("open")}</Button>
            </CardActions>
            <Box>
              <IconButton onClick={handleEditProject}>
                <EditOutlinedIcon />
              </IconButton>
              <IconButton onClick={handleDeleteProject}>
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Box>
          </Box>
        </CardActionArea>
        <Button
          onClick={handleCopyUuid}
          sx={{ width: "100%", display: "block" }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{
              p: "0 0 0 10px",
              backgroundColor: "#d7d7d799",
              borderRadius: "6px",
            }}
          >
            <Snackbar
              open={open}
              onClose={() => setOpen(false)}
              autoHideDuration={2000}
              message="UUID copied to clipboard"
            />

            <Typography
              variant="body2"
              fontSize={"12px"}
              fontFamily={"monospace"}
              color="text.secondary"
              textTransform={"none"}
            >
              {project.uuid}
            </Typography>
            {/* <IconButton sx={{ p: "7px 10px" }} onClick={handleCopyUuid}>
              <ContentCopyIcon sx={{ width: "20px" }} />
            </IconButton> */}
          </Box>
        </Button>
      </Card>
    </Box>
  );
};
