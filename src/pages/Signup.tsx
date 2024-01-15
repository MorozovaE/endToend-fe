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
  PasswordRepeatElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthHeader } from "../components/AuthHeader/AuthHeader";
import { regExp } from "../shared/regExp";
import { useSignupMutation } from "../store/features/authApiSlice";
import { setCredentials } from "../store/features/authSlice";
import { useAppDispatch } from "../store/store";

export interface ISignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Signup = () => {
  const { t } = useTranslation("authPage");
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [signup] = useSignupMutation();

  const formContext = useForm<ISignupData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    shouldUseNativeValidation: false,
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ISignupData> = async (data) => {
    localStorage.setItem("userEmail", data.email);

    try {
      const userData = await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      dispatch(
        setCredentials({
          token: userData.token,
          isEmailConfirmed: userData.isEmailConfirmed,
        })
      );
      navigate("/please-verify");

    } catch (err: any) {
      console.log(err);

      if (!err?.data) {
        setErrMsg("No Server Response");
      } else if (err.data?.statusCode === 400) {
        setErrMsg("Missing email or password");
      } else if (err.data.message === "User with this email exist.") {
        setErrMsg("User with this email already exists");
      } else if (err.data?.statusCode === 401) {
        setErrMsg("Incorrect username or password.");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <AuthHeader />
      <FormContainer formContext={formContext} onSuccess={onSubmit}>
        <Typography variant="h1" mb={3} fontSize={"2rem"}>
          {t("headerSignup")}
        </Typography>

        <Grid container flexDirection={"column"}>
          <Grid item mb={2}>
            <Box display={"flex"} alignItems={"center"}>
              <FormLabel htmlFor={"firstname"} />
              <TextFieldElement
                fullWidth
                name={"firstName"}
                id={"firstname"}
                placeholder={t("firstNamePlaceholder")}
                validation={{
                  required: true,
                  maxLength: 30,
                }}
                parseError={(error) => {
                  if (error.type === "required") {
                    return t("required");
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid item mb={2}>
          <Box display={"flex"} alignItems={"center"}>
            <FormLabel htmlFor={"lastname"} />
            <TextFieldElement
              fullWidth
              name={"lastName"}
              id={"lastName"}
              placeholder={t("lastNamePlaceholder")}
              validation={{
                required: true,
                maxLength: 30,
              }}
              parseError={(error) => {
                if (error.type === "required") {
                  return t("required");
                }
              }}
            />
          </Box>
        </Grid>

        <Grid item mb={2}>
          <FormLabel htmlFor={"email"} />
          <TextFieldElement
            fullWidth
            name={"email"}
            id={"email"}
            placeholder={t("emailPlaceholder")}
            validation={{
              required: true,
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
        </Grid>

        <Grid item mb={2}>
          <FormLabel htmlFor={"auth-password"} />
          <PasswordElement
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                background: "rgba(255, 255, 255, 0.47)",
              },
            }}
            name={"password"}
            type={"password"}
            id={"auth-password"}
            placeholder={t("passwordPlaceholder")}
            validation={{
              required: true,
            }}
            parseError={(error) => {
              if (error.type === "required") {
                return t("required");
              }
            }}
          />
        </Grid>

        <Grid item mb={2}>
          <FormLabel htmlFor={"confirmPassword"} />
          <PasswordRepeatElement
            fullWidth
            sx={{
              "& .MuiInputBase-root": {
                background: "rgba(255, 255, 255, 0.47)",
              },
            }}
            passwordFieldName={"password"}
            name={"confirmPassword"}
            type={"password"}
            id={"confirmPassword"}
            placeholder={t("confirmPasswordPlaceholder")}
            parseError={(error) => {
              if (error.type === "required") {
                return t("required");
              } else if (error.type === "validate") {
                return t("passwordMismatch");
              }
            }}
            validation={{
              required: true,
            }}
          />
        </Grid>
        <Box>{errMsg}</Box>
        <Box sx={{ justifyContent: "center", display: "flex", mt: 3 }}>
          <Button
            variant="outlined"
            component={NavLink}
            to="/login"
            sx={{ mr: 2, flexGrow: 1 }}
          >
            {t("login")}
          </Button>
          <Button type={"submit"} variant="contained" sx={{ flexGrow: 1 }}>
            {t("signup")}
          </Button>
        </Box>
      </FormContainer>
    </Container>
  );
};
