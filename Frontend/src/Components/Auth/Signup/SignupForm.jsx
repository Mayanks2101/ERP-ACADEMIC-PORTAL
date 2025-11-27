import React, { useState } from "react";
import "./Signup.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../store/AuthReducer"; // adjust path if needed

export default function SignupForm({ togglePanel }) {
  const dispatch = useDispatch();
  const auth = useSelector((s)=>s.auth || {});
  const [formData, setFormData] = useState({ fullName:"", email:"", password:"", role:"ROLE_ERP_ADMIN" });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (name === "fullName") if (!value) return "Full Name required";
    if (name === "email") {
      if (!value) return "Email required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email";
    }
    if (name === "password") {
      if (!value) return "Password required";
      if (value.length < 6) return "At least 6 characters";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: validateField(name, value) }));
  };

  const isValid = () => {
    const next = {
      fullName: validateField("fullName", formData.fullName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
    setErrors(next);
    return !next.fullName && !next.email && !next.password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid()) return;
    dispatch(register({ fullName: formData.fullName, email: formData.email, password: formData.password, role: formData.role }));
  };

  return (
    <div className="form-wrap large">
      <h2 className="form-title">Create account</h2>
      

      {auth.error && <div className="server-error">{auth.error}</div>}

      <form className="form-inner" onSubmit={handleSubmit} noValidate>
        <input name="fullName" placeholder="Name" value={formData.fullName} onChange={handleChange} className={`input ${errors.fullName?"input-error":""}`} />
        {errors.fullName && <div className="field-error">{errors.fullName}</div>}

        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className={`input ${errors.email?"input-error":""}`} />
        {errors.email && <div className="field-error">{errors.email}</div>}

        <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className={`input ${errors.password?"input-error":""}`} />
        {errors.password && <div className="field-error">{errors.password}</div>}

        <button className="primary-btn" type="submit" disabled={auth.loading}>{auth.loading?"Please wait...":"Create account"}</button>

        <div className="small-info">Already have an account? <button type="button" className="link-btn" onClick={togglePanel}>Signin</button></div>

        <div className="social-row">
          <button type="button" className="social-btn">G</button>
          <button type="button" className="social-btn elevated"></button>
          <button type="button" className="social-btn">f</button>
        </div>
      </form>
    </div>
  );
}
