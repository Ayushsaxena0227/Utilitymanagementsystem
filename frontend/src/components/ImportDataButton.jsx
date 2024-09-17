// import React from "react";
// const ImportDataButton = () => {
//   const handleImportData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         "http://localhost:5000/api/utilityData/import",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "x-auth-token": token,
//           },
//           body: null, // You can omit this if there's no body to send
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("Data imported successfully:", data);
//       // Optionally, you can update the UI or fetch the latest data here
//     } catch (error) {
//       console.error("Error importing data:", error.message);
//     }
//   };

//   return (
//     <button onClick={handleImportData}>Import Data from External API</button>
//   );
// };

// export default ImportDataButton;
