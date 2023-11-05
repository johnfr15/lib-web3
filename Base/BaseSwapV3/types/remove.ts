import { Contract, Wallet } from "ethers"
import { Balance, Pool, Token } from "."

export type RemoveLiquidityTx = {
    signer: Wallet
    pool: Pool
    lp: Token
    tokenX: Token
    tokenY: Token
    liquidity: Balance
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
    stable: boolean
    liquidity: bigint
    amountTokenMin: bigint
    amountETHMin: bigint
    to: string
    deadline: number
}

export type RemoveLiquidity = {
    tokenA: string
    tokenB: string
    stable: boolean
    liquidity: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
}