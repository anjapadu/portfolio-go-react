'use server'
import { cookies } from 'next/headers'

export async function logIn(token: string) {
  cookies().set('AUTH', token, {
    secure: true,
  })
}

export async function logOut() {
  cookies().delete('AUTH')
}

export async function isLogged() {
  const token = cookies().get('AUTH')?.value
  if (!token) {
    return [!!token, null]
  }
  const isValid = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/validate`, {
    headers: {
      Authorization: token,
    },
  }).then((res) => res.json())
  if (isValid.error) {
    return [false, null]
  }
  if (isValid) {
    return [!!token, isValid, token]
  }
  return [false, null]
}
