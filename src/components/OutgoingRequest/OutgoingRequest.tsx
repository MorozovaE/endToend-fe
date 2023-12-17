import { Box, Button, Input, Typography } from "@mui/material";
import React from "react";
import {
  useCreateRequestMutation,
  useGetOutgoingRequestsQuery,
} from "../../store/features/project_memberApiSlice";

export const OutgoingRequest = () => {
  const [uuid, setUuid] = React.useState("");

  const [createRequest] = useCreateRequestMutation();
  const { data, refetch } = useGetOutgoingRequestsQuery();

  const onCreateRequest = async () => {
    await createRequest(uuid).unwrap();
    refetch();
    setUuid("");
  };

  return (
    <Box flexGrow={1}>
      <Typography sx={{ mt: 5, mb: 2 }} fontSize={"22px"}>
        Outgoing requests
      </Typography>

      <Box>
        <Box display={"flex"} mb={2}>
          <Input
            fullWidth
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
          />
          <Button onClick={onCreateRequest}>Send</Button>
        </Box>
        {data &&
          data.map((el: any, index: number) => (
            <Box
              mb={"5px"}
              key={index}
              sx={{ display: "flex", p: 0, justifyContent: "space-between" }}
            >
              <Typography component="span">{el.project.title}</Typography>{" "}
              <Typography component="span">{el.project.uuid}</Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
};
