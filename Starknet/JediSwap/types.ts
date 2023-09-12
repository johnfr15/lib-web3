import { Token, TokenAmount, TradeType } from "l0k_swap-sdk"
import { Uint256, Contract} from "starknet"


export type Pool = {
    Pool: Contract
    token0: Token,
    token1: Token,
    reserve0: Uint256,
    reserve1: Uint256
}

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


