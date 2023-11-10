'use client'
import Box from '@/components/Box'
import Listener from '../../../components/Listener'
import ProductCard, { ProductProps } from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'

export default function ProductList() {
  const { data: products } = useProducts()
  return (
    <div className="flex min-h-screen flex-col items-center sm:p-4 max-w-[1440px] mt-0 w-full sm:w-auto">
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
        {!!products &&
          products.map((product: ProductProps) => {
            return <ProductCard key={product.id} product={product} />
          })}
      </Box>
      <Listener />
    </div>
  )
}
