import { is_native } from "../utils";
import { TradeType } from "@uniswap/sdk";
import { SwapTx } from "../types";
import { swapExactETHForTokens, swapETHForExactTokens, swapExactTokensForETH, swapTokensForExactETH } from "./swapETH";
import { swapExactTokensForTokens, swapTokensForExactTokens } from "./swapTokens"


export const exec_swap = async( swapTx: SwapTx ): Promise<void> => {

    const { trade, path } = swapTx
    const { EXACT_INPUT, EXACT_OUTPUT } = TradeType

    try {

        if ( is_native( path[0] ) && trade.tradeType === EXACT_INPUT )  return await swapExactETHForTokens( swapTx )
        if ( is_native( path[0] ) && trade.tradeType === EXACT_OUTPUT ) return await swapETHForExactTokens( swapTx )
        if ( is_native( path[1] ) && trade.tradeType === EXACT_INPUT )  return await swapExactTokensForETH( swapTx )
        if ( is_native( path[1] ) && trade.tradeType === EXACT_OUTPUT ) return await swapTokensForExactETH( swapTx )
        if ( trade.tradeType === EXACT_INPUT )                          return await swapExactTokensForTokens( swapTx )
        if ( trade.tradeType === EXACT_OUTPUT )                         return await swapTokensForExactTokens( swapTx )
        
    } catch (error) {

       throw( error )

    }
}