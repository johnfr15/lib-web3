import { AddressLike } from "ethers"

export type Balance = {
    chainId: number,
    address: AddressLike,
    name: string,
    symbol: string,
    decimals: number,
    amount: bigint,
    currency: string
}