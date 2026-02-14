// src/services/auth.service.js
import { api, withAdminToken, setJwt } from "../api/client";

/** Existing: user login */
export async function loginUser({ username, password }) {
  const { data } = await api.post("/leaderboard/login", {
    instagramUser: username,
    password,
  });
  if (data?.token) setJwt(data.token);
  return data; // { token, message }
}


/** Create a leaderboard user (admin only, no login) */
export async function createLeaderboardUser({ username, password, email, adminToken }) {
  const adminApi = withAdminToken(adminToken); // adds token + admin-token headers
  const { data } = await adminApi.post("/leaderboard/admin/create", {
    instagramUser: username,
    password,
    email, // <-- NEW
  });
  return data; // e.g., { message: "User Created" }
}
 

/** Existing: fetch current user */
export async function getMe() {
  const { data } = await api.get("/leaderboard/user");
  return data;
}