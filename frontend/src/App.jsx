import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PubNubProvider } from "./context/PubNubContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PriavteRoute";
import HomePage from "./pages/Homepage";
import UtilityDetails from "./components/UtilityDetails";
import Billing from "./components/Billing";
import AddBilling from "./components/AddBilling";
import About from "./pages/About";
import ThemeToggleButton from "./components/ThemeToggleButton";

const App = () => {
  return (
    <AuthProvider>
        <div>
          <ThemeToggleButton />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute component={Dashboard} />}
            />
            <Route
              path="/utility-details/:utilityType"
              element={<PrivateRoute component={UtilityDetails} />}
            />
            <Route
              path="/billing"
              element={<PrivateRoute component={Billing} />}
            />
            <Route
              path="/add-billing"
              element={<PrivateRoute component={AddBilling} />}
            />
          </Routes>
        </div>
    </AuthProvider>
  );
};

export default App;
