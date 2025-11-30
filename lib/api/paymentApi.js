import apiClient from "./axios";

/**
 * Create a new payment
 * POST /api/dashboard/business/payments/
 * @param {Object} paymentData - Payment data (business_id, amount_paid, payment_method, payment_date, note)
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await apiClient.post(
      "/api/dashboard/business/payments/",
      paymentData
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
 * Get all payments for a business
 * GET /api/dashboard/business/payments/
 * @param {Object} params - Query parameters (business_id, etc.)
 */
export const getAllPayments = async (params = {}) => {
  try {
    const response = await apiClient.get("/api/dashboard/business/payments/", {
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
 * Get payment details by ID
 * GET /api/dashboard/business/payments/{{payment_id}}/
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await apiClient.get(
      `/api/dashboard/business/payments/${paymentId}/`
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
 * Update payment
 * PATCH /api/dashboard/business/payments/{{payment_id}}/
 */
export const updatePayment = async (paymentId, paymentData) => {
  try {
    const response = await apiClient.patch(
      `/api/dashboard/business/payments/${paymentId}/`,
      paymentData
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
 * Delete payment
 * DELETE /api/dashboard/business/payments/{{payment_id}}/
 */
export const deletePayment = async (paymentId) => {
  try {
    const response = await apiClient.delete(
      `/api/dashboard/business/payments/${paymentId}/`
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

