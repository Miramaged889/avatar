import apiClient from "./axios";

/**
 * Get specific business details
 * GET /api/dashboard/business/{{business_id}}/
 */
export const getBusinessDetails = async (businessId) => {
  try {
    const response = await apiClient.get(
      `/api/dashboard/business/${businessId}/`
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
 * Get all businesses (if needed)
 */
export const getAllBusinesses = async () => {
  try {
    const response = await apiClient.get("/api/dashboard/business/");
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
 * Create a new business
 */
export const createBusiness = async (businessData) => {
  try {
    const response = await apiClient.post("/api/dashboard/business/", businessData);
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
 * Update business details
 */
export const updateBusiness = async (businessId, businessData) => {
  try {
    const response = await apiClient.patch(
      `/api/dashboard/business/${businessId}/`,
      businessData
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
 * Delete business
 */
export const deleteBusiness = async (businessId) => {
  try {
    const response = await apiClient.delete(
      `/api/dashboard/business/${businessId}/`
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

