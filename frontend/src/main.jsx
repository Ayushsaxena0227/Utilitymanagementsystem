import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import "../src/i18n";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ThemeProvider } from "./context/Themecontext.jsx";
import { PubNubProvider } from "./context/PubNubContext.jsx";
import "./index.css";
import "./app.css";

const initialOptions = {
  "client-id":
    "Ae4uimRv_Vuo_SnZHo6KktkUz9Z3Px3PQLB9_ksbHTR9SGsSKM4ps-z5mw0dbLYUqBPra7vMOJDj--IK",
  currency: "USD",
  intent: "capture",
};

const Main = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <PayPalScriptProvider options={initialOptions}>
            <AuthProvider>
              <PubNubProvider>
                <App />
              </PubNubProvider>
            </AuthProvider>
          </PayPalScriptProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<Main />);
