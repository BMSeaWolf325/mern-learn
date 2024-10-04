import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from './api/apiSlice';
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
    // manages state of API reqs
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    // apiSlice.middleware = auto handle req/res of API reqs
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true // enables the Redux DevTools extension in your development environment
})

setupListeners(store.dispatch) // to set up automatic refetching of data based on certain actions