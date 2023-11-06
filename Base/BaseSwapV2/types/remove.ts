import { Contract, Wallet } from "ethers"
import { Balance, Pool, Token } from "."

export type RemoveOptions = {
    slipage?: number
    deadline?: number
    percent?: number
}

export type RemoveLiquidityTx = {
    signer: Wallet
    pool: Pool
    lp: Token
    balanceLp: Balance
    tokenX: Token
    tokenY: Token
    liquidity: bigint
    amountX: bigint
    amountY: bigint
    amountXMin: bigint
    amountYMin: bigint
    deadline: number
    percent: number
    Router: Contract
}

export type RemoveLiquidityETH = {
    token: string
    liquidity: bigint
    amountTokenMin: bigint
    amountETHMin: bigint
    to: string
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