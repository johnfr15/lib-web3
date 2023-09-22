import { ethers, Signature, Wallet } from "ethers";
import { Pool, Trade, Token, SwapExactETHForTokens, SwapExactTokensForETH, SwapExactTokensForTokens } from "../types";
import { get_quote, is_native, get_balance } from ".";
import { TOKENS, ZERO_ADDRESS } from "../config/constants";

export const get_trade = async( 
    signer: Wallet,
    path: [string, string],
    tokenIn: Token, 
    tokenOut: Token,
    amountIn: string,
    pool: Pool,
    slipage: number,
    deadline: number | undefined,
    network: 'TESTNET' | 'MAINNET'
): Promise<Trade> => {

    try {
        
        const amount_in: bigint  = ethers.parseUnits( amountIn, tokenIn.decimals ) 
        const quote: string = get_quote( amountIn, tokenIn, tokenOut, pool )
        const amount_out: bigint = ethers.parseUnits( quote, tokenOut.decimals )
        const amount_out_min: bigint = amount_out * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        
        return { 
            tokenFrom: tokenIn,
            tokenTo: tokenOut,
            pool: pool,
            amountIn: amount_in, 
            amountOut: amount_out, 
            amountOutMin: amount_out_min, 
            path: path,
            to: signer.address,
            priceImpact: 0,
            slipage: slipage,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
            stable: [ false ],
            network: network
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
 * @name enforce_fees
 * @dev If ETH token is about to be swapped ensure that we will keep enough ETH token to pay the fees
 *      of this transaction
 */
export const enforce_swap_fees = async( 
    trade: Trade,
    swapTx: SwapExactETHForTokens | SwapExactTokensForETH | SwapExactTokensForETH, 
    fees: bigint,  
    signer: Wallet
): Promise<{ tx: SwapExactETHForTokens | SwapExactTokensForETH | SwapExactTokensForETH, amountIn: bigint}> => {

    let { amountIn, tokenFrom, tokenTo, pool, slipage, deadline, network } = trade

    if ( is_native( tokenFrom.address ) === false )
        return { tx: swapTx, amountIn: amountIn }


    try {    

        const balance = await get_balance( ZERO_ADDRESS, signer )

        if ( balance.bigint < (amountIn + fees * BigInt( 4 )) )
        {
            amountIn =  amountIn - (fees * BigInt( 100 ))
            const newTrade = await get_trade( signer, [ ZERO_ADDRESS, tokenTo.address ], tokenFrom, tokenTo, ethers.formatEther( amountIn ), pool, slipage, deadline, network )
            
            const newTx: any = {}
            // Intersect the two objects to create a new one with common properties
            Object.entries( newTrade ).forEach( ( [key, value] ) => key in swapTx ? newTx[key] = value : '' )
            newTx.path[0] = TOKENS[ network ].weth

            return { tx: newTx, amountIn: amountIn } 
        }

        return { tx: swapTx, amountIn: amountIn }

    } catch (error) {
        
        throw( error )

    }
}