import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBusinessDetails, getAllBusinesses, createBusiness, updateBusiness, deleteBusiness } from "../../api/businessApi";

// Initial state
const initialState = {
  businesses: [],
  currentBusiness: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBusinessDetails = createAsyncThunk(
  "business/fetchDetails",
  async (businessId, { rejectWithValue }) => {
    const result = await getBusinessDetails(businessId);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const fetchAllBusinesses = createAsyncThunk(
  "business/fetchAll",
  async (_, { rejectWithValue }) => {
    const result = await getAllBusinesses();
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const addBusiness = createAsyncThunk(
  "business/add",
  async (businessData, { rejectWithValue }) => {
    const result = await createBusiness(businessData);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const editBusiness = createAsyncThunk(
  "business/edit",
  async ({ businessId, businessData }, { rejectWithValue }) => {
    const result = await updateBusiness(businessId, businessData);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const removeBusiness = createAsyncThunk(
  "business/remove",
  async (businessId, { rejectWithValue }) => {
    const result = await deleteBusiness(businessId);
    if (result.success) {
      return businessId;
    }
    return rejectWithValue(result.error);
  }
);

// Slice
const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    clearCurrentBusiness: (state) => {
      state.currentBusiness = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch business details
    builder
      .addCase(fetchBusinessDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusiness = action.payload;
      })
      .addCase(fetchBusinessDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch all businesses
    builder
      .addCase(fetchAllBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array response and paginated response (results array)
        state.businesses = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];
      })
      .addCase(fetchAllBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add business
    builder
      .addCase(addBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses.push(action.payload);
      })
      .addCase(addBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Edit business
    builder
      .addCase(editBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBusiness.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.businesses.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        if (state.currentBusiness?.id === action.payload.id) {
          state.currentBusiness = action.payload;
        }
      })
      .addCase(editBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove business
    builder
      .addCase(removeBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = state.businesses.filter(
          (b) => b.id !== action.payload
        );
        if (state.currentBusiness?.id === action.payload) {
          state.currentBusiness = null;
        }
      })
      .addCase(removeBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentBusiness, clearError } = businessSlice.actions;
export default businessSlice.reducer;

