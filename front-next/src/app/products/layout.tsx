import { isLogged, logOut } from '@/actions/auth'
import { Inter } from 'next/font/google'
import { Providers } from '../providers'

const inter = Inter({ subsets: ['latin'] })
export default async function RootLayout({
  children,
  details,
  productList,
}: {
  children: React.ReactNode
  details: React.ReactNode
  productList: React.ReactNode
}) {
  const [logged, authData, token] = await isLogged()
  if (!logged && token) {
    logOut()
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers token={token} authData={authData}>
          <main className="flex min-h-screen flex-col items-center p-4 max-w-[1440px] mx-auto mt-5">
            {productList}
            {details}
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
