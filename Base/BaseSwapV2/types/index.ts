import { Contract, Wallet } from "ethers"

export type Token = {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
}

export type Balance = {
    bigint: bigint
    string: string,
    decimals: number
}

export type Pool = {
    tokenX: Token
    tokenY: Token
    reserveX: bigint
    reserveY: bigint
    poolAddress: string
    Pool: Contract
}

export enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT
}

export type ApproveTx = {
    signer: Wallet
    Erc20: Contract
    token: Token
    spender: string
    amount: bigint
}
