import axios from "axios";
import apiClient from "./axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://avatar-backend-gdv6e.ondigitalocean.app";

/**
 * Superuser Login
 * POST /api/superuser/login/
 */
export const superuserLogin = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/superuser/login/`,
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
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

/**
 * Superuser Logout
 * POST /api/superuser/logout/
 */
export const superuserLogout = async (refreshToken) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await axios.post(
      `${API_BASE_URL}/api/superuser/logout/`,
      {
        refresh: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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

/**
 * Get superuser account info
 * GET /api/superuser/me/
 */
export const getSuperuserMe = async () => {
  try {
    const response = await apiClient.get("/api/superuser/me/");
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
 * Update superuser profile
 * PATCH /api/superuser/me/
 * @param {Object} profileData - { first_name, last_name, username, email }
 */
export const updateSuperuserMe = async (profileData) => {
  try {
    const response = await apiClient.git("/api/superuser/me/", profileData);
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
 * Change superuser password
 * POST /api/superuser/change/password/
 * @param {Object} payload - { oldPassword, newPassword, confirmNewPassword }
 */
export const changeSuperuserPassword = async ({
  oldPassword,
  newPassword,
  confirmNewPassword,
}) => {
  try {
    const response = await apiClient.post("/api/superuser/change/password/", {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
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
