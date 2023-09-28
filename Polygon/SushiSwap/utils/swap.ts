import { ethers, Wallet } from "ethers";
import { Pool, Trade, Token, TradeType, SwapExactETHForTokens, SwapExactTokensForETH } from "../types";
import { get_quote, is_native, get_balance } from ".";
import { TOKENS, ZERO_ADDRESS } from "../config/constants";

export const get_trade = async( 
    signer: Wallet,
    tokenIn: Token, 
    tokenOut: Token,
    amountIn: string | null,
    amountOut: string | null,
    pool: Pool,
    slipage: number,
    deadline: number | undefined,
    network: 'TESTNET' | 'MAINNET'
): Promise<Trade> => {

    let amount_out_min: bigint | undefined
    let amount_in_max: bigint | undefined

    try {

        const reserve_in  = BigInt( tokenIn.address ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB
        const reserve_out = BigInt( tokenOut.address ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB
        
        const tradeType = amountIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT

        let amount_in: bigint  = ethers.parseUnits( amountIn ?? '0', tokenIn.decimals ) 
        let amount_out: bigint = ethers.parseUnits( amountOut ?? '0', tokenIn.decimals )

        if ( tradeType === TradeType.EXACT_INPUT ) amount_out = get_amount_out( amount_in, reserve_in, reserve_out )
        if ( tradeType === TradeType.EXACT_OUTPUT ) amount_in = get_amount_in( amount_out, reserve_in, reserve_out )

        amount_out_min = amount_out * BigInt( (100 - slipage) * 100 ) / BigInt( 100 * 100 )
        amount_in_max = amount_in * BigInt( (slipage + 100) * 100 ) / BigInt( 100 * 100 )
        

        return { 
            tokenFrom: tokenIn,
            tokenTo: tokenOut,
            pool: pool,
            amountIn: amount_in, 
            amountOut: amount_out, 
            amountInMax: amount_in_max, 
            amountOutMin: amount_out_min, 
            path: [ tokenIn.address, tokenOut.address ],
            to: signer.address,
            priceImpact: 0,
            slipage: slipage,
            tradeType: tradeType,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
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

export const get_amount_in = (amount_out: bigint, reserve_in: bigint, reserve_out: bigint ): bigint => {
    let amount_in: bigint

    let numerator = reserve_in * amount_out;
    let denominator = reserve_out - amount_out;
    amount_in = numerator / denominator;

    return  amount_in
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

    let { amountIn, amountOut, tokenFrom, tokenTo, pool, slipage, deadline, network } = trade

    if ( is_native( tokenFrom.address ) === false )
        return { tx: swapTx, amountIn: amountIn }


    try {    

        const balance = await get_balance( ZERO_ADDRESS, signer )

        if ( balance.bigint < (amountIn + fees * BigInt( 4 )) )
        {
            amountIn =  amountIn - (fees * BigInt( 100 ))
            const newTrade = await get_trade( 
                signer, 
                tokenFrom, 
                tokenTo, 
                ethers.formatEther( amountIn ), 
                ethers.formatEther( amountOut ), 
                pool, 
                slipage, 
                deadline, 
                network 
            )
            
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