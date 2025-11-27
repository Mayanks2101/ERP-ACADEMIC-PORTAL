import React, { useEffect, useState } from "react";
import "./Signin.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/AuthReducer"; // adjust path if needed
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function SigninForm({ togglePanel }) {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth || {});
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(()=> {
    // any logic on auth.loggedIn can go here (redirect etc.)
  }, [auth.loggedIn]);

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value) return "Email required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email";
    }
    if (name === "password") {
      if (!value) return "Password required";
      if (value.length < 6) return "Minimum 6 characters";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? checked : value;
    setFormData((p) => ({ ...p, [name]: v }));
    setErrors((p) => ({ ...p, [name]: validateField(name, v) }));
  };

  const isValid = () => {
    const next = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid()) return;
    dispatch(login({ email: formData.email, password: formData.password, remember: formData.remember }));
  };

  return (
    <div className="form-wrap small">
      <h2 className="form-title">Sign in</h2>
      {/* <p className="form-sub">Welcome back — sign in to continue.</p> */}

      {auth.error && <div className="server-error">{auth.error}</div>}

      <form className="form-inner" onSubmit={handleSubmit} noValidate>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`input ${errors.email ? "input-error" : ""}`}
          placeholder="Email"
          type="email"
          autoComplete="email"
        />
        {errors.email && <div className="field-error">{errors.email}</div>}

        {/* Password row: inline input + toggle button (fixed layout) */}
        <div
          className="password-row"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input ${errors.password ? "input-error" : ""}`}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            style={{ flex: 1, margin: 0 }} // take remaining width, prevent extra margin
          />
          <IconButton
            onClick={() => setShowPassword(s => !s)}
            size="small"
            aria-label="toggle password"
            sx={{ width: 36, height: 36, padding: 0 }}
          >
            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
          </IconButton>
        </div>
        {errors.password && <div className="field-error">{errors.password}</div>}

        {/* REMEMBER & FORGOT commented out per request */}
        {/*
        <div className="form-row small">
          <label className="remember">
            <input type="checkbox" name="remember" checked={formData.remember} onChange={handleChange} />
            <span>Remember me</span>
          </label>

          <button type="button" className="forgot-link" onClick={(e) => e.preventDefault()}>
            Forgot?
          </button>
        </div>
        */}

        <button className="primary-btn" type="submit" disabled={auth.loading}>
          {auth.loading ? "Please wait..." : "Sign in"}
        </button>

        <div className="small-info">
          New here? <button type="button" className="link-btn" onClick={togglePanel}>Create account</button>
        </div>

        <div className="social-row">
          <button
            type="button"
            className="google-btn"
            aria-label="google"
            onClick={() => {
              window.location.href = "http://localhost:8080/oauth2/authorization/google";
            }}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
            <span>Sign in with Google</span>
          </button>

        </div>



      </form>
    </div>
  );
}
