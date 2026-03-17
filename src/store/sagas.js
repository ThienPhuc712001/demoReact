import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import { employeeService } from '../services/api';
import websocketService from '../services/websocket';
import {
  FETCH_EMPLOYEES_REQUEST,
  CREATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_REQUEST,
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT
} from './actionTypes';
import {
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  createEmployeeSuccess,
  createEmployeeFailure,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
  websocketMessageReceived
} from './actions';

// Worker sagas
function* fetchEmployees() {
  try {
    const employees = yield call(employeeService.getAllEmployees);
    yield put(fetchEmployeesSuccess(employees));
  } catch (error) {
    yield put(fetchEmployeesFailure(error.message));
  }
}

function* createEmployee(action) {
  try {
    const employee = yield call(employeeService.createEmployee, action.payload);
    yield put(createEmployeeSuccess(employee));
  } catch (error) {
    yield put(createEmployeeFailure(error.message));
  }
}

function* updateEmployee(action) {
  try {
    const { id, employee } = action.payload;
    const updatedEmployee = yield call(employeeService.updateEmployee, id, employee);
    yield put(updateEmployeeSuccess(updatedEmployee));
  } catch (error) {
    yield put(updateEmployeeFailure(error.message));
  }
}

function* deleteEmployee(action) {
  try {
    yield call(employeeService.deleteEmployee, action.payload);
    yield put(deleteEmployeeSuccess(action.payload));
  } catch (error) {
    yield put(deleteEmployeeFailure(error.message));
  }
}

function* connectWebSocket() {
  try {
    // Wait for the WebSocket connection to be established
    yield call(() => websocketService.connect());
    
    // Subscribe to WebSocket events
    const unsubscribeCreated = websocketService.subscribe('employee_created', (data) => {
      // This will be handled by the reducer
    });
    
    const unsubscribeUpdated = websocketService.subscribe('employee_updated', (data) => {
      // This will be handled by the reducer
    });
    
    const unsubscribeDeleted = websocketService.subscribe('employee_deleted', (data) => {
      // This will be handled by the reducer
    });
    
    // Store unsubscribe functions for cleanup
    yield put({ type: 'WEBSOCKET_SUBSCRIPTIONS_SET', payload: { unsubscribeCreated, unsubscribeUpdated, unsubscribeDeleted } });
  } catch (error) {
    console.error('WebSocket connection error:', error);
    // Retry connection after a delay
    yield call(delay, 3000);
    yield put({ type: WEBSOCKET_CONNECT });
  }
}

// Helper function to create a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function* disconnectWebSocket() {
  try {
    websocketService.disconnect();
  } catch (error) {
    console.error('WebSocket disconnection error:', error);
  }
}

// Watcher sagas
function* watchFetchEmployees() {
  yield takeEvery(FETCH_EMPLOYEES_REQUEST, fetchEmployees);
}

function* watchCreateEmployee() {
  yield takeEvery(CREATE_EMPLOYEE_REQUEST, createEmployee);
}

function* watchUpdateEmployee() {
  yield takeEvery(UPDATE_EMPLOYEE_REQUEST, updateEmployee);
}

function* watchDeleteEmployee() {
  yield takeEvery(DELETE_EMPLOYEE_REQUEST, deleteEmployee);
}

function* watchWebSocket() {
  yield takeEvery(WEBSOCKET_CONNECT, connectWebSocket);
  yield takeEvery(WEBSOCKET_DISCONNECT, disconnectWebSocket);
}

// Root saga
export default function* rootSaga() {
  yield all([
    fork(watchFetchEmployees),
    fork(watchCreateEmployee),
    fork(watchUpdateEmployee),
    fork(watchDeleteEmployee),
    fork(watchWebSocket)
  ]);
}