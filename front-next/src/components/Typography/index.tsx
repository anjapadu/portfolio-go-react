import { HTMLAttributes } from 'react'

type TypographyProps = HTMLAttributes<HTMLSpanElement>
export default function Typography({ children, ...rest }: TypographyProps) {
  return <span {...rest}>{children}</span>
}
