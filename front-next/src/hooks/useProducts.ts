import { ProductProps } from '@/components/ProductCard'
import useSWR from 'swr'

const getProducts = async () => {
  const res = await fetch('/api/products', {
    cache: 'no-cache',
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export const useProducts = () => {
  return useSWR<ProductProps[]>('/products', async () => await getProducts())
}
