// src/services/leaderboard.service.js
import { api } from "../api/client";

/**
 * Fetch leaderboard users with offset/limit.
 * Expects server to return:
 * {
 *   data: [ { instagramUsername, followersCount, orderPoints, premiumPoints, consistencyPoints, totalPoints }, ... ],
 *   pagination: { offset, limit, total, hasMore }
 * }
 */
export async function fetchLeaderboard({ offset = 0, limit = 20 }) {
  const { data } = await api.get("/leaderboard/users", {
    params: { offset, limit },
  });
  return data;
}