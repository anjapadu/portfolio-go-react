import { ProductProps } from '@/components/ProductCard'
import useSWR from 'swr/immutable'

export type ProductSimple = Pick<ProductProps, 'name' | 'id'> & { photo: string }
export const useProductSearch = (search: string) => {
  return useSWR<ProductSimple[]>(
    `products-simple?search=${search}`,
    search ? () => fetch(`/api/products-simple?search=${search}`).then((res) => res.json()) : null
  )
}
