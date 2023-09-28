import { is_native } from "../utils";
import { SwapTx } from "../types";
import { swapExactETHForTokens, swapETHForExactTokens } from "./swapETH";
import { swapExactTokensForTokens, swapTokensForExactTokens } from "./swapTokens"
import { TradeType } from "@uniswap/sdk-core";


export const exec_swap = async( swapTx: SwapTx ): Promise<void> => {

    const { trade, path } = swapTx
    const { EXACT_INPUT, EXACT_OUTPUT } = TradeType

    try {

        if ( is_native( path[0] ) && trade.trade.tradeType === EXACT_INPUT )  return await swapExactETHForTokens( swapTx )
        if ( is_native( path[0] ) && trade.trade.tradeType === EXACT_OUTPUT ) return await swapETHForExactTokens( swapTx )
        if ( trade.trade.tradeType === EXACT_INPUT )                          return await swapExactTokensForTokens( swapTx )
        if ( trade.trade.tradeType === EXACT_OUTPUT )                         return await swapTokensForExactTokens( swapTx )
        
    } catch (error) {

       throw( error )

    }
}