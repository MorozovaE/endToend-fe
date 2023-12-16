import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Board } from "./pages/Board";
import { Login } from "./pages/Login";
import { Projects } from "./pages/Projects";
import { Signup } from "./pages/Signup";
import { isLoggedInSelector } from "./store/features/authSlice";

const PrivateRoute = ({ children }: any) => {
  const isAuthenticated = useSelector(isLoggedInSelector);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
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
        <Route path=":projectId" element={
          <PrivateRoute>
            <Board />
          </PrivateRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
