import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  AppBar,
  Button,
  IconButton,
  Input,
  Toolbar,
  Typography
} from "@mui/material";

import Box from "@mui/material/Box";
import React from "react";
import { useTranslation } from "react-i18next";
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
import { LangToggle } from "../LangToggle/LangToggle";

export const BoardHeader = () => {
  const { t } = useTranslation("boardPage");

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
    <Box sx={{ display: "flex", flexGrow: 1, width: "100%"}}>
      {/* <Container sx={{ width: "100%" }}> */}
        <AppBar position="static">
          <Toolbar>
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
              <Box sx={{ mr: "20px", boxSizing: "border-box"}}>
                <Typography fontSize="11px" color="#ffffff42">Project:</Typography>
                <Typography fontSize="16px">{project?.title}</Typography>
              </Box>
              
             <Box sx={{ mr: "20px", boxSizing: "border-box"}}>
              

              {selectedSprintId && <Typography fontSize="11px" color="#ffffff42">Sprint:</Typography>} 
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
                        color: 'white'
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
                        <EditOutlinedIcon  sx={{ p: "0", fontSize:"1.2rem" }}  />
                      </IconButton>
                      <IconButton sx={{ color: "white", p: "0", ml: "8px" }} onClick={handleDelete}>
                        <DeleteOutlinedIcon  sx={{ p: "0", fontSize:"1.2rem" }} />
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
            <Box>
              <Button color="inherit" onClick={handleLogout}>
                {t("logout")}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      {/* </Container> */}
    </Box>
  );
};
