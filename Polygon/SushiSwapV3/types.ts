import { Contract, Wallet } from "ethers"

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
    fees: Fees
    tickSpacing: number,
    liquidity: bigint,
    sqrtPriceX96: bigint,
    tick: bigint,
    Quoter: Contract
    Pool: Contract
}

export type Trade = {
    tokenIn: Token
    tokenOut: Token
    path: [string, string]
    amountIn: bigint
    amountOut: bigint
    amountInMax: bigint | undefined
    amountOutMin: bigint | undefined
    sqrtPriceLimitX96: bigint
    to: string
    priceImpact: number
    pool: Pool
    slipage: number
    deadline: number
    chain: Chains
    tradeType: number
}

export enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT
}

export enum Fees {
    SMALL = 500,
    MEDIUM = 3000,
    BIG = 10000
}

export type BridgeOptions = {
    max?: boolean
    slipage?: number
    deadline?: number
    chain?: Chains
}

export type Chains = 'arbitrum' | 'polygon' | 'optimism' | 'ethereum' | 'avalanche' | 'bsc' | 'polygonTestnet' | 'arbitrumTestnet' |
                     'avalancheTestnet' | 'ethereumTestnet'

export type ApproveTx = {
    signer: Wallet
    Erc20: Contract
    token: Token
    chain: Chains
    spender: string
    amount: bigint
}

export type SwapTx = {
    signer: Wallet
    trade: Trade
    SwapRouter: Contract
}

export type AddLiquidityTx = {
    signer: Wallet
    pool: Pool
    tokenA: Token
    tokenB: Token
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
    network: 'TESTNET' | 'MAINNET' 
}

export type RemoveLiquidityTx = {
    signer: Wallet
    pool: Pool
    tokenA: Token,
    tokenB: Token,
    lp: string,
    balanceLp: any,
    liquidity: bigint,
    amountAMin: bigint,
    amountBMin: bigint,
    to: string,
    deadline: number,
    percent: number,
    network: 'TESTNET' | 'MAINNET'
}

export type ExactInput = {
    path: string
    recipient: string
    deadline: number
    amountIn: bigint
    amountOutMinimum: bigint
}

export type ExactOutput = {
    path: string
    recipient: string
    deadline: number
    amountOut: bigint
    amountInMaximum: bigint
}

export type ExactInputSingle = {
    tokenIn: string
    tokenOut: string
    fee: number
    recipient: string
    deadline: number
    amountIn: bigint
    amountOutMinimum: bigint
    sqrtPriceLimitX96: bigint
}

export type ExactOutputSingle = {
    tokenIn: string
    tokenOut: string
    fee: number
    recipient: string
    deadline: number
    amountOut: bigint
    amountInMaximum: bigint
    sqrtPriceLimitX96: bigint
}

export type Mint = {
    token0: bigint
    token1: bigint
    fee: bigint
    tickLower: bigint
    tickUpper: bigint
    amount0Desired: bigint
    amount1Desired: bigint
    amount0Min: bigint
    amount1Min: bigint
    recipient: bigint
    deadline: bigint
}

export type IncreaseLiquidity = {
    tokenId: bigint
    amount0Desired: bigint
    amount1Desired: bigint
    amount0Min: bigint
    amount1Min: bigint
    deadline: bigint
}

export type DecreaseLiquidity = {
    tokenId: bigint
    liquidity: bigint
    amount0Min: bigint
    amount1Min: bigint
    deadline: bigint
}


// QuoterV2

export type QuoteExactInputSingleParams = {
    tokenIn: string
    tokenOut: string
    amountIn: bigint
    fee: number
    sqrtPriceLimitX96: bigint
}

export type QuoteExactOutputSingleParams = {
    tokenIn: string
    tokenOut: string
    amount: bigint
    fee: number
    sqrtPriceLimitX96: bigint
}