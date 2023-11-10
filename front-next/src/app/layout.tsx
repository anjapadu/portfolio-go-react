import { isLogged } from '@/actions/auth'
import Navigation from '@/components/Navigation'
import '../globals.css'
export const metadata = {
  title: 'Auction House',
}
import { Black_Ops_One } from 'next/font/google'
import clsx from 'clsx'

const blackOps = Black_Ops_One({
  subsets: ['latin'],
  weight: '400',
})
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [logged, authData] = await isLogged()

  return (
    <html lang="en">
      <body>
        <Navigation isLogged={logged} name={authData?.fullName} email={authData?.email} />
        <div className="bg-lime-300 h-40 text-center max-w-[1440px] m-auto flex items-center justify-center mt-8">
          <h1 className={clsx(blackOps.className, 'text-[60px]')}>BID TO WIN!</h1>
        </div>
        {children}
      </body>
    </html>
  )
}
