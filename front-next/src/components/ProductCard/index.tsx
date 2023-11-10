'use client'
import Image from 'next/image'
import Box from '../Box'
import Card from '../Card'
import Typography from '../Typography'
import { useState } from 'react'
import clsx from 'clsx'
import ColorThief from 'colorthief'
import Badge from '../Badge'
import CommentIcon from '@/icons/Comment'
import { useRouter } from 'next/navigation'

export interface ProductProps {
  id: string
  name: string
  description: string
  bidCount: number
  commentsCount: number
  startPrice: number
  currentPrice: number
  status: 'STARTED' | 'ENDED'
  type: 'NORMAL' | 'BLIND'
  photos: {
    id: string
    url: string
  }[]
}

interface ProdcutCardProps {
  product: ProductProps
}

export default function ProductCard({ product }: ProdcutCardProps) {
  const [color, setColor] = useState<number[]>()
  const router = useRouter()
  return (
    <Card
      key={product.id}
      className="flex flex-col overflow-hidden border border-gray-100 group cursor-pointer"
      onClick={() => {
        router.replace(`/products/${product.id}`, { scroll: false })
      }}
    >
      {product.bidCount > 10 && <Badge text="HOT" color="red" className="absolute left-2 top-2 z-10" />}
      <Box className="flex flex-col gap-y-2 absolute top-2 right-2 items-end">
        <Badge
          color="green"
          text={`Starting at $ ${product.startPrice}`}
          className={clsx('font-bold text-lg z-10', product.bidCount > 0 && 'line-through')}
        />
        {product.bidCount > 0 && (
          <Badge color="blue" text={`Now: $ ${product.currentPrice}`} className="font-bold text-lg z-10" />
        )}
      </Box>
      <Box
        className={clsx('w-full relative h-72 overflow-hidden')}
        style={{
          background: color ? `rgba(${color.join(',')},0.2)` : undefined,
        }}
      >
        <Image
          id={`image-${product.id}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain mix-blend-multiply"
          fill
          alt={`${product.name} image`}
          onLoad={() => {
            const colorThief = new ColorThief()
            const sourceImage = document.querySelector(`#image-${product.id}`)
            const color = colorThief.getColor(sourceImage)
            setColor(color)
          }}
          src={product.photos[0].url}
        />
      </Box>
      <Box className="p-4 flex-col flex items-start gap-y-4">
        <Typography>{product.name}</Typography>
        <Box className="flex flex-row justify-between w-full">
          <Badge text={`${product.bidCount} bid${product.bidCount === 1 ? '' : 's'}`} color="purple" />
          <Box className="flex flex-row gap-x-2 items-center">
            <Typography className="text-lg font-normal">{product.commentsCount}</Typography>
            <CommentIcon width={20} height={20} className="mt-1" />
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
