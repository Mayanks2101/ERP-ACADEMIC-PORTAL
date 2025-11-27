// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import departmentReducer from './departmentReducer'
import authReducer from './AuthReducer'
const rootReducer = combineReducers({

  dept: departmentReducer,
  auth:authReducer,
 

});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;