import React, {useState} from "react";
import SigninForm from "./Signin/SigninForm";
import SignupForm from "./Signup/SignupForm";
import "./Auth.css";
import authImg from "../../assets/academic_erp.png";

const IMAGE_PATH = authImg; // move your illustration to public/auth-art.png for production

export default function Auth() {
    const [isRegister, setIsRegister] = useState(false);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-left">
                    <div className="auth-toggle">
                        <button
                            className={`auth-toggle-btn ${
                                !isRegister ? "active" : ""
                            }`}
                            onClick={() => setIsRegister(false)}
                            aria-pressed={!isRegister}
                        >
                            Sign in
                        </button>

                        <button
                            className={`auth-toggle-btn ${
                                isRegister ? "active" : ""
                            }`}
                            onClick={() => setIsRegister(true)}
                            aria-pressed={isRegister}
                        >
                            Create account
                        </button>
                    </div>

                    <div className="auth-form-container">
                        <div className="auth-form-inner">
                            {/* Only render the active panel (keeps DOM small) */}
                            {!isRegister ? (
                                <SigninForm
                                    togglePanel={() => setIsRegister(true)}
                                />
                            ) : (
                                <SignupForm
                                    togglePanel={() => setIsRegister(false)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="signin-right-inner">
                        <img src={IMAGE_PATH} alt="illustration" />
                    </div>
                </div>
            </div>
        </div>
    );
}
