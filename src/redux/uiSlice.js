import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showSearch: false,
    search: '',
    searchConfirmed: false, // ✅ Add this
  },
  reducers: {
    setShowSearch: (state, action) => {
      state.showSearch = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.searchConfirmed = false;
    },
    setSearchConfirmed: (state, action) => {
      state.searchConfirmed = action.payload;
    },
  },
});

export const { setShowSearch, setSearch, setSearchConfirmed } = uiSlice.actions;
export default uiSlice.reducer;
