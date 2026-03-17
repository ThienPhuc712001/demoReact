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
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_MESSAGE_RECEIVED
} from './actionTypes';

// Employee actions
export const fetchEmployeesRequest = () => ({
  type: FETCH_EMPLOYEES_REQUEST
});

export const fetchEmployeesSuccess = (employees) => ({
  type: FETCH_EMPLOYEES_SUCCESS,
  payload: employees
});

export const fetchEmployeesFailure = (error) => ({
  type: FETCH_EMPLOYEES_FAILURE,
  payload: error
});

export const createEmployeeRequest = (employee) => ({
  type: CREATE_EMPLOYEE_REQUEST,
  payload: employee
});

export const createEmployeeSuccess = (employee) => ({
  type: CREATE_EMPLOYEE_SUCCESS,
  payload: employee
});

export const createEmployeeFailure = (error) => ({
  type: CREATE_EMPLOYEE_FAILURE,
  payload: error
});

export const updateEmployeeRequest = (id, employee) => ({
  type: UPDATE_EMPLOYEE_REQUEST,
  payload: { id, employee }
});

export const updateEmployeeSuccess = (employee) => ({
  type: UPDATE_EMPLOYEE_SUCCESS,
  payload: employee
});

export const updateEmployeeFailure = (error) => ({
  type: UPDATE_EMPLOYEE_FAILURE,
  payload: error
});

export const deleteEmployeeRequest = (id) => ({
  type: DELETE_EMPLOYEE_REQUEST,
  payload: id
});

export const deleteEmployeeSuccess = (id) => ({
  type: DELETE_EMPLOYEE_SUCCESS,
  payload: id
});

export const deleteEmployeeFailure = (error) => ({
  type: DELETE_EMPLOYEE_FAILURE,
  payload: error
});

export const setEditingEmployee = (employee) => ({
  type: SET_EDITING_EMPLOYEE,
  payload: employee
});

export const clearEditingEmployee = () => ({
  type: CLEAR_EDITING_EMPLOYEE
});

// WebSocket actions
export const websocketConnect = () => ({
  type: WEBSOCKET_CONNECT
});

export const websocketDisconnect = () => ({
  type: WEBSOCKET_DISCONNECT
});

export const websocketMessageReceived = (message) => ({
  type: WEBSOCKET_MESSAGE_RECEIVED,
  payload: message
});