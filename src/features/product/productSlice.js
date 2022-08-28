import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productApi from '../../api/product';

export const fetchAllProduct = createAsyncThunk(
    'products/getAllProduct',
    async () => {
        try {
            return await productApi.getAllProduct();
        }
        catch (err) {
            console.log(err.message);
        }
    }
)

const initialState = {
    value: [],
    status: 'idle',
    error: null,
};

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        updateProduct: (state, action) => {
            console.log(action);
            console.log('update product');
            state.value = state.value.map(product => {
                if (product.id === action.payload.id) {
                    return action.payload;
                }
                return product;
            });
        },
        deleteProduct: (state, action) => {
            state.value = state.value.filter(product => product.id !== action.payload);
        },
        filterProduct: (state, action) => {
            state.value = state.value.filter(product => product.name.includes(action.payload));
        },
        findProduct: (state, action) => {
            state.value = state.value.filter(product => product.id === action.payload);
        },
        addProduct: (state, action) => {
            state.value = [...state.value, action.payload];
        },
        allProduct: (state, action) => {
            state.value = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllProduct.pending, (state, action) => {
            state.status = 'loading';
        })
            .addCase(fetchAllProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.value = action.payload;
            })
            .addCase(fetchAllProduct.rejected, (state, action) => {
                alert('error');
                state.status = 'failed';
                state.error = action.error.message;
            })

    }
});

export const selectAllProduct = (state) => state.product.value;
export const getAllProductStatus = (state) => state.product.status;
export const getAllProductError = (state) => state.product.error;
export const { updateProduct, deleteProduct, addProduct, filterProduct, findProduct } = productSlice.actions;
export default productSlice.reducer;