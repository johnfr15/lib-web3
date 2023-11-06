import { is_native } from "../utils";
import { SwapTx } from "../../types/swap";
import { swapETHForExactTokens, swapExactETHForTokens } from "./swapETH";
import { swapTokensForExactETH, swapExactTokensForETH } from "./swapTokens";
import { swapTokensForExactTokens, swapExactTokensForTokens } from "./swapTokens";

export const exec_swap = async( swapTx: SwapTx ): Promise<void> => {

    const { tokenIn, tokenOut } = swapTx.trade
    const { tradeType } = swapTx.options

    let bitwise = 0
    bitwise = tradeType! << 2 | +is_native( tokenIn.address ) << 1 | +is_native(tokenOut.address);

    if ( bitwise === 0 ) await swapExactTokensForTokens( swapTx ) // 000
    if ( bitwise === 1 ) await swapExactTokensForETH( swapTx )    // 001
    if ( bitwise === 2 ) await swapExactETHForTokens( swapTx )    // 010
    if ( bitwise === 4 ) await swapTokensForExactTokens( swapTx ) // 100
    if ( bitwise === 5 ) await swapTokensForExactETH( swapTx )    // 101
    if ( bitwise === 6 ) await swapETHForExactTokens( swapTx )    // 110
}



