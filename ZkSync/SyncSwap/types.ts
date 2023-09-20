import { Contract } from "ethers"

export type TokenInput = {
    token: string
    amount: bigint
}

export type SwapStep = {
    pool: string // The pool of the step.
    data: string // The data to execute swap with the pool.
    callback: string // Address of another smat contract to call after the swap
    callbackData: string // Arguments (encoded) to pass to the other smat contract to call after the swap
}

export type SwapPath = {
    steps: SwapStep[] ; // Steps of the path.
    tokenIn: string // The input token of the path.
    amountIn: bigint; // The input token amount of the path.
}

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
}

export type Trade = {
    path: [string, string]
    paths: SwapPath[]
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

export enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT
}

export enum WithdrawMode {
    VAULT_INTERNAL_TRANSFER,
    WITHDRAW_AND_UNWRAP_TO_NATIVE_ETH,
    WITHDRAW_AND_WRAP_TO_WETH,
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