import React from "react";
import "./Login.css";
import { useForm } from "react-hook-form";

function Login() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    // Log the user details for debugging
    // console.log("User data submitted:", data);

    try {
      const response = await fetch(`http://localhost:8080/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert("Invalid credentials, please try again");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // console.log("Login result:", result);

      // Store token and username in localStorage
      // localStorage.setItem("token", result.jwtToken);

      if (result.user.role[0].roleName === "ADMIN") {
        console.log("welcome admin");

        const storeToken = () => {
          // console.log("store token is working ");

          const expirationTime = new Date().getTime() + 20 * 60 * 1000; // 20 minutes from now
          localStorage.setItem("token", result.jwtToken);
          localStorage.setItem("tokenExpiration", expirationTime);
        };
        storeToken();

        const isTokenExpired = () => {
          // console.log("is token expired is working ");

          const tokenExpiration = localStorage.getItem("tokenExpiration");
          if (!tokenExpiration) {
            return true; // No expiration time set, consider token as expired
          }
          return new Date().getTime() > parseInt(tokenExpiration, 10);
        };

        const removeToken = () => {
          // console.log("remove token is working ");
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
        };

        const validateToken = () => {
          // console.log("validate token is working ");
          if (isTokenExpired()) {
            removeToken();
            // Optionally redirect to login page or handle the expiration
            alert("Token has expired, please log in again.");
            window.location.replace("/login");
          }
        };

        // Call this function on app load or whenever you want to check the token
        validateToken();

        window.location.replace("/product");
      }

      // navigate("/product");
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
// _____  _  __
// / ____|| |/ /
// | (___  | ' /
//  \___ \ |  <
//  ____) || . \
// |_____/ |_|\_\

// 👨‍💻 web site Created by Amir Sohail Sheikh
