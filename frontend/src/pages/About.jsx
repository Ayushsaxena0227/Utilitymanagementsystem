import React from "react";
import "../styles/About.css";
import { useNavigate } from "react-router-dom";
const About = () => {
  const Navigate = useNavigate();
  const handleback = () => {
    Navigate(-1);
  };
  return (
    <div className="about-container">
      <h1 className="about-title">About Smart Utility Management System</h1>
      <section className="feature-section">
        <h2 className="feature-title">Features</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3 className="feature-heading">Real-Time Monitoring</h3>
            <p className="feature-description">
              Track your utility consumption in real-time. Our system provides
              up-to-date information about your energy, water, and gas usage,
              helping you make informed decisions.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-heading">Automated Alerts</h3>
            <p className="feature-description">
              Receive automated alerts for unusual consumption patterns,
              maintenance schedules, and energy-saving tips to optimize your
              utility usage.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-heading">Detailed Analytics</h3>
            <p className="feature-description">
              Analyze your utility data with detailed charts and graphs.
              Understand your usage patterns and identify opportunities for cost
              savings.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-heading">User-Friendly Dashboard</h3>
            <p className="feature-description">
              Manage all your utility data from a single, intuitive dashboard.
              Customize your view and access important information quickly.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-heading">Secure Data Management</h3>
            <p className="feature-description">
              Your data is securely stored and managed with top-notch
              encryption, ensuring that your personal information is always
              protected.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-heading">Download PDF Reports</h3>
            <p className="feature-description">
              Easily download detailed PDF reports of your utility consumption.
              This feature allows you to review and share your usage data in a
              convenient format.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-heading">Billing Selection</h3>
            <p className="feature-description">
              Navigate to the billing selection section to manage your payment
              options and view your billing history. This feature ensures a
              seamless billing experience.
            </p>
          </div>
          <div className="feature-item">
            <h3 className="feature-heading">Multilanguage Support</h3>
            <p className="feature-description">
              Our system supports multiple languages to cater to users from
              different regions. Easily switch languages to use the system in
              your preferred language.
            </p>
          </div>
        </div>
      </section>
      <section className="usage-section">
        <h2 className="usage-title">How to Use</h2>
        <p className="usage-description">
          To get started with the Smart Utility Management System, follow these
          steps:
        </p>
        <ol className="usage-steps">
          <li>Sign up or log in to your account.</li>
          <li>Connect your utility meters to our system.</li>
          <li>Explore the dashboard and configure your preferences.</li>
          <li>Monitor your utility usage and receive alerts.</li>
          <li>Analyze your data and optimize your usage.</li>
          <li>
            Download PDF reports, navigate to billing, and switch languages as
            needed.
          </li>
        </ol>
      </section>
      <button className="btn" onClick={() => handleback()}>
        back
      </button>
    </div>
  );
};

export default About;
