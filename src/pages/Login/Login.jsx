import React from "react";
import "./Login.css";
import { useForm } from "react-hook-form";

function Login() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    // Log the user details for debugging
    console.log("User data submitted:", data);

    try {
      const response = await fetch(`http://localhost:8080/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Login result:", result);

      // Store token and username in localStorage
      localStorage.setItem("token", result.jwtToken);
      //   localStorage.setItem("username", data.userName); // Storing username
      window.location.replace("/product");
      window.scrollTo(0, 0);

      //   reset();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      {localStorage.getItem("token") ? null : (
        <div className="setDiv">
          <div className="login-container">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="userName"
                  required
                  {...register("userName")}
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="userPassword"
                  required
                  {...register("userPassword")}
                />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
