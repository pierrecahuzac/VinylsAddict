// import { StrictMode } from 'react'
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";

import { UserProvider } from "./contexts/userContext.tsx";
import { ThemeProvider } from "./contexts/themeContext.tsx";

import "./styles/index.css";


registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <UserProvider>
        <App  />
      </UserProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
