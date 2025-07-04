import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api/axios";

// Initial state
const initialState = {
  items:JSON.parse(localStorage.getItem("cart")) || {},
  loading: false,
  error: null,
};

// 🔁 Get Cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const state = thunkAPI.getState();
    const userId = state.user.user?._id;
    const response = await axios.post(
      "/cart/get",
      { userId },
      { headers: { token } }
    );
    return response.data.cartData;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
  }
});

// ➕ Add to Cart
export const addToCart = createAsyncThunk("cart/addToCart", async ({ itemId, size }, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const state = thunkAPI.getState();
    console.log("state", state);
    const userId = state.user.user?._id;

    const response = await axios.post(
      "/cart/add",
      { userId, itemId, size },
      { headers: { token } }
    );

    // Refetch updated cart
    thunkAPI.dispatch(fetchCart());

    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add to cart");
  }
});

// 🔄 Update Cart Quantity
export const updateCartItem = createAsyncThunk("cart/updateCartItem", async ({ itemId, size, quantity }, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const state = thunkAPI.getState();
    const userId = state.user.user?._id;

    const response = await axios.post(
      "/cart/update",
      { userId, itemId, size, quantity },
      { headers: { token } }
    );

    // Refetch updated cart
    thunkAPI.dispatch(fetchCart());

    return response.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update cart item");
  }
});

// 🧠 Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || {};
        localStorage.setItem('cart', JSON.stringify(state.items));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Cart
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
