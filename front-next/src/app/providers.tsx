'use client'
import AuthProvider, { AuthContextType } from '@/providers/auth'
import { PropsWithChildren } from 'react'
import SnackbarProvider from 'react-simple-snackbar'

interface ProvidersProps extends PropsWithChildren {
  token?: string
  authData?: AuthContextType
}
export function Providers({ children, token, authData }: ProvidersProps) {
  return (
    <SnackbarProvider>
      <AuthProvider token={token} authData={authData}>
        {children}
      </AuthProvider>
    </SnackbarProvider>
  )
}
