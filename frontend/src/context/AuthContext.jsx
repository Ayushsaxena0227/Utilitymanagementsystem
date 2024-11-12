import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setUser(userInfo);
        } else {
          if (res.status !== 401) {
            console.error("Failed to fetch user info:", res.statusText);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
