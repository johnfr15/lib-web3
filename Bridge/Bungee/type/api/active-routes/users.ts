import { AddressLike } from "ethers"

export type UsersOptions = {
// Sort param for routes.
sort?: "updatedAt" | "createdAt",
// Offset for fetching active routes.
offset?: string,
// Number of active routes to return in one API call.
limit?: string
// Status of the route. The route will only be marked completed if all the user txs have been completed.
routeStatus?: 'READY' | 'PENDING' | 'COMPLETED' | 'FAILED'
// Id of sending chain
fromChainId?: string
// Id of destination chain.
toChainId?: string
// Address of token on source chain.
fromTokenAddress?: AddressLike
// Token address on destination chain.
toTokenAddress?: AddressLike
}