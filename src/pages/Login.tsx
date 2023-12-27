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
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthHeader } from "../components/AuthHeader/AuthHeader";
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
  const { t } = useTranslation("authPage");

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
    localStorage.setItem("userEmail", data.email);

    try {
      const userData = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (userData) {
        dispatch(setCredentials({ token: userData.token }));
        navigate("/projects");
      }
      
    } catch (err: any) {
      console.log(err);
      
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
      <AuthHeader />
      <FormContainer formContext={formContext} onSuccess={onSubmit}>
        <Typography variant="h3" mb={3}>
          {t("headerLogin")}
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
                placeholder={t("emailPlaceholder")}
                validation={{
                  required: t("required"),
                  pattern: {
                    value: regExp.email,
                    message: `${t("incorrectInputEmail")}`,
                  },
                }}
                parseError={(error) => {
                  if (error.type === "required") {
                    return t("required");
                  } else {
                    return t("incorrectInputEmail");
                  }
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
                placeholder={t("passwordPlaceholder")}
                validation={{
                  required: t("required"),
                }}
                parseError={(error) => {
                  if (error.type === "required") {
                    return t("required");
                  }
                }}
              />
            </Box>
          </Grid>

          {errMsg && <Typography>{errMsg}</Typography>}
          <Box sx={{ justifyContent: "center", display: "flex", mt: 1 }}>
            <Button
              variant="outlined"
              component={NavLink}
              to="/signup"
              sx={{ mr: 2, flexGrow: 1 }}
            >
              {t("signup")}
            </Button>
            <Button type={"submit"} variant="contained" sx={{ flexGrow: 1 }}>
              {t("login")}
            </Button>
          </Box>
        </Grid>
      </FormContainer>
    </Container>
  );
};
