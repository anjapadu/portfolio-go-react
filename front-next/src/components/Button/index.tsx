import { ButtonHTMLAttributes } from 'react'
import { Colors } from '../Badge'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  color?: Colors
  isLoading?: boolean
}

export default function Button({ text, color = 'green', className, isLoading, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={isLoading}
      className={clsx(
        className,
        `flex justify-center cursor-pointer rounded-md bg-${color}-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-${color}-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}-600`,
        isLoading && `bg-${color}-700 pointer-events-none`
      )}
      {...rest}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        text
      )}
    </button>
  )
}
