'use client'

import { ProductProps } from '@/components/ProductCard'
import React, { useEffect } from 'react'
import { mutate } from 'swr'

export default function Listener() {
  useEffect(() => {
    const stream = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/api/price-update`)
    stream.addEventListener('message', function (e) {
      const [productId, jsonString] = e.data.split('|')
      mutate(
        '/products',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (products: any) => {
          return products.map((p: ProductProps) => {
            if (p.id === productId) {
              return {
                ...p,
                ...JSON.parse(jsonString),
              }
            } else {
              return p
            }
          })
        },
        false
      )
    })
    return () => {
      stream.close()
    }
  }, [])
  return <React.Fragment />
}
