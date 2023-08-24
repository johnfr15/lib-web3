import { BigNumberish } from "ethers"

export type Add_liquidity_args = {
    token_a_addr: string,
    token_a_decimals: number,
    amount_a: any,
    amount_a_min: any,
    token_b_addr: string,
    token_b_decimals: number,
    amount_b: any,
    amount_b_min: any
}