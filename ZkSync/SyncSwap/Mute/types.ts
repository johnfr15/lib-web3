import { Contract } from "ethers"

export type Token = {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
}

export type Pool = {
    tokenA: Token
    tokenB: Token
    pair: string
    reserveA: bigint
    reserveB: bigint
    fee: bigint
}

export type Trade = {
    path: [string, string]
    tokenFrom: Token
    tokenTo: Token
    pool: Pool
    amountIn: bigint
    amountOut: bigint
    amountOutMin: bigint
    priceImpact: number
    deadline: number
    network: 'TESTNET' | 'MAINNET'
}

export declare enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT
}

export type ApproveTx = {
    Erc20: Contract, 
    spender: string, 
    amount: bigint, 
    network: 'TESTNET' | 'MAINNET' 
}
export type AddLiquidity = {
    tokenA: Token
    tokenB: Token
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
    feeType: number
    stable: boolean
    network: 'TESTNET' | 'MAINNET' 
}

export type RemoveLiquidity = {
    tokenA: Token,
    tokenB: Token,
    lp: Token,
    balanceLp: any,
    liquidity: bigint,
    amountAMin: bigint,
    amountBMin: bigint,
    to: string,
    deadline: number,
    stable: boolean,
    percent: number,
    network: 'TESTNET' | 'MAINNET' 
}