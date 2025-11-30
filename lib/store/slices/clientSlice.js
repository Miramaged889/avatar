import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllClients,
  getClientDetails,
  createClient,
  updateClient,
  deleteClient,
} from "../../api/clientApi";

// Initial state
const initialState = {
  clients: [],
  currentClient: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllClients = createAsyncThunk(
  "client/fetchAll",
  async (_, { rejectWithValue }) => {
    const result = await getAllClients();
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const fetchClientDetails = createAsyncThunk(
  "client/fetchDetails",
  async (clientId, { rejectWithValue }) => {
    const result = await getClientDetails(clientId);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const addClient = createAsyncThunk(
  "client/add",
  async (clientData, { rejectWithValue }) => {
    const result = await createClient(clientData);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const editClient = createAsyncThunk(
  "client/edit",
  async ({ clientId, clientData }, { rejectWithValue }) => {
    const result = await updateClient(clientId, clientData);
    if (result.success) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

export const removeClient = createAsyncThunk(
  "client/remove",
  async (clientId, { rejectWithValue }) => {
    const result = await deleteClient(clientId);
    if (result.success) {
      return clientId;
    }
    return rejectWithValue(result.error);
  }
);

// Slice
const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all clients
    builder
      .addCase(fetchAllClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllClients.fulfilled, (state, action) => {
        state.loading = false;
        // Handle paginated response
        state.clients = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.results || [];
      })
      .addCase(fetchAllClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch client details
    builder
      .addCase(fetchClientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add client
    builder
      .addCase(addClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.unshift(action.payload);
      })
      .addCase(addClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Edit client
    builder
      .addCase(editClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      .addCase(editClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove client
    builder
      .addCase(removeClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter((c) => c.id !== action.payload);
        if (state.currentClient?.id === action.payload) {
          state.currentClient = null;
        }
      })
      .addCase(removeClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentClient, clearError } = clientSlice.actions;
export default clientSlice.reducer;

