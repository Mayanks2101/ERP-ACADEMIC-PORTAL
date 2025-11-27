import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, logout as logoutAction } from "../../store/AuthReducer";
import { jwtDecode } from "jwt-decode";
import { AppDispatch, RootState } from "../../store/store";

import { toast, Bounce } from "react-toastify";
import CreateDepartmentModal from "../CreateDepartment/CreateDepartment";

const Navbar = () => {
    // Select only the auth slice (do not return the whole root state)
    const auth = useSelector((store: RootState) => store.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    /* ------------------ AUTO LOGOUT ------------------ */
    const getTokenExpiryTime = (token: string): number | null => {
        try {
            // jwtDecode should be the function imported from 'jwt-decode'
            const decoded: any = jwtDecode(token);
            return decoded.exp * 1000;
        } catch (err) {
            // invalid token -> no expiry
            return null;
        }
    };

    const token = localStorage.getItem("jwt");

    useEffect(() => {
        if (!token) return;

        const expiry = getTokenExpiryTime(token);
        if (!expiry) return;

        const remaining = expiry - Date.now();
        if (remaining > 0) {
            const tid = setTimeout(() => {
                toast.warning("Session expired", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                    transition: Bounce,
                });
                handleLogout();
            }, remaining);

            return () => clearTimeout(tid);
        } else {
            handleLogout();
        }
        // include token in deps so effect re-runs if token changes
    }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ------------------ LOGOUT ------------------ */
    const handleLogout = () => {
        dispatch(logoutAction());
        localStorage.removeItem("jwt");
        navigate("/login");
    };

    /* ------------------ MODAL ------------------ */
    const [openCreate, setOpenCreate] = useState(false);

    /* ------------------ FETCH USER ------------------ */
    useEffect(() => {
        const t = localStorage.getItem("jwt");
        // if (!t) return; // don't dispatch when there's no token
        if (t) {
            dispatch(getUserProfile(t));
        }
        // If token changes, re-run
    }, [dispatch]);

    const firstName = auth?.user?.firstName || "";
    const lastName = auth?.user?.lastName || "";
    const displayName = auth?.user?.fullName || `${firstName} ${lastName}`.trim() || "User";
    const isAdmin = auth?.role === 'ROLE_ADMIN' || auth?.role === 'ROLE_ERP_ADMIN';

    return (
        <>
            <div className="navbar">
                {/* LEFT */}
                <div className="nav-left">
                    <span className="nav-title">Academic ERP</span>
                </div>

                {/* CENTER */}
                <div className="nav-center">
                    {isAdmin ? (
                        <Button
                            className="add-btn"
                            onClick={() => setOpenCreate(true)}
                            variant="contained"
                        >
                            ADD DEPARTMENT
                        </Button>
                    ) : (
                        <span style={{
                            color: '#666',
                            fontSize: '14px',
                            fontStyle: 'italic',
                            padding: '8px 16px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '4px'
                        }}>
                            Read-only mode
                        </span>
                    )}
                </div>

                {/* RIGHT */}
                <div className="nav-right">
                    <span className="user-name">{displayName}</span>

                    <Avatar className="user-avatar">
                        {displayName?.[0] || "U"}
                    </Avatar>

                    <Button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>

            <CreateDepartmentModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
            />
        </>
    );
};

export default Navbar;
