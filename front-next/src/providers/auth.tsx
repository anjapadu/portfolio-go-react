'use client';
import { ReactNode, createContext, useContext, useState } from 'react';

export interface AuthContextType {
  token?: string;
  fullName?: string;
  email?: string;
  id?: string;
}

const AuthContext = createContext<AuthContextType>({
  token: undefined,
  fullName: undefined,
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export default function AuthProvider({
  children,
  token,
  authData,
}: {
  children: ReactNode;
  token?: string;
  authData?: AuthContextType;
}) {
  return <AuthContext.Provider value={{ token, ...authData }}>{children}</AuthContext.Provider>;
}
