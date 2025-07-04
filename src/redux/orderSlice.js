import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './api/axios';

// Initial State
const initialState = {
  orders: [],
  loading: false,
  error: null,
  successMessage: null,
};

// 🔁 Get all orders for user
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const state = thunkAPI.getState();
      const userId = state.user.user?._id;

      const response = await axios.post(
        '/order/userorders',
        { userId },
        { headers: { token } }
      );
      return response.data.orders;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// 🛒 Place order (COD)
export const placeOrderCOD = createAsyncThunk(
  'orders/placeOrderCOD',
  async ({ items, amount, address }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const userId = thunkAPI.getState().user.user._id;

      const response = await axios.post(
        '/order/place',
        { userId, items, amount, address },
        { headers: { token } }
      );
      return response.data.message;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Order placement failed');
    }
  }
);

// 🧾 Stripe Payment Order
export const placeOrderStripe = createAsyncThunk(
  'orders/placeOrderStripe',
  async ({ items, amount, address, email }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const userId = thunkAPI.getState().user.user._id;

      const response = await axios.post(
        '/order/stripe',
        { userId, items, amount, address, email },
        { headers: { token } }
      );
      return response.data.session_url;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Stripe session failed');
    }
  }
);

// 🧾 Razorpay Payment Order
export const placeOrderRazorpay = createAsyncThunk(
  'orders/placeOrderRazorpay',
  async ({ items, amount, address }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const userId = thunkAPI.getState().user.user._id;

      const response = await axios.post(
        '/order/razorpay',
        { userId, items, amount, address },
        { headers: { token } }
      );
      return response.data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Razorpay order failed');
    }
  }
);

// Redux Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // COD
      .addCase(placeOrderCOD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderCOD.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(placeOrderCOD.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Stripe
      .addCase(placeOrderStripe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderStripe.fulfilled, (state) => {
        state.loading = false;
        // action.payload is session_url — handled externally
      })
      .addCase(placeOrderStripe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Razorpay
      .addCase(placeOrderRazorpay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrderRazorpay.fulfilled, (state) => {
        state.loading = false;
        // action.payload is Razorpay order — handle externally
      })
      .addCase(placeOrderRazorpay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderMessages } = orderSlice.actions;
export default orderSlice.reducer;
