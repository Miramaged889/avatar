import axios from "axios";

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
