import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import routes from "./routes/Routes.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-center" reverseOrder={false} />
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>
);
