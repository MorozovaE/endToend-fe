import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Box, Button, Typography } from "@mui/material";

export const IncomingRequest = () => {
    
  const projectRequests = [
    {
      user: { id: 1, firstName: "Name1", lastName: "M" },
      project: {
        id: 1,
        title: "New Project 1",
      },
      roleId: 3,
    },
    {
      user: { id: 2, firstName: "Name2", lastName: "X" },
      project: {
        id: 1,
        title: "New Project 1",
      },
      roleId: 3,
    },
  ];

  return (
    <Box flexGrow={1} mr={7} justifyContent={"space-between"}>
    <Typography fontSize={"22px"} sx={{ mt: 5, mb: 2 }}>
      Incoming requests
    </Typography>
    {projectRequests.map((el, index) => (
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box display={"flex"} alignItems={"center"}>
          <Typography key={index}>
            <Typography component={"span"} fontWeight={"600"}>
              {el.user.firstName} {el.user.lastName}
            </Typography>{" "}
            <Typography component={"span"}>
              sent request to project
            </Typography>{" "}
            <Typography
              component={"span"}
              fontWeight={"600"}
              color="#1976d2"
            >
              {el.project.title}
            </Typography>
          </Typography>
        </Box>

        <Box display={"flex"}>
          <Button
            color="success"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <CheckOutlinedIcon sx={{ mr: 1 }} />
            <Typography fontSize={"1em"}>Accept</Typography>
          </Button>
          <Button
            color="error"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <CloseOutlinedIcon sx={{ mr: 1 }} />
            <Typography fontSize={"1em"}>Decline</Typography>
          </Button>
        </Box>
      </Box>
    ))}
  </Box>
  )
}
