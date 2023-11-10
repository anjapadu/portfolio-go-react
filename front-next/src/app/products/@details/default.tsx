'use client'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter, useParams } from 'next/navigation'
import Box from '@/components/Box'
import Image from 'next/image'
import { ProductProps } from '@/components/ProductCard'
import Typography from '@/components/Typography'
import clsx from 'clsx'
import Button from '@/components/Button'
import { useSnackbar } from 'react-simple-snackbar'
import { useAuth } from '@/providers/auth'
import LoginButton from '@/components/LoginButton'
import { ArrowUpIcon } from '@heroicons/react/20/solid'
import { useProductDetails } from '@/hooks/useProductDetails'
import { useProductComments } from '@/hooks/useProductComments'
import { Comments } from '@/components/Comments'

export default function ProductDetails() {
  const { productId } = useParams()
  const router = useRouter()
  const { token, id: userId } = useAuth()
  const [bidding] = useState()
  const [openSnackbar] = useSnackbar({
    style: {
      zIndex: 100,
    },
  })
  const isOpen = !!productId
  const onClose = () => {
    router.push('/products', { scroll: false })
  }
  const { data, isLoading, mutate } = useProductDetails(productId as string)
  const { data: comments, mutate: mutateComments } = useProductComments(productId as string)
  const submitBid = (price: number) => {
    fetch(`/api/bid/${productId}`, {
      method: 'POST',
      headers: {
        Authorization: token!,
      },
      body: JSON.stringify({ newPrice: parseFloat(price.toFixed(2)) }),
    })
  }
  useEffect(() => {
    if (!productId) return
    const stream = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/api/stream/product/${productId}`)
    stream.addEventListener('message', function (e) {
      const obj = JSON.parse(e.data.split('|')[1])
      if (obj.isComment) {
        mutateComments((d) => [{ ...obj, isNew: true }, ...d!], false)
      } else {
        mutate(
          (d) => ({
            ...d!,
            currentPrice: obj.newPrice,
            bidCount: obj.bidCount,
          }),
          false
        )
        openSnackbar(
          obj.userId === userId
            ? 'You have submitted an offer for this product'
            : `A user has submitted a new ofer for ${obj.newPrice}`,
          10000
        )
      }
    })
    return () => {
      stream.close()
    }
  }, [productId]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => onClose && onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full md:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-screen md:max-w-[calc(75vw)] lg:max-w-[calc(50vw)]">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          {(data as ProductProps)?.name}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => onClose && onClose()}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {!isLoading && data && (
                        <>
                          <Box className="h-[300px] relative">
                            <Image
                              src={(data as ProductProps).photos[0].url}
                              fill
                              alt="product image"
                              className="object-contain"
                            />
                          </Box>
                          <Box className="mt-5">
                            <Typography className="text-sm">{data.description}</Typography>
                          </Box>
                          <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-2 md:divide-x md:divide-y-0">
                            <div className="px-4 py-5 sm:p-6">
                              <dt className="text-base font-medium text-gray-900">Current price</dt>
                              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                                  {data.currentPrice}
                                  <span className="ml-2 text-sm font-medium text-gray-500">from {data.startPrice}</span>
                                </div>

                                <div
                                  className={clsx(
                                    'bg-green-100 text-green-800',
                                    'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
                                  )}
                                >
                                  <ArrowUpIcon
                                    className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                                    aria-hidden="true"
                                  />
                                  <span className="sr-only"> Increased by </span>
                                  {((data.currentPrice / data.startPrice) * 100 - 100).toFixed(0)}%
                                </div>
                              </dd>
                            </div>
                            <div className="px-4 py-5 sm:p-6">
                              <dt className="text-base font-medium text-gray-900">Total offers</dt>
                              <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                                <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                                  {data.bidCount}
                                  <span className="ml-2 text-sm font-medium text-gray-500">from other users</span>
                                </div>
                              </dd>
                            </div>
                          </dl>
                          <Box className="flex gap-x-5 mt-5 justify-end">
                            <LoginButton loginButtonText="Log in to bid">
                              <Button
                                text={`Offer ${(data.currentPrice * 1.05).toFixed(2)}`}
                                onClick={() => submitBid(data.currentPrice * 1.05)}
                                disabled={bidding}
                              />
                              <Button
                                text={`Offer ${(data.currentPrice * 1.1).toFixed(2)}`}
                                onClick={() => submitBid(data.currentPrice * 1.1)}
                                disabled={bidding}
                              />
                              <Button
                                text={`Offer ${(data.currentPrice * 1.15).toFixed(2)}`}
                                onClick={() => submitBid(data.currentPrice * 1.15)}
                                disabled={bidding}
                              />
                            </LoginButton>
                          </Box>
                        </>
                      )}
                      {comments && <Comments comments={comments} />}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
