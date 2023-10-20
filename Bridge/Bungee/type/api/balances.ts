import { AddressLike } from "ethers"

export type Balances = {
    chainId: number,
    address: AddressLike,
    name: string,
    symbol: string,
    decimals: number,
    amount: bigint,
    currency: string
}

export type Balance = {
    chainId: number,
    tokenAddress: string,
    userAddress: string,
    balance: bigint,
    icon: string,
    logoURI: string,
    decimals: number,
    symbol: string,
    name: string
}