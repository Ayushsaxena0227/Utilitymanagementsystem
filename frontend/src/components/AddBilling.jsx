import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBilling = () => {
  const [dueDate, setDueDate] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("smartutilitytoken"),
        },
        body: JSON.stringify({ dueDate, amount }),
      });

      if (!res.ok) {
        throw new Error("Failed to add billing data");
      }

      const data = await res.json();
      setSuccess("Billing data added successfully!");
      setDueDate("");
      setAmount("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-billing-container">
      <h1>Add Billing Data</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Billing Data</button>
      </form>
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Billing Summary
      </button>
    </div>
  );
};

export default AddBilling;
