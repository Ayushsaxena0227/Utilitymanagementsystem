import React, { useEffect } from "react";

const GoogleLoginButton = () => {
  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (window.gapi && window.gapi.auth2) {
        window.gapi.load("auth2", () => {
          const auth2 = window.gapi.auth2.init({
            client_id:
              "98041991381-4qbvh7f3mnj8kcchnn5cfono3l2o1rhq.apps.googleusercontent.com",
          });

          auth2.attachClickHandler(
            document.getElementById("google-signin-button"),
            {},
            (googleUser) => {
              // Handle successful sign-in
              console.log(
                "Signed in as:",
                googleUser.getBasicProfile().getName()
              );
            },
            (error) => {
              // Handle sign-in error
              console.error("Sign-in error:", error);
            }
          );
        });
      } else {
        console.error("Google API not loaded");
      }
    };

    loadGoogleScript();
  }, []);

  return <button id="google-signin-button">Sign in with Google</button>;
};

export default GoogleLoginButton;
