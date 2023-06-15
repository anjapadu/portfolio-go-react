import { isLogged, logOut } from '@/actions/auth'
import Navigation from './@Navigation/page'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import ProductList from './@ProductList/page'
import ProductDetails from './@ProductDetails/page'

const inter = Inter({ subsets: ['latin'] })
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [logged, authData, token] = await isLogged()

  if (!logged && token) {
    logOut()
  }
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation isLogged={logged} name={authData?.fullName} email={authData?.email} />
        <Providers token={token} authData={authData}>
          <main className="flex min-h-screen flex-col items-center p-4 max-w-[1440px] mx-auto mt-5">
            <ProductList />
            <ProductDetails />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
