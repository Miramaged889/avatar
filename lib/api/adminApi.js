import apiClient from "./axios";

/**
 * Get all admins by business
 * GET /api/dashboard/admins?business={{businessId}}
 * @param {Object} params - Query parameters (business)
 */
export const getAllAdmins = async (params = {}) => {
  try {
    const response = await apiClient.get("/api/dashboard/admins", {
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

/**
 * Create a new admin
 * POST /api/dashboard/admin/create/
 * @param {Object} adminData - Admin data (full_name, email, business)
 */
export const createAdmin = async (adminData) => {
  try {
    const response = await apiClient.post(
      "/api/dashboard/admin/create/",
      adminData
    );
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
 * Update admin
 * PUT /api/dashboard/admin/manage/
 * @param {Object} adminData - Admin data (id, full_name, email)
 */
export const updateAdmin = async (adminData) => {
  try {
    const response = await apiClient.put(
      "/api/dashboard/admin/manage/",
      adminData
    );
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
 * Delete admin
 * DELETE /api/dashboard/admin/manage/
 * @param {number} adminId - Admin ID to delete
 */
export const deleteAdmin = async (adminId) => {
  try {
    const formData = new FormData();
    formData.append("id", adminId);
    
    const response = await apiClient.delete(
      "/api/dashboard/admin/manage/",
      {
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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

