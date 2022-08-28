import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import counterReducer from "../features/counter/counterSlice";
import productReducer from "../features/product/productSlice";
import { pokemonApi } from "../services/pokemon";


export const store = configureStore({
    reducer: {
        counter: counterReducer,
        product: productReducer,
        [pokemonApi.reducerPath]: pokemonApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),

});

setupListeners(store.dispatch);