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
    pairAddress: string
    Pool: Contract
}


export type AddOptions = {
    percent?: number
    max?: boolean
    slipage?: number
    deadline?: number
}

export type RemoveOptions = {
    slipage?: number
    deadline?: number
    percent?: number
}

export type ApproveTx = {
    signer: Wallet
    Erc20: Contract
    token: Token
    spender: string
    amount: bigint
}
