import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Input, Toolbar, Typography } from "@mui/material";

import Box from "@mui/material/Box";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetProjectQuery } from "../../store/features/projectsApiSlice";
import {
  useDeleteSprintMutation,
  useEditSprintMutation,
  useGetSprintQuery,
  useGetSprintsQuery,
} from "../../store/features/sprintApiSlice";
import {
  selectSprintId,
  selectedSprintIdSelector,
} from "../../store/features/sprintsSlice";
import { useAppDispatch } from "../../store/store";
import { LangToggle } from "../LangToggle/LangToggle";
import LogoutButton from "../LogoutButton/LogoutButton";

const drawerWidth = 240;

export const BoardHeader = ({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: any }) => {

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
      dispatch(selectSprintId(null));
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
    <Box sx={{ display: "flex", flexGrow: 1, width: "100%" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          // ml: { sm: `${drawerWidth}px` },
         
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            mr={"20px"}
            display={"block"}
            sx={{
              display: { xs: "flex", md: "flex" },
              mr: 1,
              alignItems: "strech",
              flexGrow: 1,
            }}
          >
            <Box sx={{ mr: "20px", boxSizing: "border-box" }}>
              <Typography fontSize="11px" color="#ffffff42">
                Project:
              </Typography>
              <Typography fontSize="16px">{project?.title}</Typography>
            </Box>

            <Box sx={{ mr: "20px", boxSizing: "border-box" }}>
              {selectedSprintId && (
                <Typography fontSize="11px" color="#ffffff42">
                  Sprint:
                </Typography>
              )}
              {selectedSprintId &&
                (isEditing ? (
                  <Input
                    sx={{
                      border: 0,
                      borderBottom: "1px solid white",
                      "&&&:before": {
                        borderBottom: "none",
                      },
                      "&&:after": {
                        borderBottom: "none",
                      },
                      color: "white",
                    }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <Box display={"flex"} alignItems={"center"}>
                    <Box>{title}</Box>
                    <IconButton
                      sx={{ color: "white", p: "0", ml: "16px" }}
                      onClick={() => setIsEditing(true)}
                    >
                      <EditOutlinedIcon sx={{ p: "0", fontSize: "1.2rem" }} />
                    </IconButton>
                    <IconButton
                      sx={{ color: "white", p: "0", ml: "8px" }}
                      onClick={handleDelete}
                    >
                      <DeleteOutlinedIcon sx={{ p: "0", fontSize: "1.2rem" }} />
                    </IconButton>
                  </Box>
                ))}
              {isEditing && (
                <>
                  <IconButton sx={{ p: "0" }} onClick={handleEdit}>
                    <CheckOutlinedIcon sx={{ color: "white", p: "0" }} />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          <LangToggle />
          <LogoutButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
