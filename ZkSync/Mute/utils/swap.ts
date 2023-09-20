import { ethers, Contract, Wallet, TransactionResponse } from "ethers";
import { Pool, Trade, Token } from "../types";
import { MUTE_ROUTER_ABI, ROUTER_ADDRESS } from "../config/constants";
import { get_quote, is_native } from ".";


export const get_trade = async( 
    path: [string, string],
    tokenIn: Token, 
    tokenOut: Token,
    amountIn: string,
    pool: Pool,
    slipage: number,
    deadline: number | undefined,
): Promise<Trade> => {

    try {
        
        const amount_in: bigint  = ethers.parseUnits( amountIn, tokenIn.decimals ) 
        const quote: string = get_quote( amountIn, tokenIn, tokenOut, pool )
        const amount_out: bigint = ethers.parseUnits( quote, tokenOut.decimals )
        const amount_out_min: bigint = amount_out * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        
        return { 
            path: path,
            tokenFrom: tokenIn,
            tokenTo: tokenOut,
            pool: pool,
            amountIn: amount_in, 
            amountOut: amount_out, 
            amountOutMin: amount_out_min, 
            priceImpact: 0,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20 // 20 minutes from the current Unix time
        }

    } catch (error) {
        
        throw error

    }
}

export const calc_price_impact = async( trade: Trade, pool: Pool ): Promise<number> => {

    let percent: number

    const reserve_in  = BigInt( trade.tokenFrom.address ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB
    const reserve_out = BigInt( trade.tokenTo.address   ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB

    const quoteOut: string = get_quote( ethers.formatUnits( trade.amountIn, trade.tokenFrom.decimals), trade.tokenFrom, trade.tokenTo, pool )
    const diffOut: bigint  = trade.amountOut * reserve_out / ethers.parseUnits( quoteOut, trade.tokenTo.decimals)

    percent = 10000 - parseFloat( (reserve_out * BigInt( 10000 ) / diffOut).toString() )

    const priceImpact = percent < 0 ? -percent / 100 : percent / 100

    return priceImpact
}

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_swap = async( trade: Trade, network: 'TESTNET' | 'MAINNET', signer: Wallet ): Promise<TransactionResponse> => {

    let tx: TransactionResponse;

    const Router: Contract = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer ) 

    if ( is_native( trade.path[0] ) )
    {
        tx = await Router.swapExactETHForTokens( 
            trade.amountOutMin,
            [ trade.tokenFrom.address, trade.tokenTo.address ],
            signer.address,
            trade.deadline,
            [ false ],
            { value: trade.amountIn }
        )
    }
    else if ( is_native( trade.path[1] ) )
    {
        tx = await Router.swapExactTokensForETH(
            trade.amountIn,
            trade.amountOutMin,
            [ trade.tokenFrom.address, trade.tokenTo.address ],
            signer.address,
            trade.deadline,
            [ false ]
        )
    }
    else
    {
        tx = await Router.swapExactTokensForTokens(
            trade.amountIn,
            trade.amountOutMin,
            [ trade.tokenFrom.address, trade.tokenTo.address ],
            signer.address,
            trade.deadline,
            [ false ]
        )
    }

    return tx
}