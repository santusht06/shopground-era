import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        list: [],
        activeTab: 'all',
    },
    reducers: {
        addOrder: (state, action) => {
            state.list.unshift(action.payload);
        },
        setActiveOrderTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
});

export const { addOrder, setActiveOrderTab } = ordersSlice.actions;
export default ordersSlice.reducer;
