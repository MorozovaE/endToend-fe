import { ThemeProvider } from "@mui/material/styles";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Loader } from "./components/Loader/Loader";
import "./i18n";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store/store";
import { theme } from "./styles/theme/lightTheme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Suspense fallback={<Loader></Loader>}>
            <App />
          </Suspense>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  // </React.StrictMode>
);

reportWebVitals();
