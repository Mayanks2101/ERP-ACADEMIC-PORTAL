import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { BASE_URL, api, setAuthHeader } from '../api/api'

export const getDepartment = createAsyncThunk(
  'department/getall',
  async ({ j}) => {
    setAuthHeader(j, api)
    try {
      const response = await api.get(`${BASE_URL}/api/departments`)
      console.log('department information received', response.data)
      console.log(response.status)
      return response.data
    } catch (error) {
      console.log('catched error response statuss' + error.status)
      console.log('catch error', error)
      throw Error(error.response.data.error)
    }
  }
)

export const getEmployee = createAsyncThunk(
  'department/getEmployee',
  async ({ j,id}) => {
    setAuthHeader(j, api)
    try {
      const response = await api.get(`${BASE_URL}/api/emp/getEmpById/${id}`)
      console.log('department information received', response.data)
      console.log(response.status)
      return response.data
    } catch (error) {
      console.log('catched error response statuss' + error.status)
      console.log('catch error', error)
      throw Error(error.response.data.error)
    }
  }
)
export const createDepartment=createAsyncThunk(
  'department/createDepartment',
  async ({ j,obj}) => {
    setAuthHeader(j, api)
    try {
      const response = await api.post(`${BASE_URL}/api/departments`,obj)
      console.log('department information received', response.data)
      console.log(response.status)
      return response.data
    } catch (error) {
      console.log('catched error response statuss' + error.status)
      console.log('catch error', error)
      throw Error(error.response.data.error)
    }
  }
)
export const updateDepartment=createAsyncThunk(
  'department/updateDepartment',
  async ({ j,obj}) => {
    setAuthHeader(j, api)
    try {
      const response = await api.put(`${BASE_URL}/api/departments/${obj.id}`,obj)
      console.log('department information received', response.data)
      console.log(response.status)
      return response.data
    } catch (error) {
      console.log('catched error response statuss' + error.status)
      console.log('catch error', error)
      throw Error(error.response.data.error)
    }
  }
)

export const deleteDepartment=createAsyncThunk(
  'department/deleteDepartment',
  // minimal change: return the id on success (backend returns 204 no content)
  async ({ j,id}, { rejectWithValue }) => {
    setAuthHeader(j, api)
    try {
      const response = await api.delete(`${BASE_URL}/api/departments/${id}`)
      console.log('department information received', response)
      console.log(response.status)
      // backend returns 204 -> treat as success and return id so reducer can remove it
      if (response.status === 204 || (response.status >= 200 && response.status < 300)) {
        return id
      }
      return rejectWithValue('Delete failed')
    } catch (error) {
      console.log('catched error response statuss' + error.status)
      console.log('catch error', error)
      return rejectWithValue(error?.response?.data?.error || error.message || 'Delete failed')
    }
  }
)

const departmentSlice = createSlice({
  name: 'department',
  initialState: {
    department: [],
    employee:[],
    loading: false,
    error: null
  },
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
      }).addCase(getEmployee.pending, state => {
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
      }).addCase(deleteDepartment.pending, state => {
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
      }).addCase(updateDepartment.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const temp = action.payload; // updated department object expected
        state.loading = false;
        state.department = state.department.map((item)=> item.id !== temp.id ? item : { ...item, ...temp })
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
