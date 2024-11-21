import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import App from "./App.tsx";
import { DialogProvider } from "./context/DialogContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DialogProvider>
      <Toaster />
      <App />
    </DialogProvider>
  </StrictMode>,
);
