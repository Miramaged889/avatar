import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPayment,
  getAllPayments,
  getPaymentDetails,
  updatePayment,
  deletePayment,
} from "../../api/paymentApi";

// Initial state
const initialState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllPayments = createAsyncThunk(
  "payment/fetchAll",
  async (params, { rejectWithValue }) => {
    const result = await getAllPayments(params);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const fetchPaymentDetails = createAsyncThunk(
  "payment/fetchDetails",
  async (paymentId, { rejectWithValue }) => {
    const result = await getPaymentDetails(paymentId);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const addPayment = createAsyncThunk(
  "payment/add",
  async (paymentData, { rejectWithValue }) => {
    const result = await createPayment(paymentData);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const editPayment = createAsyncThunk(
  "payment/edit",
  async ({ paymentId, paymentData }, { rejectWithValue }) => {
    const result = await updatePayment(paymentId, paymentData);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const removePayment = createAsyncThunk(
  "payment/remove",
  async (paymentId, { rejectWithValue }) => {
    const result = await deletePayment(paymentId);
    if (result.success) {
      return paymentId; // Return ID to remove from state
    }
    return rejectWithValue(result.error);
  }
);

// Slice
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all payments
    builder
      .addCase(fetchAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch payment details
    builder
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add payment
    builder
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        const newPayment = action.payload;
        state.payments.unshift(newPayment); // Add to the beginning
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Edit payment
    builder
      .addCase(editPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPayment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPayment = action.payload;
        const index = state.payments.findIndex((p) => p.id === updatedPayment.id);
        if (index !== -1) {
          state.payments[index] = updatedPayment;
        }
        if (state.currentPayment?.id === updatedPayment.id) {
          state.currentPayment = updatedPayment;
        }
      })
      .addCase(editPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove payment
    builder
      .addCase(removePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.filter((p) => p.id !== action.payload);
        if (state.currentPayment?.id === action.payload) {
          state.currentPayment = null;
        }
      })
      .addCase(removePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPayment, clearError } = paymentSlice.actions;
export default paymentSlice.reducer;

