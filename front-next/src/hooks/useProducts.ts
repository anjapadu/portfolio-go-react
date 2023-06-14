'use client';
import { ProductProps } from '@/components/ProductCard';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export interface ProductsContextType {
  products: ProductProps[];
  setProducts: Dispatch<SetStateAction<ProductProps[]>>;
}

export const ProductsContext = createContext<ProductsContextType>({
  products: [],
  setProducts: () => {
    /**/
  },
});

export function useProducts(): ProductsContextType {
  return useContext(ProductsContext);
}
