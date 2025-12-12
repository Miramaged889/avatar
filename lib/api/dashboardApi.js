import apiClient from "./axios";

/**
 * Get dashboard statistics
 * Note: No dedicated stats endpoint exists, so we aggregate from other APIs
 */
export const getDashboardStats = async () => {
  // Return null to indicate we should aggregate manually
  return {
    success: false,
    error: "No stats endpoint available",
  };
};

/**
 * Get recent activities/transactions
 * Note: No dedicated activities endpoint exists, so we aggregate from other APIs
 */
export const getRecentActivities = async (params = {}) => {
  // Return null to indicate we should aggregate manually
  return {
    success: false,
    error: "No activities endpoint available",
  };
};
