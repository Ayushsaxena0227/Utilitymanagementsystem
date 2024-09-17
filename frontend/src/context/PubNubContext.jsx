import React, { createContext, useState, useEffect, useContext } from "react";
import PubNub from "pubnub";
import { AuthContext } from "./AuthContext";

export const PubNubContext = createContext();

export const PubNubProvider = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [pubnub, setPubnub] = useState(null);

  useEffect(() => {
    if (!loading) {
      console.log("User object in PubNubProvider:", user);

      if (user && user._id) {
        const pubnubClient = new PubNub({
          publishKey: "pub-c-8f37cfad-919e-4519-9260-cb77907b1bf4",
          subscribeKey: "sub-c-81dc4665-6f4f-4788-bc47-18119277bf07",
          userId: user._id,
        });
        console.log("PubNub client created:", pubnubClient);
        setPubnub(pubnubClient);
      } else {
        console.log("No user or user ID, setting pubnub to null");
        setPubnub(null);
      }
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  return (
    <PubNubContext.Provider value={{ pubnub }}>
      {children}
    </PubNubContext.Provider>
  );
};
