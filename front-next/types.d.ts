declare module 'colorthief'
declare module 'react-simple-snackbar'
interface User {
  firstName: string
  lastName: string
}
interface Comment {
  id: string
  user: User
  text: string
  createdAt: string
  isNew?: boolean
}
interface CommentCardProps {
  text: string
  name: string
  time: string
  isNew?: boolean
}
