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
          Sign up
        </Typography>

        <Grid container flexDirection={"column"}>
          <Grid item mb={2}>
            <Box display={"flex"} alignItems={"center"}>
              <FormLabel htmlFor={"firstname"} />
              <TextFieldElement
                fullWidth
                name={"firstName"}
                id={"firstname"}
                placeholder="Enter your firstname ..."
                validation={{
                  required: true,
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
              placeholder={"Enter your last name ..."}
              validation={{
                required: true,
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
            placeholder={"Enter your email ..."}
            validation={{
              required: "This field is required",
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
            placeholder={"Enter you password"}
            validation={{
              required: "This field is required",
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
            placeholder={"Confirm your password..."}
            parseError={(error) => {
              if (error.type === "validate") {
                return "Passwords must match ";
              } else {
                return "This field is required";
              }
            }}
            validation={{
              required: true,
            }}
          />
        </Grid>
        <Box sx={{ justifyContent: "center", display: "flex", mt: 3 }}>
          <Button
            type={"submit"}
            variant="contained"
            sx={{ mr: 2, flexGrow: 1 }}
          >
            Sign up
          </Button>
          <Button
            variant="outlined"
            component={NavLink}
            to="/login"
            sx={{ flexGrow: 1 }}
          >
            Log in
          </Button>
        </Box>
      </FormContainer>
    </Container>
  );
};
