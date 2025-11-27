import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, api, setAuthHeader } from "../api/api";
import { toast, Bounce } from "react-toastify";

// Define User interface
export interface User {
    id?: number;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    jwt?: string;
    [key: string]: any;
}

// Define AuthState interface
export interface AuthState {
    user: User | null;
    loggedIn: boolean;
    loading: boolean;
    error: string | null;
    jwt: string | null;
    role: string | null;
}

export const login = createAsyncThunk(
    "auth/login",
    async (userData: any, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/signin`, userData);
            localStorage.setItem("jwt", response.data.jwt);
            toast.success("login sucessfully ", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return response.data;
        } catch (error: any) {

            // prefer server response body if available
            const payload = error.response?.data ?? { message: error.message ?? "Login failed" };
            toast.error(payload.message ?? JSON.stringify(payload), {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });

            // return a rejected action with server payload
            return thunkAPI.rejectWithValue(payload);
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (userData: any, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/signup`, userData);
            localStorage.setItem("jwt", response.data.jwt);
            toast.success("user registered.. ", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return response.data;
        } catch (error: any) {
            const payload = error.response?.data ?? { message: error.message ?? "Register failed" };
            toast.error(payload.message ?? JSON.stringify(payload), {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return thunkAPI.rejectWithValue(payload);
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    try {
        localStorage.clear();
    } catch (error: any) {
        // keep as-is; no server payload expected here
        throw Error(error.response?.data?.error ?? error.message ?? "Logout failed");
    }
});

export const getUserProfile = createAsyncThunk(
    "auth/getUserProfile",
    async (jwt: string, thunkAPI) => {
        setAuthHeader(jwt, api);
        try {
            const response = await api.get("/api/users/profile");
            return response.data;
        } catch (error: any) {
            console.log("catch error  ", error);
            // If 401 Unauthorized, clear the invalid token from storage
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("jwt");
            }
            const payload = error.response?.data ?? { message: error.message ?? "Failed to fetch profile" };
            return thunkAPI.rejectWithValue(payload);
        }
    }
);

const initialState: AuthState = {
    user: null,
    loggedIn: false,
    loading: false,
    error: null,
    jwt: null,
    role: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.jwt = action.payload.jwt; // Assuming payload has jwt
                state.loggedIn = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                // prefer payload (rejectWithValue), fall back to action.error.message
                state.error = (action.payload as any)?.message ?? action.payload ?? action.error?.message ?? "Login failed";
            })

            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.role = action.payload.role; // Store role from user profile
                state.loggedIn = true;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.message ?? action.payload ?? action.error?.message ?? "Failed to get profile";
            })

            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.jwt = action.payload.jwt; // Assuming payload has jwt
                state.loggedIn = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.message ?? action.payload ?? action.error?.message ?? "Register failed";
            })

            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.jwt = null;
                state.role = null;
                state.loggedIn = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.message ?? action.payload ?? action.error?.message ?? "Logout failed";
            });
    },
});

export default authSlice.reducer;
