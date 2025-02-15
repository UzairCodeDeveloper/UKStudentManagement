import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./Redux/store.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
// Import the Redux store

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <ToastContainer/>
      </PersistGate>
    </Provider>
  </StrictMode>
);
