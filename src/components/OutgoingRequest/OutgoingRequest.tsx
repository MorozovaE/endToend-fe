import { Box, Button, Input, Typography } from "@mui/material";
import React from "react";
import { useCreateRequestMutation } from "../../store/features/project_memberApiSlice";

export const OutgoingRequest = () => {
  const [uuid, setUuid] = React.useState("");

  const outgoingRequests = [
    {
      id: 1,
      title: "Test Poject",
      uiid: "sjdfnodsnfp",
    },
    {
      id: 2,
      title: "Test Poject2",
      uiid: "sjdUBTVUdsnfp",
    },
  ];
  const [createRequest] = useCreateRequestMutation();

  const onCreateRequest = async () => {
    console.log(uuid);
    
    await createRequest(uuid).unwrap();
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
        {outgoingRequests.map((el, index) => (
          <Box
            mb={"5px"}
            key={index}
            sx={{ display: "flex", p: 0, justifyContent: "space-between" }}
          >
            <Typography component="span">{el.title}</Typography>{" "}
            <Typography component="span">{el.uiid}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
