import React, { useEffect } from "react";
import "../styles/GoggleButton.css";
import { jwtDecode } from "jwt-decode"; // Change to default import
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID =
    "98041991381-4qbvh7f3mnj8kcchnn5cfono3l2o1rhq.apps.googleusercontent.com"; // Replace with your actual client ID

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large" } // customization options
      );
      window.google.accounts.id.prompt(); // optional
    };

    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      console.error("Google Identity Services script not loaded.");
    }
  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // decode and handle the token as needed
    const userObject = jwtDecode(response.credential); // Use the default import jwtDecode
    console.log(userObject);
    navigate("/dashboard");
  };

  return (
    <div>
      <div id="googleSignInButton" className="button"></div>
    </div>
  );
};

export default GoogleLoginButton;
