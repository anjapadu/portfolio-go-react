import { ProductProps } from '@/components/ProductCard'
import useSWR from 'swr'

export const useProductDetails = (productId: string) => {
  return useSWR<ProductProps>(
    `product/${productId}`,
    productId ? () => fetch(`/api/product/${productId}`).then((res) => res.json()) : null
  )
}
