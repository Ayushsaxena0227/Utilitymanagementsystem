import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import Modal from "../components/Modal";
import GoogleLoginButton from "../components/GoogleLoginButton";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const resData = await response.json();
        setModalMessage("Registration successful! Please log in.");
        setIsModalOpen(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorData = await response.json();
        console.error(errorData);
        setModalMessage("An error occurred. Please try again.");
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };
  const closeModal = () => setIsModalOpen(false);

  const handleGoogleSuccess = async (user) => {
    const response = await fetch("http://localhost:5000/api/google-signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: user.credential }),
    });

    if (response.ok) {
      const userData = await response.json();
      localStorage.setItem("smartutilitytoken", userData.token);
      setModalMessage("Registration successful! Redirecting to dashboard...");
      setIsModalOpen(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } else {
      const errorData = await response.json();
      console.error(errorData);
      setModalMessage("An error occurred. Please try again.");
      setIsModalOpen(true);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Sign-In failed", error);
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
        />
        <button type="submit">Register</button>
      </form>
      <hr />
      <GoogleLoginButton
        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleFailure}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
}

export default Register;
