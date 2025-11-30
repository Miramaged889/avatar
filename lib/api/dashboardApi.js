import apiClient from "./axios";

/**
 * Get dashboard statistics
 * GET /api/dashboard/stats/ (or similar endpoint)
 * This endpoint should return overall system statistics
 */
export const getDashboardStats = async () => {
  try {
    // Try to get stats from a dedicated endpoint first
    // If it doesn't exist, we'll aggregate from other endpoints
    const response = await apiClient.get("/api/dashboard/stats/");
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // If stats endpoint doesn't exist, return null to aggregate manually
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

/**
 * Get recent activities/transactions
 * This can be used to show recent payments, clients, etc.
 */
export const getRecentActivities = async (params = {}) => {
  try {
    const response = await apiClient.get("/api/dashboard/activities/", {
      params,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

