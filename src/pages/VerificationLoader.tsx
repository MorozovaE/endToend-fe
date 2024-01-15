import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyMutation } from "../store/features/authApiSlice";
import { confirmEmail } from "../store/features/authSlice";
import { useAppDispatch } from "../store/store";

export const VerificationLoader = () => {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const [verify] = useVerifyMutation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = params.get("token");
    if (token) {
      verify(token)
        .unwrap()
        .then((payload) => {
          dispatch(confirmEmail());
          navigate("/projects");
        })
        .catch((error) => console.error("rejected", error));
    }
  }, [params]);

  return (
    <Box>
      <Typography>Loading...</Typography>
      <CircularProgress />
    </Box>
  );
};
