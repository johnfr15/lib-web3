import { JSBI } from "l0k_swap-sdk"
import { Calldata, Uint256, Account} from "starknet"


export type SwapArgs = {
    amountIn:  Uint256,
    amountOut: Uint256,
    pathLenght: number, 
    path: string[],
    to: string, 
    deadline: number,
}

export type ApproveCallData = {
    contractAddress: string,
    entrypoint: string,
    calldata: [ string, Uint256 ] 
}

export type SwapCallData = {
    contractAddress: string,
    entrypoint: string,
    calldata: Array<SwapArgs[keyof SwapArgs]>
    utils: { [key: string]: any }
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


