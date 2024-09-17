import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/userinfo", {
          headers: {
            "x-auth-token": localStorage.getItem("smartutilitytoken"),
          },
        });
        if (res.ok) {
          const userInfo = await res.json();
          console.log("Fetched user info:", userInfo);
          setUser(userInfo);
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
