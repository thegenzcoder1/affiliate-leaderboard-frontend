// src/services/profile.service.js
import { api } from "../api/client";

/**
 * Patch followers_count for the current user.
 * @param {string} username
 * @param {number} followersCount
 */
export async function updateFollowersCount(username, followersCount) {
  const { data } = await api.patch(
    `/leaderboard/user/${encodeURIComponent(username)}`,
    { followers_count: followersCount } // <-- snake_case as required
  );
  return data; // e.g., { message: "Updated" } or updated object (depends on your API)
}