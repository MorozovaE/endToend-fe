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
  Typography,
} from "@mui/material";
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
}

export const ProjectCard = ({ project }: { project: IProject }) => {
  const navigate = useNavigate();
  const [deleteProject] = useDeleteProjectMutation();
  const { refetch } = useGetProjectsQuery();

  const dispatch = useAppDispatch();
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

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <CardActions>
              <Button size="small">Open</Button>
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
      </Card>
    </Box>
  );
};
