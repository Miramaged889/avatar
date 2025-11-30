import apiClient from "./axios";

/**
 * Get all questions
 * GET /api/dashboard/knowledge/questions/
 * @param {Object} params - Query parameters (input_type, required, search, ordering)
 */
export const getAllQuestions = async (params = {}) => {
  try {
    const response = await apiClient.get(
      "/api/dashboard/knowledge/questions/",
      {
        params,
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
 * Get question details by ID
 * GET /api/dashboard/knowledge/questions/{{questionId}}/
 */
export const getQuestionDetails = async (questionId) => {
  try {
    const response = await apiClient.get(
      `/api/dashboard/knowledge/questions/${questionId}/`
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
 * Get answer by ID
 * GET /api/dashboard/knowledge/answers/{{answerId}}/
 */
export const getAnswerById = async (answerId) => {
  try {
    const response = await apiClient.get(
      `/api/dashboard/knowledge/answers/${answerId}/`
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
 * Update answer
 * PATCH /api/dashboard/knowledge/answers/{{answerId}}/
 */
export const updateAnswer = async (answerId, answerData) => {
  try {
    const response = await apiClient.patch(
      `/api/dashboard/knowledge/answers/${answerId}/`,
      answerData
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
 * Delete answer
 * DELETE /api/dashboard/knowledge/answers/{{answerId}}/
 */
export const deleteAnswer = async (answerId) => {
  try {
    const response = await apiClient.delete(
      `/api/dashboard/knowledge/answers/${answerId}/`
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
 * Upload files/documents
 * POST /api/dashboard/knowledge/documents/
 */
export const uploadKnowledgeFiles = async (files, businessId) => {
  try {
    const formData = new FormData();

    // Handle single file or multiple files
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    } else {
      formData.append("files", files);
    }

    if (businessId) {
      formData.append("business", businessId);
    }

    const response = await apiClient.post(
      "/api/dashboard/knowledge/documents/",
      formData,
      {
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

/**
 * Get all answers
 * GET /api/dashboard/knowledge/answers/
 * @param {Object} params - Query parameters (business, question, etc.)
 */
export const getAllAnswers = async (params = {}) => {
  try {
    const response = await apiClient.get("/api/dashboard/knowledge/answers/", {
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
 * Get all documents/files
 * GET /api/dashboard/knowledge/documents/
 * @param {Object} params - Query parameters (business, status, etc.)
 */
export const getAllDocuments = async (params = {}) => {
  try {
    const response = await apiClient.get(
      "/api/dashboard/knowledge/documents/",
      {
        params,
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
 * Create a single answer
 * POST /api/dashboard/knowledge/answers/
 * API expects the answer data directly (not wrapped in answers field for single creation)
 */
export const createAnswer = async (answerData) => {
  try {
    const response = await apiClient.post(
      "/api/dashboard/knowledge/answers/",
      answerData
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
 * Bulk create answers
 * POST /api/dashboard/knowledge/answers/
 * API expects: { "business": "id", "answers": [{"question": id, "answer_text": "..."}] }
 */
export const bulkCreateAnswers = async (data) => {
  try {
    const response = await apiClient.post(
      "/api/dashboard/knowledge/answers/",
      data
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
