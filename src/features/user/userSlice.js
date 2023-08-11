import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { BASE_URL } from '../../utils/constans';


export const createUser = createAsyncThunk('users/createUser', async (payload, thunkAPI) => {
	try {
		const res = await axios.post(`${BASE_URL}/users`, payload);
		return res.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const updateUser = createAsyncThunk('users/updateUser', async (payload, thunkAPI) => {
	try {
		const res = await axios.put(`${BASE_URL}/users/${payload.id}`, payload);
		return res.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

export const loginUser = createAsyncThunk('users/loginUser', async (payload, thunkAPI) => {
	try {
		const res = await axios.post(`${BASE_URL}/auth/login`, payload);
		const loginData = await axios(`${BASE_URL}/auth/profile`, {
			headers: {
				"Authorization": `Bearer ${res.data.access_token}`
			}
		});
		return loginData.data;
	} catch (error) {
		return thunkAPI.rejectWithValue(error);
	}
});

const addCurrentUser = (state, { payload }) => {
	state.currentUser = payload;
};

const userSlice = createSlice({
	name: 'user',
	initialState: {
		currentUser: null,
		cart: [],
		favourite: [],
		isLoading: false,
		formType: 'signup',
		showForm: false,
	},
	reducers: {
		addItemToCart: (state, { payload }) => {
			let newCart = [...state.cart];
			const found = state.cart.find(({ id }) => id === payload.id);

			if (found) {
				newCart = newCart.map((item) => {
					return item.id === payload.id ?
						{ ...item, quantity: payload.quantity || item.quantity + 1 }
						: item;
				});
			} else newCart.push({ ...payload, quantity: 1 });

			state.cart = newCart;
		},
		addItemToFavourites: (state, { payload }) => {
			let newFavourite = [...state.favourite];
			const found = state.favourite.find(({ id }) => id === payload.id);

			if (found) {
				newFavourite = state.favourite.filter(({ id }) => id !== payload.id);
			} else newFavourite.push({ ...payload });

			state.favourite = newFavourite;
		},
		removeItemFromCart:(state, {payload}) =>{
			state.cart = state.cart.filter(({id}) => id !== payload);
		},
		removeItemFromFavourites:(state, {payload}) =>{
			state.favourite = state.favourite.filter(({id}) => id !== payload);
		},
		toggleForm: (state, { payload }) => {
			state.showForm = payload;
		},
		changeFormType: (state, { payload }) => {
			state.formType = payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(createUser.fulfilled, addCurrentUser);
		builder.addCase(loginUser.fulfilled, addCurrentUser);
		builder.addCase(updateUser.fulfilled, addCurrentUser);
	}
});

export const { addItemToCart, addItemToFavourites,removeItemFromCart,removeItemFromFavourites, toggleForm, changeFormType } = userSlice.actions;
export default userSlice.reducer;