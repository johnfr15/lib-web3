import { ethers } from "ethers";
import { AlphaRouter, SwapOptionsSwapRouter02, SwapRoute } from "@uniswap/smart-order-router";
import { CurrencyAmount, Token, TradeType, } from "@uniswap/sdk-core";
import { CHAIN_ID, PROVIDER } from "../config/constants"
import { JsonRpcProvider } from "@ethersproject/providers";

export const get_trade = async(
    tokenIn: Token, 
    tokenOut: Token, 
    amountIn: string | null, 
    amountOut: string | null, 
    options: SwapOptionsSwapRouter02,
    network: 'TESTNET' | 'MAINNET'
): Promise<SwapRoute> => {

    let trade: SwapRoute | null

    try {

        const provider   = new JsonRpcProvider( PROVIDER[ network ] )
        const router     = new AlphaRouter({ chainId: CHAIN_ID[ network ], provider: provider })

        const trade_type = amountIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT
        
        if ( trade_type === TradeType.EXACT_INPUT )
        {
            trade = await router.route(
                CurrencyAmount.fromRawAmount( tokenIn, ethers.parseUnits( amountIn!, tokenIn.decimals).toString() ),
                tokenOut,
                TradeType.EXACT_INPUT,
                options
            )
        }
        else
        {
            trade = await router.route(
                CurrencyAmount.fromRawAmount( tokenOut, ethers.parseUnits( amountOut!, tokenOut.decimals ).toString() ),
                tokenIn,
                TradeType.EXACT_OUTPUT,
                options,
            )
        }

        if ( trade === null )
            throw(`${ network } Error: Pool does not exist for token ${ tokenIn.symbol }/${ tokenOut.symbol }.`)

        return trade
        
    } catch (error) {
        
        throw( error )

    }
}