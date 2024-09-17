import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const [usageData, setUsageData] = useState([]);
  const [notification, setNotification] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");

      newSocket.on("usageAlert", (data) => {
        console.log(`Received usageAlert: ${data.message}`);
        setNotification(data.message);
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error", error);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error", error);
    });

    return () => {
      newSocket.disconnect();
      console.log("Socket connection closed on cleanup");
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ usageData, notification, socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// export default WebSocketProvider;
