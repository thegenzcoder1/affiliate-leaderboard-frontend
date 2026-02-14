// src/api/client.js
import axios from "axios";


const BASE_URL = "https://api.kancheepuramsmsilks.net/api";
const PARTNER_TOKEN = "admin-89228dhaubah-admin78910";
const JWT_KEY = "lb_jwt"; // localStorage key for JWT

export const getJwt = () => localStorage.getItem(JWT_KEY);
export const setJwt = (t) => localStorage.setItem(JWT_KEY, t);
export const clearJwt = () => localStorage.removeItem(JWT_KEY);

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach partner token + JWT if present
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  // Partner/affiliate header required by your API
  if (PARTNER_TOKEN) {
    config.headers["token"] = PARTNER_TOKEN;
  }
  // JWT auth header for logged-in calls
  const jwt = getJwt();
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

/**
 * Helper to create a client with admin-token header for a single call.
 * Use only where the endpoint requires it (e.g., admin login/patch).
 * Do NOT store adminToken; pass it from the form to the specific call.
 */
export const withAdminToken = (adminToken) =>
  axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      token: PARTNER_TOKEN,
      Authorization: getJwt() ? `Bearer ${getJwt()}` : undefined,
      "admin-token": adminToken,
    },
  });