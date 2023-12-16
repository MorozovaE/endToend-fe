import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { AppBar, Button, IconButton, Input, Toolbar } from "@mui/material";

import Box from "@mui/material/Box";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { logOut } from "../../store/features/authSlice";
import { useGetProjectQuery } from "../../store/features/projectsApiSlice";
import {
  useDeleteSprintMutation,
  useEditSprintMutation,
  useGetSprintQuery,
  useGetSprintsQuery,
} from "../../store/features/sprintApiSlice";
import { selectedSprintIdSelector } from "../../store/features/sprintsSlice";
import { useAppDispatch } from "../../store/store";

export const BoardHeader = () => {
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const selectedSprintId = useSelector(selectedSprintIdSelector);

  const { data: project, refetch: refetchProject } =
    useGetProjectQuery(projectId);

  const { refetch: refetchSprints } = useGetSprintsQuery(projectId);
  const { data: sprint } = useGetSprintQuery(selectedSprintId);

  const [deleteSprint] = useDeleteSprintMutation();
  const [editSprint] = useEditSprintMutation();

  const handleLogout = () => {
    dispatch(logOut());
  };

  React.useEffect(() => {
    if (sprint) {
      setTitle(sprint.title);
    }
  }, [sprint]);

  React.useEffect(() => {
    refetchProject();
  }, [project]);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await deleteSprint({ id: sprint.id }).unwrap();
      refetchSprints();
      setTitle("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (selectedSprintId) {
        await editSprint({
          id: String(selectedSprintId),
          data: {
            title,
            desc: "",
          },
        }).unwrap();

        setIsEditing(false);
        refetchSprints();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    // <Box>
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      {/* fixed header "Sprint #" */}
      <AppBar
        position="static"
        sx={{
          // width: `calc(100% - ${drawerWidth}px)`,
          // ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Box mr={"20px"} display={"block"}>
            {project?.title}
          </Box>

          {isEditing ? (
            <Input
              sx={{ width: "200px" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              // onBlur={handleEdit}
            />
          ) : (
            <Box display={"flex"} alignItems={"center"}>
              <Box>{title}</Box>
              <IconButton
                sx={{ display: "inline-block" }}
                onClick={() => setIsEditing(true)}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Box>
          )}
          {isEditing && (
            <>
              <IconButton onClick={handleEdit}>
                <CheckOutlinedIcon />
              </IconButton>
            </>
          )}
          <IconButton onClick={handleDelete}>
            <DeleteOutlinedIcon />
          </IconButton>

          <Box>
            <Button color="inherit" onClick={handleLogout}>
              LOGOUT
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
