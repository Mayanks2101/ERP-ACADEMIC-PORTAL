// src/App.jsx
import { useEffect } from "react";
import { getDepartment } from "./store/departmentReducer";
import Home from "./Components/Home/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmpList from "./Components/Emp_list/EmpList";
import Create from "./Components/CreateDepartment/CreateDepartment";
import Auth from "./Components/Auth/Auth";
import OAuth2Redirect from "./Components/Auth/OAuth2Redirect";
import { getUserProfile } from "./store/AuthReducer";

import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth); // select the slice directly

  // read token once (or whenever it changes)
  const token = (() => {
    try {
      return localStorage.getItem("jwt");
    } catch {
      return null;
    }
  })();

  // Run once on mount (or when token value changes)
  useEffect(() => {
    if (token) {
      dispatch(getUserProfile(token));
    }
    // optionally load departments if you want on app start:
    // dispatch(getDepartment({ j: token }));
  }, [dispatch, token]);

  // Use auth.loggedIn (or auth.jwt) to protect routes. While profile is loading,
  // loggedIn may be true (if jwt present) but auth.user may be null — that's ok.
  const isLoggedIn = !!auth?.loggedIn;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/create" element={isLoggedIn ? <Create /> : <Navigate to="/login" replace />} />
        <Route path="/dept/:id" element={isLoggedIn ? <EmpList /> : <Navigate to="/login" replace />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/login" element={!isLoggedIn ? <Auth /> : <Navigate to="/" replace />} />
        {/* Optional: add a catch-all redirect */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
