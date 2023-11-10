import { useAuth } from '@/providers/auth'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import Box from '../Box'
import Typography from '../Typography'
import { CommentCard } from '../CommentCard'
import TextArea from '../TextArea'

interface CommentsProps {
  comments: Comment[]
}
export function Comments({ comments = [] }: CommentsProps) {
  const { id, token } = useAuth()
  const [loading, setLoading] = useState(false)
  const { productId } = useParams()
  const [text, setText] = useState('')

  const onSubmit = async () => {
    setLoading(true)
    await fetch('/api/comment', {
      method: 'POST',
      headers: {
        Authorization: token!,
      },
      body: JSON.stringify({
        userId: id,
        productId: productId,
        text: text,
      }),
    }).then((res) => {
      return res.json()
    })
    setText('')
    setLoading(false)
  }
  return (
    <Box className="flex flex-col-reverse sm:divide-x mt-5 sm:grid sm:grid-cols-2">
      <Box className="sm:pr-4 max-h-fit overflow-y-auto flex flex-col gap-y-4 pb-10 mt-4">
        {comments.length === 0 && (
          <Box className="text-gray-600 text-center flex items-center justify-center min-h-[100px] flex-col gap-y-4 text-sm">
            <Typography className="font-semibold">No questions yet</Typography>
            <Typography>Be the first to ask something to the seller of this product</Typography>
          </Box>
        )}
        {(comments || []).map((comment) => {
          return (
            <CommentCard
              key={comment.id}
              isNew={comment.isNew}
              text={comment.text}
              name={`${comment.user.firstName} ${comment.user.lastName}`}
              time={comment.createdAt}
            />
          )
        })}
      </Box>
      <Box className="sm:pl-4">
        <TextArea
          disabled={loading}
          onSubmit={() => {
            onSubmit()
          }}
          value={text}
          placeholder="Ask something to the seller"
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
    </Box>
  )
}
