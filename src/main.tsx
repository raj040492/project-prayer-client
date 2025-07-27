import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import Login from "./Cognito.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import TimeRestrictedVideo from "./TimeRestrictedVideo.tsx";
import Home from "./Home.tsx";

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_l7jvp7aEZ",
  client_id: "1stgpdrmh74n2empv5il3gvcbt",
  redirect_uri: "http://localhost:5173/login",
  response_type: "code",
  scope: "phone openid email",
};

const root = createRoot(document.getElementById("root")!);

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/video"
            element={
              <ProtectedRoute>
                <TimeRestrictedVideo />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
