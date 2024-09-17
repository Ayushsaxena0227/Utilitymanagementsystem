// src/pages/HomePage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import ThemeToggleButton from "../components/ThemeToggleButton";
const HomePage = () => {
  const Navigate = useNavigate();
  const goToAboutPage = () => {
    Navigate("/about");
  };
  return (
    <div className="home-container">
      <header className="home-header">
        {/* <ThemeToggleButton /> */}
        <h1 className="home-title">Smart Utility Management System</h1>
        <p className="home-subtitle">
          Efficiently track and manage your utility consumption.
        </p>
      </header>

      <section className="features">
        <div className="feature-item">
          <img
            src="/images/water-tap.png"
            alt="Water Management"
            className="feature-image"
          />
          <h2>Water Management</h2>
          <p>
            Monitor your water usage, identify patterns, and save on your water
            bill.
          </p>
        </div>
        <div className="feature-item">
          <img
            src="/images/gas-pipeline.png"
            alt="Gas Management"
            className="feature-image"
          />
          <h2>Gas Management</h2>
          <p>
            Keep track of your gas consumption and ensure safety and efficiency.
          </p>
        </div>
        <div className="feature-item">
          <img
            src="/images/power.png"
            alt="Electricity Management"
            className="feature-image"
          />
          <h2>Electricity Management</h2>
          <p>Analyze your electricity usage and optimize for energy savings.</p>
        </div>
      </section>
      <button onClick={goToAboutPage} className="about-button">
        Learn More About Our Features &rarr;
      </button>
      <section className="cta-section">
        <h2>Get Started Today</h2>
        <p>Join us and take control of your utility usage.</p>
        <Link to="/register" className="cta-button">
          Sign Up Now
        </Link>
        <Link to="/login" className="cta-button">
          Login
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
