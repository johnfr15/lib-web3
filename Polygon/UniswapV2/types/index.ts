import { Pair } from "@uniswap/sdk";
import { Pool} from "@uniswap/v3-sdk";
import { Contract, Wallet } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { SwapRoute } from "@uniswap/smart-order-router";


export type PoolInfo = {
    token0: Token
    token1: Token
    pool: Pool
    poolAddress: string
    PoolContract: Contract
}
export type TokenJSON = {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
}

export type ApproveTx = {
    Erc20: Contract, 
    spender: string, 
    amount: bigint,
    decimals: number
    network: 'TESTNET' | 'MAINNET' 
}

export type SwapTx = {
    signer: Wallet
    trade: SwapRoute
    path: [string, string]
    slipage: number
    deadline: number
    network: 'TESTNET' | 'MAINNET' 
    Router: Contract
}

export type AddLiquidityTx = {
    signer: Wallet
    pool: Pair
    tokenA: Token
    tokenB: Token
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
    network: 'TESTNET' | 'MAINNET' 
    Router: Contract
}

export type RemoveLiquidityTx = {
    signer: Wallet
    pool: Pair
    balanceLp: any
    liquidity: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
    stable: boolean
    percent: number
    network: 'TESTNET' | 'MAINNET'
    Router: Contract
}

export type SwapExactETHForTokens = {
    amountOutMin: bigint
    path: string[] 
    to: string
    deadline: number
}

export type SwapETHForExactTokens = {
    amountOut: bigint
    path: string[] 
    to: string
    deadline: number
}

export type SwapExactTokensForETH = {
    amountIn: bigint
    amountOutMin: bigint 
    path: string[] 
    to: string
    deadline: number
}

export type SwapTokensForExactETH = {
    amountOut: bigint
    amountInMax: bigint 
    path: string[] 
    to: string
    deadline: number
}

export type SwapExactTokensForTokens = {
    amountIn: bigint
    amountOutMin: bigint 
    path: string[] 
    to: string
    deadline: number
}

export type SwapTokensForExactTokens = {
    amountOut: bigint
    amountInMax: bigint 
    path: string[] 
    to: string
    deadline: number
}

export type AddLiquidity = {
    tokenA: string,
    tokenB: string,
    amountADesired: bigint,
    amountBDesired: bigint,
    amountAMin: bigint,
    amountBMin: bigint,
    to: string,
    deadline: number
}

export type AddLiquidityETH = {
    token: string,
    amountTokenDesired: bigint,
    amountTokenMin: bigint,
    amountETHMin: bigint,
    to: string,
    deadline: number
}

export type RemoveLiquidity = {
    tokenA: string
    tokenB: string
    liquidity: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
}

export type RemoveLiquidityETH = {
    token: string
    liquidity: bigint
    amountTokenMin: bigint
    amountETHMin: bigint
    to: string
    deadline: number
}