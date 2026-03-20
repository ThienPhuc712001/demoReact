import { combineReducers } from 'redux';
import {
  FETCH_EMPLOYEES_REQUEST,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_FAILURE,
  CREATE_EMPLOYEE_REQUEST,
  CREATE_EMPLOYEE_SUCCESS,
  CREATE_EMPLOYEE_FAILURE,
  UPDATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAILURE,
  DELETE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAILURE,
  SET_EDITING_EMPLOYEE,
  CLEAR_EDITING_EMPLOYEE,
} from './actionTypes';

// Initial state
const initialState = {
  employees: [],
  loading: false,
  error: null,
  isEditing: false,
  editingEmployee: null
};

// Employee reducer
const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch employees
    case FETCH_EMPLOYEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_EMPLOYEES_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: action.payload
      };
    case FETCH_EMPLOYEES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Create employee
    case CREATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case CREATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: [...state.employees, action.payload]
      };
    case CREATE_EMPLOYEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Update employee
    case UPDATE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id ? action.payload : emp
        ),
        isEditing: false,
        editingEmployee: null
      };
    case UPDATE_EMPLOYEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Delete employee
    case DELETE_EMPLOYEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: state.employees.filter(emp => emp.id !== action.payload)
      };
    case DELETE_EMPLOYEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // Edit employee
    case SET_EDITING_EMPLOYEE:
      return {
        ...state,
        isEditing: true,
        editingEmployee: action.payload
      };
    case CLEAR_EDITING_EMPLOYEE:
      return {
        ...state,
        isEditing: false,
        editingEmployee: null
      };

    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  employee: employeeReducer
});

export default rootReducer;