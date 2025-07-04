// src/features/product/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./api/axios";

// 📦 Initial State
const initialState = {
  products: [],
  product: null, // For single product
  loading: false,
  error: null,
  successMessage: null,
};

// 🔄 Fetch all products
export const fetchAllProducts = createAsyncThunk("products/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/product/list");
    return res.data.products;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch products");
  }
});

// 🔍 Fetch single product
export const fetchSingleProduct = createAsyncThunk("products/fetchSingle", async (productId, thunkAPI) => {
  try {
    const res = await axios.post("/product/single", { productId });
    return res.data.product;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch product");
  }
});

// ➕ Add product (admin only)
export const addProduct = createAsyncThunk("products/add", async (formData, thunkAPI) => {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await axios.post("/product/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token,
      },
    });

    return res.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add product");
  }
});

// ❌ Remove product (admin only)
export const removeProduct = createAsyncThunk("products/remove", async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem("adminToken");

    const res = await axios.post("/product/remove", { id }, {
      headers: { token },
    });

    thunkAPI.dispatch(fetchAllProducts()); // Refresh list
    return res.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to remove product");
  }
});

// 🧠 Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductState: (state) => {
      state.product = null;
      state.successMessage = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.product = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Product
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
