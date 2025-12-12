import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardStats, getRecentActivities } from "../../api/dashboardApi";
import { getAllBusinesses } from "../../api/businessApi";
import { getAllClients } from "../../api/clientApi";
import { getAllPayments } from "../../api/paymentApi";

// Initial state
const initialState = {
  stats: {
    totalBusinesses: 0,
    totalClients: 0,
    totalAdmins: 0,
    totalPayments: 0,
    totalPaymentsAmount: 0,
    activeBusinesses: 0,
    activeClients: 0,
  },
  recentActivities: [],
  loading: false,
  error: null,
};

// Async thunk to fetch all dashboard statistics
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      // Try to get stats from dedicated endpoint
      const statsResult = await getDashboardStats();

      if (statsResult.success) {
        return statsResult.data;
      }

      // If no dedicated endpoint, aggregate from other APIs
      // Note: getAllAdmins requires business param, so we skip it for dashboard stats
      const [businessesResult, clientsResult, paymentsResult] =
        await Promise.all([
          getAllBusinesses(),
          getAllClients(),
          getAllPayments(),
        ]);

      // Calculate statistics
      const businesses = Array.isArray(businessesResult.data)
        ? businessesResult.data
        : businessesResult.data?.results || [];

      const clients = Array.isArray(clientsResult.data)
        ? clientsResult.data
        : clientsResult.data?.results || [];

      const payments = Array.isArray(paymentsResult.data)
        ? paymentsResult.data
        : paymentsResult.data?.results || [];

      // Count admins from businesses (if available) or set to 0
      // Since getAllAdmins requires business param, we can't get total admins
      const totalAdmins = 0;

      // Calculate totals
      const totalPaymentsAmount = payments.reduce(
        (sum, payment) => sum + (parseFloat(payment.amount_paid) || 0),
        0
      );

      const activeBusinesses = businesses.filter(
        (b) => b.is_active !== false
      ).length;
      const activeClients = clients.filter((c) => c.is_active !== false).length;

      return {
        totalBusinesses: businesses.length,
        totalClients: clients.length,
        totalAdmins: totalAdmins, // Set to 0 since we can't fetch without business param
        totalPayments: payments.length,
        totalPaymentsAmount,
        activeBusinesses,
        activeClients,
        newBusinesses: businesses.filter(
          (b) =>
            new Date(b.created_at) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        newClients: clients.filter(
          (c) =>
            new Date(c.created_at) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        newPayments: payments.filter(
          (p) =>
            new Date(p.created_at || p.payment_date) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch recent activities
export const fetchRecentActivities = createAsyncThunk(
  "dashboard/fetchActivities",
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await getRecentActivities(params);
      if (result.success) {
        return result.data;
      }

      // If no activities endpoint, get recent data from other sources
      const [paymentsResult, clientsResult] = await Promise.all([
        getAllPayments(),
        getAllClients(),
      ]);

      const payments = Array.isArray(paymentsResult.data)
        ? paymentsResult.data
        : paymentsResult.data?.results || [];

      const clients = Array.isArray(clientsResult.data)
        ? clientsResult.data
        : clientsResult.data?.results || [];

      // Combine and sort by date (most recent first)
      const activities = [
        ...payments.map((p) => ({
          id: `payment-${p.id}`,
          type: "payment",
          title: `Payment of $${p.amount_paid || 0}`,
          description: p.note || `Payment via ${p.payment_method || "N/A"}`,
          date: p.created_at,
          amount: parseFloat(p.amount_paid) || 0,
        })),
        ...clients.map((c) => ({
          id: `client-${c.id}`,
          type: "client",
          title: `New client: ${c.name_en || c.name_ar || `Client #${c.id}`}`,
          description: c.email || c.phone || "",
          date: c.created_at,
        })),
      ]
        .filter((a) => a.date) // Filter out items without dates
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

      return activities;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          ...state.stats,
          ...action.payload,
        };
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch recent activities
    builder
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivities = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
