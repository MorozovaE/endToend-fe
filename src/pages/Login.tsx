import {
  Box,
  Button,
  Container,
  FormLabel,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FormContainer,
  PasswordElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { NavLink, useNavigate } from "react-router-dom";
import { regExp } from "../shared/regExp";
import { useLoginMutation } from "../store/features/authApiSlice";
import { setCredentials } from "../store/features/authSlice";
import { useAppDispatch } from "../store/store";

export interface ILoginData {
  email: string;
  password: string;
}

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const [login] = useLoginMutation();

  const formContext = useForm<ILoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
    shouldUseNativeValidation: false,
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ILoginData> = async (data) => {
    try {
      const userData = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      dispatch(setCredentials({ token: userData.token }));
      navigate("/projects");
    } catch (err: any) {
      if (!err?.data) {
        setErrMsg("No Server Response");
      } else if (err.data?.statusCode === 400) {
        setErrMsg("Missing email or password");
      } else if (err.data?.statusCode === 401) {
        setErrMsg("Incorrect username or password.");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "200px",
      }}
    >
      <FormContainer formContext={formContext} onSuccess={onSubmit}>
        <Typography variant="h3" mb={3}>
          Log in
        </Typography>
        <Grid container flexDirection={"column"}>
          <Grid item mb={3}>
            <Box display={"flex"} alignItems={"center"}>
              <FormLabel htmlFor={"email"} />
              <TextFieldElement
                fullWidth
                name={"email"}
                type={"email"}
                id={"email"}
                placeholder={"Enter your email ..."}
                validation={{
                  required: "This field is required",
                  pattern: {
                    value: regExp.email,
                    message: "Incorrectly entered email address",
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid item mb={3}>
            <Box display={"flex"} alignItems={"center"}>
              <FormLabel htmlFor={"password"} />
              <PasswordElement
                fullWidth
                name={"password"}
                type={"password"}
                id={"auth-password"}
                placeholder={"Enter you password"}
                validation={{
                  required: "This field is required",
                }}
              />
            </Box>
          </Grid>

          {errMsg && <Typography>{errMsg}</Typography>}
          <Box sx={{ justifyContent: "center", display: "flex", mt: 1 }}>
            <Button
              type={"submit"}
              variant="contained"
              sx={{ mr: 2, flexGrow: 1 }}
            >
              Log in
            </Button>
            <Button
              variant="outlined"
              component={NavLink}
              to="/signup"
              sx={{ flexGrow: 1 }}
            >
              Sign up
            </Button>
          </Box>
        </Grid>
      </FormContainer>
    </Container>
  );
};
