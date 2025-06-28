export type Chain = "ethereum" | "polygon" | "avalanche"

export interface Event {
  id: string
  banner: string
  organizer: string
  date: string
  priceEth: number
  priceMatic: number
  priceAvax: number
  network: Chain
  title: string
}
