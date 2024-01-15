import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Board } from "./pages/Board";
import { EmailVerification } from "./pages/EmailVerification";
import { Login } from "./pages/Login";
import { Projects } from "./pages/Projects";
import { Signup } from "./pages/Signup";
import { VerificationLoader } from "./pages/VerificationLoader";
import {
  isConfirmedEmailSelector,
  isLoggedInSelector,
} from "./store/features/authSlice";

const PrivateRoute = ({ children }: any) => {
  const location = useLocation();
  const isAuthenticated = useSelector(isLoggedInSelector);
  const isConfirmedEmail = useSelector(isConfirmedEmailSelector);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isConfirmedEmail && location.pathname != "/please-verify") {
    return <Navigate to="/please-verify" />;
  }

  if (
    isConfirmedEmail &&
    isAuthenticated &&
    location.pathname == "/please-verify"
  ) {
    return <Navigate to="/projects" />;
  }

  return children;
};

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerificationLoader />} />

        <Route
          path="/please-verify"
          element={
            <PrivateRoute>
              <EmailVerification />
            </PrivateRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/projects" />} />
        <Route path="/board">
          <Route
            path=":projectId"
            element={
              <PrivateRoute>
                <Board />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
