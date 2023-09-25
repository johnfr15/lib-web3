import { ethers, Wallet } from "ethers";
import { Pool, Trade, Token, SwapExactETHForTokens, SwapExactTokensForETH } from "../types";
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
        const reserve_in  = BigInt( tokenIn.address ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB
        const reserve_out = BigInt( tokenOut.address ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB

        const amount_in: bigint  = ethers.parseUnits( amountIn, tokenIn.decimals ) 
        const amount_out: bigint = get_amount_out( amount_in, reserve_in, reserve_out )
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


export const get_amount_out = (amount_in: bigint, reserve_in: bigint, reserve_out: bigint ): bigint => {
    let amount_out: bigint

    let amountInWithFee = amount_in * BigInt( 1000 ); // No fees
    let numerator = amountInWithFee * reserve_out;
    let denominator = reserve_in * BigInt( 1000 ) + amountInWithFee;
    amount_out = numerator / denominator;

    return  amount_out
}

export const calc_price_impact = async( trade: Trade, pool: Pool ): Promise<number> => {

    const quoteOut: string = get_quote( ethers.formatUnits( trade.amountIn, trade.tokenFrom.decimals), trade.tokenFrom, trade.tokenTo, pool )
    const amountOut: string = ethers.formatUnits( trade.amountOut, trade.tokenTo.decimals )

    const priceImpact = 100 - parseFloat( amountOut ) * 100 / parseFloat( quoteOut )

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