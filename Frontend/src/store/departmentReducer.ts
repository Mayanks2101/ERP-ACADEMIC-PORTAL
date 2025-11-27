import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, setAuthHeader } from '../api/api'
import { BACKEND_BASE_URL } from '../config'

// Define interfaces
export interface Department {
    id: number;
    name: string;
    capacity: number;
    [key: string]: any;
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    title?: string;
    department?: Department;
    [key: string]: any;
}

export interface DepartmentState {
    department: Department[];
    employee: Employee[];
    loading: boolean;
    error: any;
}

export const getDepartment = createAsyncThunk(
    'department/getall',
    async ({ j }: { j: string | null }) => {
        setAuthHeader(j, api)
        try {
            const response = await api.get(`${BACKEND_BASE_URL}/api/departments`)
            return response.data
        } catch (error: any) {
            throw Error(error.response?.data?.error || error.message)
        }
    }
)

export const getEmployee = createAsyncThunk(
    'department/getEmployee',
    async ({ j, id }: { j: string | null, id: number | string }) => {
        setAuthHeader(j, api)
        try {
            // Updated to use the correct endpoint for getting employees by department
            // Using the new endpoint we created or the existing one that works
            const response = await api.get(`${BACKEND_BASE_URL}/api/emp/getByDepartment/${id}`)
            return response.data
        } catch (error: any) {
            throw Error(error.response?.data?.error || error.message)
        }
    }
)

export const createDepartment = createAsyncThunk(
    'department/createDepartment',
    async ({ j, obj }: { j: string | null, obj: any }) => {
        setAuthHeader(j, api)
        try {
            const response = await api.post(`${BACKEND_BASE_URL}/api/departments`, obj)
            return response.data
        } catch (error: any) {
            throw Error(error.response?.data?.error || error.message)
        }
    }
)

export const updateDepartment = createAsyncThunk(
    'department/updateDepartment',
    async ({ j, obj }: { j: string | null, obj: any }) => {
        setAuthHeader(j, api)
        try {
            const response = await api.put(`${BACKEND_BASE_URL}/api/departments/${obj.id}`, obj)
            return response.data
        } catch (error: any) {
            throw Error(error.response?.data?.error || error.message)
        }
    }
)

export const deleteDepartment = createAsyncThunk(
    'department/deleteDepartment',
    // minimal change: return the id on success (backend returns 204 no content)
    async ({ j, id }: { j: string | null, id: number | string }, { rejectWithValue }) => {
        setAuthHeader(j, api)
        try {
            const response = await api.delete(`${BACKEND_BASE_URL}/api/departments/${id}`)
            // backend returns 204 -> treat as success and return id so reducer can remove it
            if (response.status === 204 || (response.status >= 200 && response.status < 300)) {
                return id
            }
            return rejectWithValue('Delete failed')
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.error || error.message || 'Delete failed')
        }
    }
)

const initialState: DepartmentState = {
    department: [],
    employee: [],
    loading: false,
    error: null
}

const departmentSlice = createSlice({
    name: 'department',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getDepartment.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(getDepartment.fulfilled, (state, action) => {
                state.loading = false
                state.department = action.payload
                state.error = null
            })
            .addCase(getDepartment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            })
            .addCase(getEmployee.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(getEmployee.fulfilled, (state, action) => {
                state.loading = false
                state.employee = action.payload
                state.error = null
            })
            .addCase(getEmployee.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            })
            .addCase(deleteDepartment.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                const deletedId = action.payload // now payload is the id (number/string)
                state.loading = false;
                // coerce to string to avoid type mismatch issues
                state.department = state.department.filter((item) => String(item.id) !== String(deletedId));
                state.error = null;
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error
            })
            .addCase(updateDepartment.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                const temp = action.payload; // updated department object expected
                state.loading = false;
                state.department = state.department.map((item) => item.id !== temp.id ? item : { ...item, ...temp })
                state.error = null;
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            })
            .addCase(createDepartment.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false;
                // minimal fix: push into array (push returns new length — don't reassign)
                state.department.push(action.payload);
                state.error = null;
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading = false
                state.error = action.error
            })

    }
})

export default departmentSlice.reducer
