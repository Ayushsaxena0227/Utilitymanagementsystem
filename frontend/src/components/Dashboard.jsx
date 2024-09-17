import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { format, parseISO } from "date-fns"; // Import date-fns for date formatting
import LanguageSwitcher from "./LanguageSwitcher";
import Modal from "./Modal";
import { usePubNub } from "pubnub-react";
import PubNub from "pubnub";
function Dashboard() {
  const [waterData, setWaterData] = useState([]);
  const [gasData, setGasData] = useState([]);
  const [electricityData, setElectricityData] = useState([]);

  useEffect(() => {
    // Fetch water data
    fetch("/api/waterData")
      .then((res) => res.json())
      .then((data) => setWaterData(data));

    // Fetch gas data
    fetch("/api/gasData")
      .then((res) => res.json())
      .then((data) => setGasData(data));

    // Fetch electricity data
    fetch("/api/electricityData")
      .then((res) => res.json())
      .then((data) => setElectricityData(data));
  }, []);

  const [utilityData, setUtilityData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUtility, setSelectedUtility] = useState("water");
  const [fullUtilityData, setFullUtilityData] = useState([]);
  const [message, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [costPerUnit, setCostPerUnit] = useState(0);
  const { t } = useTranslation();
  const [usageInput, setUsageInput] = useState({
    startDate: "",
    endDate: "",
    usage: "",
    costPerUnit: "",
  });
  // console.log(user);
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const pubnub = usePubNub();
  const [isPubNubReady, setIsPubNubReady] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (!loading && pubnub && user && user._id) {
      setIsPubNubReady(true);
      const channel = `notifications-${user._id}`;
      console.log(`Subscribing to channel: ${channel}`);

      pubnub.subscribe({ channels: [channel] });

      const listener = {
        message: (event) => {
          console.log("Message event received:", event);
          const { message } = event;
          let notificationMessage = "";

          if (message.highUsage) {
            notificationMessage = "You have high utility usage!";
          }
          if (message.unpaidBills) {
            notificationMessage = "You have unpaid bills!";
          }

          if (notificationMessage) {
            setNotification(notificationMessage);
          }
        },
      };

      pubnub.addListener(listener);

      return () => {
        pubnub.removeListener(listener);
        pubnub.unsubscribe({ channels: [channel] });
      };
    }
  }, [user, pubnub, loading]);

  useEffect(() => {
    if (notification) {
      console.log("Displaying notification:", notification);
    }
  }, [notification]);

  useEffect(() => {
    fetchUtilityData(selectedUtility, 1);
  }, [selectedUtility]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pubnub) {
    return <div>Please log in to use the chat features.</div>;
  }

  if (!isPubNubReady) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (notification) {
      console.log("Displaying notification:", notification);
    }
  }, [notification]);

  useEffect(() => {
    fetchUtilityData(selectedUtility, 1);
  }, [selectedUtility]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pubnub) {
    return <div>Please log in to use the chat features.</div>;
  }

  if (!isPubNubReady) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNotification("Reminder: Check your billing details!");
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchUtilityData = async (utilityType, limit = 5) => {
    setLoading(true);
    setError(null);
    try {
      // Determine the endpoint based on whether we're fetching limited data or not
      const endpoint =
        limit === 1 // Fetch the most recent data (e.g., for initial load)
          ? `http://localhost:5000/api/${utilityType}Data/limited?limit=${limit}`
          : `http://localhost:5000/api/${utilityType}Data?limit=1`;

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "x-auth-token": localStorage.getItem("smartutilitytoken"),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUtilityData(data);
        if (limit < 1) {
          setFullUtilityData(data); // Save full data if fetching all data
        }
      } else {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUsageInput({ ...usageInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { startDate, endDate, usage, costPerUnit } = usageInput;
    const totalCost = usage * costPerUnit;

    if (!startDate || !endDate || !usage || !costPerUnit) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/${selectedUtility}Data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("smartutilitytoken"),
          },
          body: JSON.stringify({
            startDate,
            endDate,
            usage,
            costPerUnit,
            totalCost,
          }),
        }
      );

      if (res.ok) {
        fetchUtilityData(selectedUtility, 1); // Refresh the data with the most recent entry
        setUsageInput({
          startDate: "",
          endDate: "",
          usage: "",
          costPerUnit: "",
        });
        setModalMessage("Successfully Filled, Now check Recent usages!");
        setIsModalOpen(true);
      } else {
        setModalMessage("Cannot submit your Utility!");
        setIsModalOpen(false);
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFetchRecentUsage = () => {
    fetchUtilityData(selectedUtility, 5, false); // Fetch the last 5 usage details
  };

  const handleUtilitySelection = (utilityType) => {
    setSelectedUtility(utilityType);
    fetchUtilityData(utilityType, 1); // Fetch only the most recent data by default
  };

  const formatDataForBarChart = (data) => {
    const usageValues = data.map((item) => item.usage);
    const labels = data.map(
      (item) => format(parseISO(item.startDate), "dd-MM-yyyy") // Format dates as dd-MM-yyyy
    );
    return {
      labels: labels,
      datasets: [
        {
          label: "Usage (units)",
          data: usageValues,
          backgroundColor: "rgba(54, 162, 235, 0.6)", // Light Blue
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
        },
      ],
    };
  };

  const formatDataForPieChart = (data) => {
    const usageValues = data.map((item) => item.usage);
    const labels = data.map(
      (item) => format(parseISO(item.startDate), "dd-MM-yyyy") // Format dates as dd-MM-yyyy
    );
    return {
      labels: labels,
      datasets: [
        {
          data: usageValues,
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)",
            "rgba(75, 192, 192, 0.6)", // Teal
            "rgba(255, 205, 86, 0.6)", // Pink
            "rgba(255, 159, 64, 0.6)", // Orange
            "rgba(153, 102, 255, 0.6)", // Purple
            "rgba(255, 205, 86, 0.6)", // Yellow
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 205, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        responsive: true,
        maintainAspectRatio: false,
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.7)", // Tooltip background color
        titleColor: "#fff", // Tooltip title color
        bodyColor: "#fff", // Tooltip body color
        borderColor: "#333", // Tooltip border color
        borderWidth: 1, // Tooltip border width
        callbacks: {
          label: function (tooltipItem) {
            return `Usage: ${tooltipItem.raw} units`; // Custom label
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90, // Rotate labels if too long
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("smartutilitytoken");
    navigate("/");
  };

  const handleViewDetails = () => {
    navigate(`/utility-details/${selectedUtility}`);
  };

  const handleGoToBilling = () => {
    navigate("/billing", { state: { waterData, gasData, electricityData } });
  };
  const closeModal = () => setIsModalOpen(false);
  const handleTestNotification = () => {
    if (user && user._id) {
      const pubnub = new PubNub({
        publishKey: "pub-c-8f37cfad-919e-4519-9260-cb77907b1bf4",
        subscribeKey: "sub-c-81dc4665-6f4f-4788-bc47-18119277bf07",
        uuid: user._id,
      });

      pubnub.publish(
        {
          channel: `notifications-${user._id}`,
          message: { highUsage: true, unpaidBills: false },
        },
        (status, response) => {
          if (status.error) {
            console.log("Publish error:", status);
          } else {
            console.log("Publish successful:", response);
          }
        }
      );
    }
  };
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <LanguageSwitcher />
        <h1>{t("dashboard.title")}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          {t("dashboard.logout")}
        </button>
        <button onClick={handleTestNotification} className="logout-btn">
          Send Test Notification
        </button>
        <button className="billing-button" onClick={handleGoToBilling}>
          Go to Billing
        </button>
      </div>

      <div className="user-details">
        {user ? (
          <p>
            {t("dashboard.welcome")} {user.name}!
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {notification && (
        <div className="notification-popup">
          <p>{notification}</p>
          {/* <button onClick={() => setNotification(null)}>
            {t("notifications.dismiss")}
          </button> */}
        </div>
      )}

      <div className="utility-buttons">
        <button
          className={`utility-btn ${
            selectedUtility === "water" ? "active" : ""
          }`}
          onClick={() => handleUtilitySelection("water")}
        >
          {t("buttons.water")}
        </button>
        <button
          className={`utility-btn ${selectedUtility === "gas" ? "active" : ""}`}
          onClick={() => handleUtilitySelection("gas")}
        >
          {t("buttons.gas")}
        </button>
        <button
          className={`utility-btn ${
            selectedUtility === "electricity" ? "active" : ""
          }`}
          onClick={() => handleUtilitySelection("electricity")}
        >
          {t("buttons.electricity")}
        </button>
      </div>

      <form className="utility-form" onSubmit={handleSubmit}>
        <h3>{t("form.enterUsageData", { utility: selectedUtility })}</h3>
        <label>
          {t("form.startDate")}
          <input
            type="date"
            name="startDate"
            value={usageInput.startDate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          {t("form.endDate")}
          <input
            type="date"
            name="endDate"
            value={usageInput.endDate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          {t("form.usage")}
          <input
            type="number"
            name="usage"
            value={usageInput.usage}
            onChange={handleInputChange}
          />
        </label>
        <label>
          {t("form.costPerUnit")}
          <input
            type="number"
            name="costPerUnit"
            value={usageInput.costPerUnit}
            onChange={handleInputChange}
          />
        </label>
        <p>
          {t("form.totalCost")} {usageInput.usage * usageInput.costPerUnit}
        </p>
        <button type="submit" className="submit-btn">
          {t("form.submit")}
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={setModalMessage}
      />

      <button className="fetch-recent-btn" onClick={handleFetchRecentUsage}>
        Fetch Last usage{" "}
        {selectedUtility.charAt(0).toUpperCase() + selectedUtility.slice(1)}{" "}
        Usages
      </button>
      {loading && <p>{t("common.loading")}</p>}
      {error && <p style={{ color: "red" }}>{t("common.error")}</p>}

      <div className="chart-container">
        <h3>
          {selectedUtility.charAt(0).toUpperCase() + selectedUtility.slice(1)}{" "}
          {t("dashboard.usageChart")}
        </h3>
        {utilityData.length > 0 || fullUtilityData.length > 0 ? (
          <>
            <div className="chart">
              <Bar
                data={
                  fullUtilityData.length > 0
                    ? formatDataForBarChart(fullUtilityData)
                    : formatDataForBarChart(utilityData)
                }
                options={chartOptions}
              />
            </div>
            <div className="chart">
              <Pie
                data={
                  fullUtilityData.length > 0
                    ? formatDataForPieChart(fullUtilityData)
                    : formatDataForPieChart(utilityData)
                }
                options={chartOptions}
              />
            </div>
          </>
        ) : (
          <p>{t("common.noDataAvailable")}</p>
        )}
      </div>

      <button className="view-details-btn" onClick={handleViewDetails}>
        {t("dashboard.viewDetails")}
      </button>
    </div>
  );
}

export default Dashboard;
