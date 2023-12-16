import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CycloneIcon from "@mui/icons-material/Cyclone";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateSprintMutation,
  useGetSprintsQuery,
} from "../../store/features/sprintApiSlice";
import { selectSprintId } from "../../store/features/sprintsSlice";
import { useAppDispatch } from "../../store/store";
const drawerWidth = 240;

export const BoardSideNav = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projectId } = useParams();
  const [isOpen, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const { data: sprints, refetch } = useGetSprintsQuery(projectId);
  const [createSprint] = useCreateSprintMutation();

  React.useEffect(() => {
    if (sprints) {
      dispatch(selectSprintId(sprints[0]?.id));
    }
  }, [sprints]);

  const closeCreateInput = () => {
    setTitle("");
    setOpen(false);
  };

  const chooseSprint = (id: number) => {
    dispatch(selectSprintId(id));
  };

  const onCreateSprint = async () => {
    try {
      if (projectId) {
        await createSprint({
          title,
          desc: "",
          projectId: Number(projectId),
        }).unwrap();
      }
      await refetch();
      closeCreateInput();
    } catch (err) {
      console.log(err);
    }
  };

  const backToProjects = () => {
    dispatch(selectSprintId(null));
    navigate("/projects");
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        {/* logo */}
        <Box
          sx={{
            display: { xs: "flex", md: "flex" },
            mr: 1,
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <CycloneIcon sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "flex" },
              fontFamily: "monospace",
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            endToEnd
          </Typography>
        </Box>
      </Toolbar>
      <Divider />

      {/* Navigation */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={backToProjects}>
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary={"back to Proejcts"} />
          </ListItemButton>
        </ListItem>
      </List>

      {/* <List>
        <ListItem disablePadding>
          <ListItemButton to="/projects" component={NavLink}>
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary={"back to Proejcts"} />
          </ListItemButton>
        </ListItem>
      </List> */}
      <Divider />

      <List>
        {/* backlog */}
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary={"Backlog"} />
          </ListItemButton>
        </ListItem>

        {/* sprints */}
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <ListSubheader>{`Sprints`}</ListSubheader>

          {isOpen ? (
            <IconButton onClick={closeCreateInput}>
              <CloseOutlinedIcon sx={{ pr: "16px", pl: "16px" }} />
            </IconButton>
          ) : (
            <IconButton onClick={() => setOpen(true)}>
              <AddOutlinedIcon sx={{ pr: "16px", pl: "16px" }} />
            </IconButton>
          )}
        </Box>
        {isOpen && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: "16px",
              ml: "16px",
            }}
          >
            <Input
              value={title}
              autoFocus
              type="text"
              onChange={(e: any) => {
                setTitle(e.target.value);
              }}
            />
            <IconButton onClick={onCreateSprint}>
              <CheckOutlinedIcon />
            </IconButton>
          </Box>
        )}

        {sprints &&
          sprints.map((el, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => chooseSprint(el.id)}>
                <ListItemText primary={el.title} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Drawer>
  );
};
