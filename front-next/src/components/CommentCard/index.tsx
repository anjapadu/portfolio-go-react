'use client'
import { useState } from 'react'
import { useEffectOnce } from 'usehooks-ts'
import Card from '../Card'
import Box from '../Box'
import Typography from '../Typography'
import { formatRelative } from 'date-fns'
import clsx from 'clsx'

export function CommentCard({ text, name, time, isNew }: CommentCardProps) {
  const [showHighlight, setShowHighlight] = useState(isNew)
  useEffectOnce(() => {
    setTimeout(() => {
      setShowHighlight(false)
    }, 2000)
  })
  return (
    <Card
      className={clsx(
        'p-2 text-sm flex flex-col gap-y-2 transition-colors duration-300',
        showHighlight && 'bg-yellow-100'
      )}
    >
      <Box className="flex justify-between items-center">
        <Typography className="font-semibold text-indigo-800 text-xs">{name}</Typography>
        <Typography className="text-gray-400 font-medium text-xs">
          {formatRelative(Date.parse(time), new Date())}
        </Typography>
      </Box>
      <Typography className="text-xs">{text}</Typography>
    </Card>
  )
}
