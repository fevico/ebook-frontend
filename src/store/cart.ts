import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Book } from "../components/BookDetails";
import { RootState } from ".";

export type cartItem =
  | {
      product: Book;
      quantity: number;
    }
  | CartItemApi;

export interface CartItemApi {
    quantity: number;
    product: {
      id: string;
      title: string;
      slug: string;
      cover?: string;
      price: {
        mrp: string;
        sale: string;
      };
    };
  }
  export interface CartState {
    id?: string;
    items: cartItem[];
  }
  
  const initialState: CartState = {
    items: [],
  };

const slice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        updateCartId(state, {payload}: PayloadAction<string>){
            state.id = payload;
        },
        updateCartState(state, {payload}: PayloadAction<CartState>){
            state.id = payload.id;
            state.items = payload.items;
        },
        updateCartItems(state, {payload}: PayloadAction<cartItem>){
          const index = state.items.findIndex((item) =>item.product.id === payload.product.id)
        //   if no product found update cart items with new product
          if(index === -1){
            state.items.push(payload);    
        }else{
            // if product is found update the quantity
            state.items[index].quantity += payload.quantity;
            if(state.items[index].quantity <= 0){
                // if quantity is 0 remove product from cart 
                state.items.splice(index, 1);
            }
        }
    }
    }
})

export const getCartState = createSelector((state: RootState) => state, ({cart}) => {
    return {
        totalCount: cart.items.reduce((total, item) => {
            total += item.quantity;
            return total;
        },0),
        subtotal: cart.items.reduce((total, item) => {
            total += Number(item.product.price.mrp) * item.quantity;
            return total;
        },0),
        total: cart.items.reduce((total, item) => {
            total += Number(item.product.price.sale) * item.quantity;
            return total;
        },0),
        ...cart
    };
})

export const {updateCartId, updateCartState, updateCartItems} = slice.actions;

export default slice.reducer;