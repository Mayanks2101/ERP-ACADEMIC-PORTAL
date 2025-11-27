import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./Signin.css";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/AuthReducer";
import { AppDispatch, RootState } from "../../../store/store";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { BACKEND_BASE_URL } from "../../../config";

interface SigninFormProps {
    togglePanel: () => void;
}

interface Errors {
    email?: string;
    password?: string;
    [key: string]: string | undefined;
}

export default function SigninForm({ togglePanel }: SigninFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((s: RootState) => s.auth);
    const [formData, setFormData] = useState({ email: "", password: "", remember: false });
    const [errors, setErrors] = useState<Errors>({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // any logic on auth.loggedIn can go here (redirect etc.)
    }, [auth.loggedIn]);

    const validateField = (name: string, value: string): string => {
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const v = type === "checkbox" ? checked : value;
        setFormData((p) => ({ ...p, [name]: v }));
        // Cast v to string for validation if it's not a checkbox, or handle appropriately
        if (typeof v === 'string') {
            setErrors((p) => ({ ...p, [name]: validateField(name, v) }));
        }
    };

    const isValid = () => {
        const next: Errors = {
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
        };
        setErrors(next);
        return !next.email && !next.password;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isValid()) return;
        dispatch(login({ email: formData.email, password: formData.password, remember: formData.remember }));
    };

    return (
        <div className="form-wrap small">
            <h2 className="form-title">Sign in</h2>

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
