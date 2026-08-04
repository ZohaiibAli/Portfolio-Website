import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { quality } from "./lib/useQuality";
import "./index.css";

// Resolve the device tier before React mounts, so `data-quality` is on <html>
// for the first paint and no panel ever renders with glass it can't afford.
quality();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
