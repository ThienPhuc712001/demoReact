import { takeEvery, put, call, all, fork } from 'redux-saga/effects';
import { employeeService } from '../services/api';
import {
  FETCH_EMPLOYEES_REQUEST,
  CREATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_REQUEST,
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

// Root saga
export default function* rootSaga() {
  yield all([
    fork(watchFetchEmployees),
    fork(watchCreateEmployee),
    fork(watchUpdateEmployee),
    fork(watchDeleteEmployee)
  ]);
}