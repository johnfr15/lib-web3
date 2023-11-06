import { get_quote, get_balance } from ".";
import { Pool, Token, Balance, TradeType } from "../../types";
import { CONTRACTS, ROUTER_ABI } from "../../config/constants";
import { ethers, Wallet, Contract, ZeroAddress } from "ethers";
import { Trade, SwapOptions, SwapTx, SwapExactETHForTokens, SwapETHForExactTokens } from "../../types/swap";

/**
 * @notice This function will fetch all the informations we need in order to swap
 * token 'in' for token 'out'
 */
export const get_trade = async( 
    signer: Wallet,
    tokenIn: Token, 
    tokenOut: Token,
    amount: string,
    pool: Pool,
    options: SwapOptions
): Promise<Trade> => {


    
    const { EXACT_INPUT, EXACT_OUTPUT } = TradeType
    const { slipage, deadline, tradeType } = options
    
    const Router = new Contract( CONTRACTS.ROUTER, ROUTER_ABI, signer )

    let amount_in: bigint      = tradeType === EXACT_INPUT ? ethers.parseUnits( amount, tokenIn.decimals ) : BigInt( 0 )
    let amount_in_max: bigint  = BigInt( 0 )
    let amount_out: bigint     = tradeType === EXACT_OUTPUT ? ethers.parseUnits( amount, tokenOut.decimals ) : BigInt( 0 )
    let amount_out_min: bigint = BigInt( 0 )
    const reserve_in: bigint   = BigInt( pool.tokenX.address ) === BigInt( tokenIn.address ) ? pool.reserveX : pool.reserveY
    const reserve_out: bigint  = BigInt( pool.tokenX.address ) === BigInt( tokenIn.address ) ? pool.reserveY : pool.reserveX

    if ( tradeType === EXACT_INPUT ) 
    {
        amount_out = await Router.getAmountOut( amount_in, reserve_in, reserve_out )
        amount_out_min = amount_out * BigInt( parseInt( ((100 - options.slipage!) * 100).toString() ) ) / BigInt( 100 * 100 )
    }
    if ( tradeType === EXACT_OUTPUT ) 
    {
        amount_in =  await Router.getAmountIn( amount_out, reserve_in, reserve_out )
        amount_in_max = amount_in * BigInt( parseInt( ((options.slipage! + 100) * 100).toString() ) ) / BigInt( 100 * 100 )
    }
    

    const trade: Trade = { 
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        path: [ tokenIn.address, tokenOut.address ],
        pool: pool,
        amountIn: amount_in, 
        amountOut: amount_out, 
        amountInMax: amount_in_max,
        amountOutMin: amount_out_min,
        priceImpact: 0,
        to: signer.address,
        slipage: slipage!,
        deadline: deadline!,
    }

    return trade
}

/**
 * @notice Calculate the price impact caused by our trade 
 * @returns The price impact in percent 
 */  
export const calc_price_impact = async( trade: Trade, pool: Pool ): Promise<number> => {

    const big_quote: bigint = get_quote( trade.amountIn, trade.tokenIn, trade.tokenOut, pool )
    const quoteOut: string  = ethers.formatUnits(big_quote, trade.tokenOut.decimals )
    const amountOut: string = ethers.formatUnits( trade.amountOut, trade.tokenOut.decimals )

    const priceImpact = 100 - parseFloat( amountOut ) * 100 / parseFloat( quoteOut )

    return priceImpact
}

/**
 * This function will return the amount we want to send/received depending of the option specified
 * Fix amount / max of our balance / percentage of our balance 
 * 
 */
export const get_amount = ( amount: string | null, balance: Balance, options: SwapOptions ): string => {

    const { max, percent } = options

    if ( max )
        return balance.string
    if ( percent )
        return ethers.formatUnits( ( balance.bigint * BigInt( percent * 100 ) / BigInt( 100 * 100 ) ), balance.decimals )
    
    return amount!
}


export const check_swap_inputs = ( amount: string | null, path: string[], options: SwapOptions ) => {

    if ( path[0] === undefined || path[1] === undefined )
        throw(`Error: token undefined path[0]: ${ path[0] }, path[1]: ${ path[1] }.`)
    if ( options.slipage! < 0.01 || options.slipage! > 100 )
        throw(`Slipage parameter must be a number between 0.01 and 100.`)
    if ( options.percent && (options.percent! <= 0 || options.percent! > 100) )
        throw("Percent need to be set between 0 to 100")
    if ( amount === null && options.max === false && options.percent === undefined )
        throw(`Error: You need to specify an 'amount' or set options 'max' to true or pencent.`)
}

/**
 * @name enforce_fees
 * @dev If ETH token is about to be swapped ensure that we will keep enough ETH token to pay the fees
 *      of this transaction
 */
export const enforce_swap_fees = async( 
    swapTx: SwapTx, 
    txArgs: SwapExactETHForTokens | SwapETHForExactTokens, 
    options: SwapOptions 
): Promise<{ 
    value: bigint, 
    tx: SwapExactETHForTokens | SwapETHForExactTokens 
}> => {

    let { signer, trade, Router } = swapTx 
    let { amountIn, tokenIn, tokenOut, pool, deadline, to, path } = trade
    let { tradeType } = options
    

    const feesPerGas =  await Router.swapExactETHForTokens.estimateGas( ...Object.values( txArgs ), { value: amountIn })
    
    const feeDatas = await signer.provider!.getFeeData()
    const totalFees = feesPerGas * feeDatas.gasPrice!

    const balance = await get_balance( ZeroAddress, swapTx.signer )

    if ( balance.bigint < (amountIn + totalFees) )
    {
        amountIn = amountIn - totalFees * BigInt( 10 )
        swapTx.trade = await get_trade( signer, tokenIn, tokenOut, ethers.formatEther( amountIn ), pool, options )
    }

    if ( tradeType === TradeType.EXACT_INPUT )
        return { value: amountIn, tx: { amountOutMin: swapTx.trade.amountOutMin, path: path, to, deadline } }

    // Exact output
    return { value: amountIn, tx: { amountOut: swapTx.trade.amountOut, path: path, to, deadline } }
}