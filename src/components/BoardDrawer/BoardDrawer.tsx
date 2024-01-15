import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CycloneIcon from "@mui/icons-material/Cyclone";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {
    Box,
    Divider,
    IconButton,
    Input,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Toolbar,
    Typography
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    useCreateSprintMutation,
    useGetSprintsQuery,
} from "../../store/features/sprintApiSlice";
import {
    selectSprintId,
    selectedSprintIdSelector,
    setSprintLoading,
} from "../../store/features/sprintsSlice";
import { useAppDispatch } from "../../store/store";

export const BoardDrawer = ({
    setMobileOpen,
  }: {
    setMobileOpen: any;
  }) => {
  const { t } = useTranslation("boardPage");
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedSprint = useSelector(selectedSprintIdSelector);
  const { data: sprints, refetch } = useGetSprintsQuery(projectId);
  const [createSprint] = useCreateSprintMutation();
  const [title, setTitle] = React.useState("");
  const [isOpen, setOpen] = React.useState(false);

  const backToProjects = () => {
    dispatch(selectSprintId(null));
    navigate("/projects");
  };

  const closeCreateInput = () => {
    setTitle("");
    setOpen(false);
  };
  const chooseSprint = (id: number | null) => {
    // if go FROM or TO backlog (but not both)
    if (
      (id === null || selectedSprint === null) &&
      !(id === null && selectedSprint === null)
    ) {
      dispatch(setSprintLoading(true));
    }
    dispatch(selectSprintId(id));
    setMobileOpen(false)
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

  return (
    <Box>
      <Toolbar>
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

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={backToProjects}>
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary={t("backToProjects")} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => chooseSprint(null)}>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary={t("backlog")} />
          </ListItemButton>
        </ListItem>

        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <ListSubheader>{t("sprints")}</ListSubheader>

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
    </Box>
  );
};
