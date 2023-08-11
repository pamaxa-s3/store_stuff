import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { BASE_URL } from '../../utils/constans';
import { shuffle } from '../../utils/common';


export const getProducts = createAsyncThunk('products/getProducts', async (_, thunkAPI) => {
	try {
		const res = await axios(`${BASE_URL}/products`);
	
		return res.data;
	} catch (error) {
		console.log(error);
		return thunkAPI.rejectWithValue(error);
	}
});

const productsSlice = createSlice({
	name: 'products',
	initialState: {
		list: [],
		filtered: [],
		related: [],
		favourites: [],
		isLoading: false,
	},
	reducers:{
		filteredByPrice: (state, {payload}) => {
			state.filtered = state.list.filter(({price}) => price < payload);
		},
		getRelatedProducts: (state, {payload}) => {
			const list  = state.list.filter(({category: {id}}) => id === payload);
			state.related = shuffle(list);
		},
		getFavouritedProducts: (state, {payload}) => {
			// state.favourites = 
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getProducts.pending, (state) => {
			state.isLoading = true;
		});

		builder.addCase(getProducts.fulfilled, (state, { payload }) => {
			state.list = payload;
			state.isLoading = false;
		});

		builder.addCase(getProducts.rejected, (state) => {
			state.isLoading = false;
		});
	}
});

export const {filteredByPrice, getRelatedProducts} = productsSlice.actions;

export default productsSlice.reducer;