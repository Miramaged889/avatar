import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllQuestions,
  getQuestionDetails,
  getAnswerById,
  getAllAnswers,
  getAllDocuments,
  updateAnswer,
  deleteAnswer as deleteAnswerApi,
  uploadKnowledgeFiles,
  bulkCreateAnswers,
} from "../../api/knowledgeApi";

// Initial state
const initialState = {
  questions: [],
  currentQuestion: null,
  answers: {}, // Individual answers by question ID
  allAnswers: [], // All answers list
  files: [], // Uploaded files
  documents: [], // All documents/files
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllQuestions = createAsyncThunk(
  "knowledge/fetchAllQuestions",
  async (params, { rejectWithValue }) => {
    const result = await getAllQuestions(params);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const fetchQuestionDetails = createAsyncThunk(
  "knowledge/fetchQuestionDetails",
  async (questionId, { rejectWithValue }) => {
    const result = await getQuestionDetails(questionId);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const fetchAnswerById = createAsyncThunk(
  "knowledge/fetchAnswerById",
  async (answerId, { rejectWithValue }) => {
    const result = await getAnswerById(answerId);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const editAnswer = createAsyncThunk(
  "knowledge/editAnswer",
  async ({ answerId, answerData }, { rejectWithValue }) => {
    const result = await updateAnswer(answerId, answerData);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const uploadFiles = createAsyncThunk(
  "knowledge/uploadFiles",
  async ({ files, businessId }, { rejectWithValue }) => {
    const result = await uploadKnowledgeFiles(files, businessId);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const fetchAllAnswers = createAsyncThunk(
  "knowledge/fetchAllAnswers",
  async (params, { rejectWithValue }) => {
    const result = await getAllAnswers(params);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const fetchAllDocuments = createAsyncThunk(
  "knowledge/fetchAllDocuments",
  async (params, { rejectWithValue }) => {
    const result = await getAllDocuments(params);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const createBulkAnswers = createAsyncThunk(
  "knowledge/createBulkAnswers",
  async (data, { rejectWithValue }) => {
    const result = await bulkCreateAnswers(data);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const deleteAnswer = createAsyncThunk(
  "knowledge/deleteAnswer",
  async (answerId, { rejectWithValue }) => {
    const result = await deleteAnswerApi(answerId);
    if (result.success) {
      return answerId;
    }
    return rejectWithValue(result.error);
  }
);

// Slice
const knowledgeSlice = createSlice({
  name: "knowledge",
  initialState,
  reducers: {
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    clearAnswers: (state) => {
      state.answers = {};
    },
    clearFiles: (state) => {
      state.files = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch all questions
    builder
      .addCase(fetchAllQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];
      })
      .addCase(fetchAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch question details
    builder
      .addCase(fetchQuestionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload;
      })
      .addCase(fetchQuestionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch answer by ID
    builder.addCase(fetchAnswerById.fulfilled, (state, action) => {
      const answer = action.payload;
      if (answer.question) {
        state.answers[answer.question] = answer;
      }
    });

    // Edit answer
    builder
      .addCase(editAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAnswer.fulfilled, (state, action) => {
        state.loading = false;
        const answer = action.payload;
        if (answer.question) {
          state.answers[answer.question] = answer;
        }
      })
      .addCase(editAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Upload files
    builder
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        state.loading = false;
        const uploadedFiles = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        state.files = [...state.files, ...uploadedFiles];
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all answers
    builder
      .addCase(fetchAllAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.allAnswers = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];
      })
      .addCase(fetchAllAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all documents
    builder
      .addCase(fetchAllDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];
      })
      .addCase(fetchAllDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Bulk create answers
    builder
      .addCase(createBulkAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBulkAnswers.fulfilled, (state, action) => {
        state.loading = false;
        const answers = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        answers.forEach((answer) => {
          if (answer.question) {
            state.answers[answer.question] = answer;
          }
        });
      })
      .addCase(createBulkAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete answer
    builder
      .addCase(deleteAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnswer.fulfilled, (state, action) => {
        state.loading = false;
        const deletedAnswerId = action.payload;
        // Remove from allAnswers array
        state.allAnswers = state.allAnswers.filter(
          (answer) => answer.id !== deletedAnswerId
        );
        // Remove from answers object if exists
        Object.keys(state.answers).forEach((key) => {
          if (state.answers[key]?.id === deletedAnswerId) {
            delete state.answers[key];
          }
        });
      })
      .addCase(deleteAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentQuestion,
  clearError,
  setAnswer,
  clearAnswers,
  clearFiles,
} = knowledgeSlice.actions;
export default knowledgeSlice.reducer;
