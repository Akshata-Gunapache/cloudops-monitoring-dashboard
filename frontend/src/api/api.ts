import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getLatestMetrics = () => {
  return axios.get(`${API_BASE_URL}/metrics/latest`);
};

export const getMetricsHistory = () => {
  return axios.get(`${API_BASE_URL}/metrics/history`);
};

export const getServices = () => {
  return axios.get(`${API_BASE_URL}/services`);
};

export const getAlerts = () => {
  return axios.get(`${API_BASE_URL}/alerts`);
};

export const seedData = () => {
  return axios.post(`${API_BASE_URL}/seed`);
};