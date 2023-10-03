import { ethers, Wallet } from "ethers";
import { Pool, Trade, Token, TradeType, SwapExactETHForTokens, SwapTx, SwapETHForExactTokens } from "../types";
import { get_quote, get_balance } from ".";
import { NATIVE_TOKEN } from "../config/constants";

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

        amount_out_min = amount_out * BigInt( parseInt( ((100 - slipage) * 100).toString() ) ) / BigInt( 100 * 100 )
        amount_in_max = amount_in * BigInt( parseInt( ((slipage + 100) * 100).toString() ) ) / BigInt( 100 * 100 )
        

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
export const enforce_swap_fees = async(  swapTx: SwapTx, txArgs: SwapExactETHForTokens | SwapETHForExactTokens ): Promise<{ value: bigint, tx: SwapExactETHForTokens | SwapETHForExactTokens}> => {

    let { signer, trade, Router } = swapTx 
    let { amountIn, amountOut, amountInMax, tokenFrom, tokenTo, pool, slipage, deadline, network, tradeType, path, to } = trade
    
    try {    

        let feesPerGas: bigint = BigInt( 0 )

        if ( tradeType === TradeType.EXACT_INPUT )  feesPerGas =  await Router.swapExactETHForTokens.estimateGas( ...Object.values( txArgs ), { value: amountIn })
        if ( tradeType === TradeType.EXACT_OUTPUT ) feesPerGas =  await Router.swapETHForExactTokens.estimateGas( ...Object.values( txArgs ), { value: amountIn })
        
        const feeDatas = await signer.provider!.getFeeData()
        const totalFees = feesPerGas * feeDatas.gasPrice!

        const balance = await get_balance( NATIVE_TOKEN, swapTx.signer )

        if ( balance.bigint < (amountIn + totalFees) )
        {
            if ( tradeType === TradeType.EXACT_OUTPUT )
                return { value: amountInMax - totalFees * BigInt( 10 ) , tx: { amountOut: swapTx.trade.amountOut, path, to, deadline } } 

            amountIn = amountIn - totalFees * BigInt( 10 )

            swapTx.trade = await get_trade( 
                swapTx.signer, 
                tokenFrom, 
                tokenTo, 
                ethers.formatEther( amountIn ), 
                ethers.formatEther( amountOut ), 
                pool, 
                slipage, 
                deadline, 
                network 
            )
        }

        if ( tradeType === TradeType.EXACT_INPUT )
            return { value: amountIn, tx: { amountOutMin: swapTx.trade.amountOutMin, path, to, deadline } }
        else
            return { value: amountInMax, tx: { amountOut: swapTx.trade.amountOut, path, to, deadline } }

    } catch (error) {
        
        throw( error )

    }
}