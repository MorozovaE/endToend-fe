import {
  Box,
  Button,
  Container,
  FormLabel,
  Grid,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FormContainer,
  PasswordElement,
  PasswordRepeatElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
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

      dispatch(setCredentials({ token: userData.token }));
      navigate("/projects");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "170px",
      }}
    >
      <FormContainer formContext={formContext} onSuccess={onSubmit}>
        <Typography variant="h3" mb={3}>
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
                  required: `${t("requeired")}`,
                  maxLength: 30,
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
                required: `${t("requeired")}`,
                maxLength: 30,
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
              required: `${t("requeired")}`,
              pattern: {
                value: regExp.email,
                message: "Incorrectly entered email address",
              },
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
              required: `${t("requeired")}`,
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
              if (error.type === "validate") {
                return "Passwords must match ";
              } else {
                return t("requeired");
              }
            }}
            validation={{
              required: `${t("requeired")}`,
            }}
          />
        </Grid>
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
