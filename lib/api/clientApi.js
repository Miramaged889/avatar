import apiClient from "./axios";

/**
 * Get all clients
 * GET /api/dashboard/clients/
 */
export const getAllClients = async () => {
  try {
    const response = await apiClient.get("/api/dashboard/clients/");
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
 * Get specific client details
 * GET /api/dashboard/clients/{{client_id}}/
 */
export const getClientDetails = async (clientId) => {
  try {
    const response = await apiClient.get(`/api/dashboard/clients/${clientId}/`);
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
 * Create a new client
 * POST /api/dashboard/clients/
 * Body: { name, email, phone, business_id }
 */
export const createClient = async (clientData) => {
  try {
    const response = await apiClient.post(
      "/api/dashboard/clients/",
      clientData
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
 * Update client details
 * PATCH /api/dashboard/clients/{{client_id}}/
 */
export const updateClient = async (clientId, clientData) => {
  try {
    const response = await apiClient.patch(
      `/api/dashboard/clients/${clientId}/`,
      clientData
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
 * Delete client
 * DELETE /api/dashboard/clients/{{client_id}}/
 */
export const deleteClient = async (clientId) => {
  try {
    const response = await apiClient.delete(
      `/api/dashboard/clients/${clientId}/`
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
