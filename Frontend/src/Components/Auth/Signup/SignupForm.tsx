import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Signup.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../store/AuthReducer";
import { AppDispatch, RootState } from "../../../store/store";
import { BACKEND_BASE_URL } from "../../../config";

interface SignupFormProps {
    togglePanel: () => void;
}

interface Errors {
    fullName?: string;
    email?: string;
    password?: string;
    [key: string]: string | undefined;
}

export default function SignupForm({ togglePanel }: SignupFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((s: RootState) => s.auth);
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", role: "ROLE_ERP_ADMIN" });
    const [errors, setErrors] = useState<Errors>({});

    const validateField = (name: string, value: string): string => {
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        setErrors(p => ({ ...p, [name]: validateField(name, value) }));
    };

    const isValid = () => {
        const next: Errors = {
            fullName: validateField("fullName", formData.fullName),
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
        };
        setErrors(next);
        return !next.fullName && !next.email && !next.password;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isValid()) return;
        dispatch(register({ fullName: formData.fullName, email: formData.email, password: formData.password, role: formData.role }));
    };

    return (
        <div className="form-wrap large">
            <h2 className="form-title">Create account</h2>

            {auth.error && <div className="server-error">{auth.error}</div>}

            <form className="form-inner" onSubmit={handleSubmit} noValidate>
                <input name="fullName" placeholder="Name" value={formData.fullName} onChange={handleChange} className={`input ${errors.fullName ? "input-error" : ""}`} />
                {errors.fullName && <div className="field-error">{errors.fullName}</div>}

                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className={`input ${errors.email ? "input-error" : ""}`} />
                {errors.email && <div className="field-error">{errors.email}</div>}

                <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} className={`input ${errors.password ? "input-error" : ""}`} />
                {errors.password && <div className="field-error">{errors.password}</div>}

                <button className="primary-btn" type="submit" disabled={auth.loading}>{auth.loading ? "Please wait..." : "Create account"}</button>

                <div className="small-info">Already have an account? <button type="button" className="link-btn" onClick={togglePanel}>Signin</button></div>

                <div className="social-row">
                    <button
                        type="button"
                        className="google-btn"
                        aria-label="google"
                        onClick={() => {
                            window.location.href = `${BACKEND_BASE_URL}/oauth2/authorization/google`;
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
