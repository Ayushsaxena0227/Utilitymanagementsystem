import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/UtilityDetails.css";
import { format, parseISO } from "date-fns";
import { Chart, registerables } from "chart.js";
import Modal from "./Modal";

Chart.register(...registerables);
const UtilityDetails = () => {
  const { utilityType } = useParams();
  const [utilityData, setUtilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [summary, setSummary] = useState({ totalUsage: 0, totalCost: 0 });
  const navigate = useNavigate();
  // const history = useHistory();

  useEffect(() => {
    const fetchUtilityData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/${utilityType}Data`,
          {
            method: "GET",
            headers: {
              "x-auth-token": localStorage.getItem("smartutilitytoken"),
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        const parsedData = data.map((item) => {
          const parsedDate = new Date(item.date);
          return {
            ...item,
            date: !isNaN(parsedDate)
              ? parsedDate.toLocaleDateString()
              : "Invalid Date",
          };
        });
        setUtilityData(data);
        calculateSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUtilityData();
  }, [utilityType]);

  const calculateSummary = (data) => {
    const totalUsage = data.reduce((sum, item) => sum + item.usage, 0);
    const totalCost = data.reduce((sum, item) => sum + item.totalCost, 0);
    setSummary({ totalUsage, totalCost });
  };

  const handleDelete = async (id) => {
    try {
      console.log(`Deleting ID: ${id}`); // Log the ID being deleted

      const res = await fetch(
        `http://localhost:5000/api/utilityData/${id}`, // Updated URL structure
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json", // Optional for DELETE requests
            "x-auth-token": localStorage.getItem("smartutilitytoken"),
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "Failed to delete data");
      }

      const updatedData = utilityData.filter((data) => data._id !== id);
      setUtilityData(updatedData);
      calculateSummary(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendReport = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/sendReport`, // Corrected endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("smartutilitytoken"),
          },
          body: JSON.stringify({ utilityType, summary, utilityData }),
        }
      );

      console.log("Response status:", res.status); // Log response status

      if (!res.ok) {
        const error = await res.json();
        console.error("Error response:", error); // Log error response
        throw new Error("Failed to send report");
      }

      const responseData = await res.json();
      console.log("Response data:", responseData);
      setModalMessage("Successfully sent");
      setShowModal(true);
    } catch (err) {
      console.error("Error:", err); // Log catch error
      setModalMessage("Couldn't send");
      setShowModal(true);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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

  const customPlugin = {
    id: "custom-plugin",
    afterDatasetsDraw: (chart) => {
      const { ctx, chartArea, scales } = chart;

      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);

        meta.data.forEach((bar, index) => {
          const model = bar.tooltipPosition();

          ctx.save();

          // Draw a small delete button below each bar
          ctx.fillStyle = "red";
          ctx.font = "12px Arial";
          ctx.fillText("🗑️", model.x - 6, model.y + 20);

          // Set an area for detecting clicks on the delete button
          const deleteButtonArea = {
            x1: model.x - 10,
            y1: model.y + 10,
            x2: model.x + 10,
            y2: model.y + 30,
          };

          // Detect click event
          chart.canvas.addEventListener("click", (event) => {
            const rect = chart.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (
              x >= deleteButtonArea.x1 &&
              x <= deleteButtonArea.x2 &&
              y >= deleteButtonArea.y1 &&
              y <= deleteButtonArea.y2
            ) {
              handleDelete(utilityData[index]._id);
            }
          });

          ctx.restore();
        });
      });
    },
  };

  const options = {
    plugins: [customPlugin],
    maintainAspectRatio: false,
  };
  // PDF download function

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(0, 0, 128); // Dark blue background
    doc.rect(0, 0, doc.internal.pageSize.width, 20, "F");
    doc.text("Utility Report", 10, 15);

    // Logo or Image
    const imgData = "data:image/jpeg;base64,..."; // Your Base64 image data
    doc.addImage(imgData, "JPEG", 150, 5, 40, 10); // Adjust position and size as needed

    // Table of Data
    const columns = ["Date", "Usage"];
    const rows = utilityData.map((data) => [
      new Date(data.date).toLocaleDateString(),
      data.usage.toString(),
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      theme: "grid", // Add table borders
      headStyles: {
        fillColor: [0, 102, 204], // Blue header background
        textColor: 255, // White text
        fontSize: 12,
      },
      styles: {
        fontSize: 10,
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { fillColor: [240, 240, 240] }, // Gray background for the date column
      },
    });

    // Footer with Page Numbers
    const totalPagesExp = "{total_pages_count_string}";
    const addFooters = () => {
      let pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${totalPagesExp}`,
          doc.internal.pageSize.width - 20,
          pageHeight - 10
        );
      }
    };

    addFooters();

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }

    // Save PDF
    doc.save(`${utilityType}_report.pdf`);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>
        {utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} Usage
        Details
      </h1>

      <button
        className="btn"
        onClick={handleSendReport}
        style={{ float: "right" }}
      >
        Send Report to Mail
      </button>

      <div style={{ width: "100%", height: "400px" }}>
        <Bar data={formatDataForBarChart(utilityData)} options={chartOptions} />
      </div>

      <div style={{ width: "100%", height: "400px" }}>
        <Pie data={formatDataForPieChart(utilityData)} options={chartOptions} />
      </div>

      {/* Table Display with Delete Buttons */}
      <div>
        <h2>
          {utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} Data
        </h2>
        <div className="summary-container">
          <h3>Summary</h3>
          <p>Total Usage: {summary.totalUsage}</p>
          <p>Total Cost: ${summary.totalCost.toFixed(2)}</p>
        </div>
        <div className="utility-table-container">
          <table className="utility-table">
            <thead>
              <tr>
                <th className="black">Date</th>
                <th className="black">Usage</th>
                <th className="black">Action</th>
              </tr>
            </thead>
            <tbody>
              {utilityData.map((data) => (
                <tr key={data._id}>
                  <td className="black">
                    {new Date(data.date).toLocaleDateString()}
                  </td>
                  <td className="black">{data.usage}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(data._id)}
                      className="delete-button"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button className="btn" onClick={handleDownloadPDF}>
        Download PDF
      </button>
      <button onClick={handleBack} className="back-button">
        Back to Dashboard
      </button>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        message={modalMessage}
      />
    </div>
  );
};

export default UtilityDetails;
