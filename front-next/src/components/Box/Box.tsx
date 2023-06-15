import { HTMLAttributes } from 'react'

type BoxProps = HTMLAttributes<HTMLDivElement>
export default function Box({ children, ...rest }: BoxProps) {
  return <div {...rest}>{children}</div>
}
