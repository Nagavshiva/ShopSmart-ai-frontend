import { configureStore } from '@reduxjs/toolkit';
import userReducer from './auth/userSlice';
import cartReducer from './cartSlice';
import uiReducer from './uiSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import aiReducer from './aiSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    ui: uiReducer,
    order: orderReducer,
    ai: aiReducer

  },
});

export default store;
