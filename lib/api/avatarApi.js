import apiClient from "./axios";

/**
 * Get all avatars
 * GET /api/dashboard/avatars/
 */
export const getAllAvatars = async () => {
  try {
    const response = await apiClient.get("/api/dashboard/avatars/");
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

/**
 * Get business avatar config
 * GET /api/dashboard/avatar/config/?business_id={{businessId}}
 */
export const getBusinessAvatarConfig = async (businessId) => {
  try {
    const response = await apiClient.get("/api/dashboard/avatar/config/", {
      params: { business_id: businessId },
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

/**
 * Create business avatar config
 * POST /api/dashboard/avatar/config/
 * Body: { business_id, avatar_id }
 */
export const createBusinessAvatarConfig = async ({ businessId, avatarId }) => {
  try {
    const response = await apiClient.post("/api/dashboard/avatar/config/", {
      business_id: String(businessId),
      avatar_id: String(avatarId),
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

