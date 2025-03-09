import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Make sure Tailwind is set up here
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store.js";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./features/api/authApi.js";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

const Custom = ({ children }) => {
  // Pre-load user data if needed
  const { isLoading } = useLoadUserQuery();
  return isLoading ? <LoadingSpinner /> : children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
        <Toaster />
      </Custom>
    </Provider>
  </StrictMode>
);
