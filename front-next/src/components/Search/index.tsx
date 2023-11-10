import { useEffect, useState } from 'react'
import { CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import { ProductSimple, useProductSearch } from '@/hooks/useProductSearch'
import clsx from 'clsx'
import { useParams, useRouter } from 'next/navigation'

const LoadingIcon = () => (
  <svg
    className="animate-spin h-5 w-5 text-gray-400"
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
)

export default function Search() {
  const router = useRouter()
  const { productId } = useParams()
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>()
  const [searchValue, setSearchValue] = useState('')
  const [query, setQuery] = useState('')
  const { data: products, isLoading } = useProductSearch(query)
  useEffect(() => {
    if (!searchValue && query) {
      if (searchDebounce) {
        clearTimeout(searchDebounce)
      }
      setQuery('')
    }
    if (searchValue && query !== searchValue.trim()) {
      if (searchDebounce) {
        clearTimeout(searchDebounce)
      }
      const timeout = setTimeout(() => {
        setQuery(searchValue)
      }, 700)
      setSearchDebounce(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  useEffect(() => {
    if (!productId) {
      setSearchValue('')
    }
  }, [productId])

  const [selectedPerson, setSelectedPerson] = useState(null)
  const filteredProducts =
    query === ''
      ? []
      : (products || []).filter((product) => {
          return product.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setSearchValue(event.target.value)}
          displayValue={(product: ProductSimple) => product?.name}
          autoComplete="off"
          value={searchValue}
        />
        <Combobox.Button
          aria-disabled="true"
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none cursor-default"
        >
          {isLoading ? <LoadingIcon /> : <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
        </Combobox.Button>
        {filteredProducts.length === 0 && query?.length > 0 && !isLoading && (
          <Combobox.Options className="absolute z-20 mt-1 max-h-20 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <Combobox.Option
              value=""
              unselectable="on"
              className={({ active }) =>
                clsx(
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                  active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                )
              }
            >
              <span className={clsx('block truncate', 'text-center')}>No products where found</span>
            </Combobox.Option>
          </Combobox.Options>
        )}
        {filteredProducts.length > 0 && !isLoading && (
          <Combobox.Options className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredProducts.map((product) => (
              <Combobox.Option
                key={product.id}
                value={product}
                onClick={() => {
                  router.push(`/products/${product.id}`, { scroll: false })
                  setSearchValue(product.name)
                }}
                className={({ active }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={clsx('block truncate', selected && 'font-semibold')}>{product.name}</span>

                    {selected && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
