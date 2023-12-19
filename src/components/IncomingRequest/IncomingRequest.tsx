import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  useAcceptRequestMutation,
  useDeclineRequestMutation,
  useGetIncomingRequestsQuery,
} from "../../store/features/project_memberApiSlice";

export const IncomingRequest = () => {
  const { t } = useTranslation("projectsPage");

  const { data, refetch } = useGetIncomingRequestsQuery();

  const [acceptRequest] = useAcceptRequestMutation();
  const [declineRequest] = useDeclineRequestMutation();

  const handleAccept = async (projectId: number, userId: number) => {
    await acceptRequest({ projectId, userId });
    refetch();
  };

  const handleDecline = async (projectId: number, userId: number) => {
    await declineRequest({ projectId, userId });

    refetch();
  };

  return (
    <Box flexGrow={1} mr={7} justifyContent={"space-between"}>
      <Typography fontSize={"22px"} sx={{ mt: 5, mb: 2 }}>
        {t("incoming-requests")}
      </Typography>
      {data &&
        data.map((el: any, index: number) => (
          <Box display={"flex"} key={index} justifyContent={"space-between"}>
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
                onClick={() => handleAccept(el.project.id, el.user.id)}
              >
                <CheckOutlinedIcon sx={{ mr: 1 }} />
                <Typography fontSize={"1em"}>Accept</Typography>
              </Button>
              <Button
                onClick={() => handleDecline(el.project.id, el.user.id)}
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
  );
};
