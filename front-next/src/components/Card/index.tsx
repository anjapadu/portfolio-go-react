import { PropsWithChildren } from 'react'
import Box from '../Box/Box'
import clsx from 'clsx'

interface CardProps extends PropsWithChildren {
  className?: string
  onClick?: () => void
}

export default function Card({ children, className, onClick }: CardProps) {
  return (
    <Box className={clsx('drop-shadow-lg bg-white rounded-md', className)} onClick={onClick}>
      {children}
    </Box>
  )
}
