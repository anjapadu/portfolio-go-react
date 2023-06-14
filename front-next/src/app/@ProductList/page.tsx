'use client';
import Box from '@/components/Box/Box';
import ProductDetails from '../@ProductDetails/page';
import Listener from '../@Listener/page';
import useSWR from 'swr/immutable';
import ProductCard, { ProductProps } from '@/components/ProductCard';

const getProducts = async () => {
  const res = await fetch('/api/products', {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

export default function ProductList() {
  const { data: products } = useSWR<ProductProps[]>('/products', async () => await getProducts());
  return (
    <main className="flex min-h-screen flex-col items-center sm:p-4 max-w-[1440px] mt-5 w-full sm:w-auto">
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
        {!!products &&
          products.map((product: ProductProps) => {
            return <ProductCard key={product.id} product={product} />;
          })}
      </Box>
      <Listener />
    </main>
  );
}
