import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Modal from "../components/Modal";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const resData = await response.json();
        console.log("res: ", resData);
        localStorage.setItem("smartutilitytoken", resData.token);
        setModalMessage("Login successful!");
        setIsModalOpen(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        const errorData = await response.json();
        setModalMessage("An error occurred. Please try again.");
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const loginwithgoogle = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };
  const closeModal = () => setIsModalOpen(false);

  const handleGuestLogin = async () => {
    const guestCredentials = {
      email: "guest@example.com",
      password: "guest123",
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestCredentials),
      });

      if (response.ok) {
        const resData = await response.json();
        localStorage.setItem("smartutilitytoken", resData.token);
        setModalMessage("Guest login successful!");
        setIsModalOpen(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        const errorData = await response.json();
        setModalMessage(
          "An error occurred during guest login. Please try again."
        );
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error during guest login:", err);
    }
  };

  const autofillGuestDetails = () => {
    setFormData({
      email: "guest@example.com",
      password: "guest123",
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
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
        <button type="submit" className="btn-login">
          Login
        </button>
        <div className="g-signin2" data-onsuccess="onSignIn"></div>
      </form>
      <button onClick={handleGuestLogin} className="btn-login">
        Guest Login
      </button>
      <button onClick={autofillGuestDetails} className="btn-autofill btn-login">
        Autofill Guest Details
      </button>
      <hr />
      {/* <button onClick={loginwithgoogle}>Sign in with google</button> */}
      <GoogleLoginButton />
      <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
}

export default Login;
