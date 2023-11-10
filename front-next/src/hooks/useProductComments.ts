import useSWR from 'swr'

export const useProductComments = (productId: string) => {
  return useSWR<Comment[]>(
    `product/${productId}/comments`,
    productId ? () => fetch(`/api/product/${productId}/comments`).then((res) => res.json()) : null
  )
}
