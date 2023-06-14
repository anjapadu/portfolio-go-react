'use client';

import { ProductProps } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import React, { useEffect } from 'react';
import { mutate } from 'swr';

export default function Listener() {
  const { setProducts } = useProducts();
  useEffect(() => {
    const stream = new EventSource('http://localhost:4000/api/price-update');
    stream.addEventListener('message', function (e) {
      const [productId, jsonString] = e.data.split('|');
      mutate(
        '/products',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (products: any) => {
          return products.map((p: ProductProps) => {
            if (p.id === productId) {
              return {
                ...p,
                ...JSON.parse(jsonString),
              };
            } else {
              return p;
            }
          });
        },
        false
      );
    });
    return () => {
      stream.close();
    };
  }, [setProducts]);
  return <React.Fragment />;
}
