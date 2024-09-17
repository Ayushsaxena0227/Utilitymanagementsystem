import React, { useState, useEffect } from "react";
import "../styles/Billing.css";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
const Billing = () => {
  const [gasData, setGasData] = useState(null);
  const [electricityData, setElectricityData] = useState(null);
  const [waterData, setWaterData] = useState(null);
  const [totalAmount, setTotalAmount] = useState("10.00"); // Default value, replace as needed
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const token = localStorage.getItem("smartutilitytoken");
  const navigate = useNavigate();

  const handleItemSelection = (amount, id) => {
    setTotalAmount(amount);
    setSelectedItemId(id);
  };

  const fetchGasData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/gasData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setGasData(data);
    } catch (error) {
      console.error("Error fetching gas data:", error);
    }
  };
  // In Billing.jsx
  const handlePayment = async (orderID, id) => {
    const token = localStorage.getItem("smartutilitytoken");
    try {
      const response = await fetch(
        `http://localhost:5000/api/utilitydata/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paid: true, orderID }), // Include orderID if needed
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Payment status updated:", result);
      setModalMessage("Transaction is Successfull");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating payment status:", error);
      setModalMessage("Failed Try Again");
      setShowModal(true);
    }
  };

  const fetchElectricityData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/electricityData",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setElectricityData(data);
    } catch (error) {
      console.error("Error fetching electricity data:", error);
    }
  };

  const fetchWaterData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/waterData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWaterData(data);
    } catch (error) {
      console.error("Error fetching water data:", error);
    }
  };

  useEffect(() => {
    fetchGasData();
    fetchElectricityData();
    fetchWaterData();
  }, []);

  const formatDate = (date) => new Date(date).toLocaleDateString();
  const handleBack = () => {
    navigate(-1);
  };
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };
  return (
    <div>
      <h1>Billing Report</h1>
      <h2>Gas Data</h2>
      <table>
        <thead>
          <tr>
            <th>Utility Type</th>
            <th>Usage</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {gasData ? (
            gasData.map((item) => (
              <tr key={item._id}>
                <td>{item.utilityType}</td>
                <td>{item.usage}</td>
                <td>{formatDate(item.startDate)}</td>
                <td>{formatDate(item.endDate)}</td>
                <td>${item.totalCost}</td>
                <td className={item.ppaid ? "status-paid" : "status-not-paid"}>
                  {item.paid ? "Paid" : "Not Paid"}
                </td>
                <td>
                  {!item.paid && (
                    <button
                      onClick={() =>
                        handleItemSelection(item.totalCost, item._id)
                      }
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Electricity Data</h2>
      <table>
        <thead>
          <tr>
            <th>Utility Type</th>
            <th>Usage</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {electricityData ? (
            electricityData.map((item) => (
              <tr key={item._id}>
                <td>{item.utilityType}</td>
                <td>{item.usage}</td>
                <td>{formatDate(item.startDate)}</td>
                <td>{formatDate(item.endDate)}</td>
                <td>${item.totalCost}</td>
                <td className={item.paid ? "status-paid" : "status-not-paid"}>
                  {item.paid ? "Paid" : "Not Paid"}
                </td>
                <td>
                  {!item.paid && (
                    <button
                      onClick={() =>
                        handleItemSelection(item.totalCost, item._id)
                      }
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Water Data</h2>
      <table>
        <thead>
          <tr>
            <th>Utility Type</th>
            <th>Usage</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Cost</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {waterData ? (
            waterData.map((item) => (
              <tr key={item._id}>
                <td>{item.utilityType}</td>
                <td>{item.usage}</td>
                <td>{formatDate(item.startDate)}</td>
                <td>{formatDate(item.endDate)}</td>
                <td>${item.totalCost}</td>
                <td className={item.paid ? "status-paid" : "status-not-paid"}>
                  {item.paid ? "Paid" : "Not Paid"}
                </td>
                <td>
                  {!item.paid && (
                    <button
                      onClick={() =>
                        handleItemSelection(item.totalCost, item._id)
                      }
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedItemId && (
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: totalAmount,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            const details = await actions.order.capture();
            handlePayment(data.orderID, selectedItemId);
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
          }}
        />
      )}

      <button className="btn" onClick={() => handleBack()}>
        Back
      </button>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        message={modalMessage}
      />
    </div>
  );
};

export default Billing;
