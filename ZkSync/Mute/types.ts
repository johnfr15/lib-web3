
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
    tokenFrom: Token
    tokenTo: Token
    pool: Pool
    amountIn: bigint
    amountOut: bigint
    amountOutMin: bigint
    priceImpact: number
    deadline: number
}

export declare enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT
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
}
/*
export type Trade = {
    amountIn: TokenAmount
    amountInMax: Uint256 | null
    amountOut: TokenAmount
    amountOutMin: Uint256 | null
    tradeType: TradeType
    priceImpact: number
}



export type ApproveCallData = {
    contractAddress: string,
    entrypoint: string,
    calldata: [ string, Uint256 ] 
}



export type SwapArgs = {
    amountIn:  Uint256,
    amountOut: Uint256,
    pathLenght: number, 
    path: string[],
    to: string, 
    deadline: number,
}

export type SwapCallData = {
    contractAddress: string,
    entrypoint: string,
    calldata: Array<SwapArgs[keyof SwapArgs]>
}



export type AddLiquidityABI = {
    tokenA: string,
    tokenB: string,
    amountADesired: Uint256,
    amountBDesired: Uint256,
    amountAMin: Uint256,
    amountBMin: Uint256,
    to: string,
    deadline: number
}

export type AddLiquidityTx = {
    contractAddress: string,
    entrypoint: string,
    calldata: Array<AddLiquidityABI[keyof AddLiquidityABI]>
}

export type AddLiquidityCallData = {
    addLiquidityTx: AddLiquidityTx,
    utils: { [key: string]: any }
}



export type RemoveLiquidityABI = {
    tokenA: string,
    tokenB: string,
    liquidity: Uint256,
    amountAMin: Uint256,
    amountBMin: Uint256,
    to: string, 
    deadline: number,
}

export type RemoveLiquidityTx = {
    contractAddress: string,
    entrypoint: string,
    calldata: Array<AddLiquidityABI[keyof AddLiquidityABI]>
}

export type RemoveLiquidityCallData = {
    removeLiquidityTx: RemoveLiquidityTx
    utils: { [key: string]: any }
}


*/