import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../api/adminApi";

// Initial state
const initialState = {
  admins: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllAdmins = createAsyncThunk(
  "admin/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    const result = await getAllAdmins(params);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const addAdmin = createAsyncThunk(
  "admin/add",
  async (adminData, { rejectWithValue }) => {
    const result = await createAdmin(adminData);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const editAdmin = createAsyncThunk(
  "admin/edit",
  async (adminData, { rejectWithValue }) => {
    const result = await updateAdmin(adminData);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const removeAdmin = createAsyncThunk(
  "admin/remove",
  async (adminId, { rejectWithValue }) => {
    const result = await deleteAdmin(adminId);
    if (result.success) {
      return adminId; // Return ID to remove from state
    }
    return rejectWithValue(result.error);
  }
);

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all admins
    builder
      .addCase(fetchAllAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];
      })
      .addCase(fetchAllAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add admin
    builder
      .addCase(addAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const newAdmin = action.payload?.admin || action.payload;
        state.admins.unshift(newAdmin); // Add to the beginning
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Edit admin
    builder
      .addCase(editAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAdmin = action.payload?.admin || action.payload;
        const index = state.admins.findIndex((a) => a.id === updatedAdmin.id);
        if (index !== -1) {
          state.admins[index] = updatedAdmin;
        }
      })
      .addCase(editAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove admin
    builder
      .addCase(removeAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = state.admins.filter((a) => a.id !== action.payload);
      })
      .addCase(removeAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;

