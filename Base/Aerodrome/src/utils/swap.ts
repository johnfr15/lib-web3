import { get_quote, get_balance } from ".";
import { Pool, Token, Balance } from "../../types";
import { CONTRACTS, ROUTER_ABI } from "../../config/constants";
import { ethers, Wallet, Contract, ZeroAddress } from "ethers";
import { Trade, SwapOptions, SwapTx, SwapExactETHForTokens, Route } from "../../types/swap";

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
    route: Route,
    options: SwapOptions
): Promise<Trade> => {

    const { slipage, deadline } = options
    const Router = new Contract( CONTRACTS.Router, ROUTER_ABI, signer )

    const amount_in: bigint = ethers.parseUnits( amount, tokenIn.decimals )
    const [ amountIn, amountOut ]: bigint[] = await Router.getAmountsOut( amount_in, [ route ] )
    const amountOutMin: bigint = amountOut * BigInt( parseInt( ((100 - slipage!) * 100).toString() ) ) / BigInt( 100 * 100 )
    

    const trade: Trade = { 
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        path: [ tokenIn.address, tokenOut.address ],
        pool: pool,
        route: route,
        amountIn: amountIn, 
        amountOut: amountOut, 
        amountOutMin: amountOutMin,
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

    const amountIn: string = ethers.formatUnits( trade.amountIn, trade.tokenIn.decimals )

    const quoteOut: string = get_quote( amountIn, trade.tokenIn, trade.tokenOut, pool )
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

export const get_route = ( tokenIn: Token, tokenOut: Token, pool: Pool ) => {

    const route: Route = {
        from: tokenIn.address,
        to: tokenOut.address,
        stable: pool.stable,
        factory: ZeroAddress,
    }

    return route
}

/**
 * @name enforce_fees
 * @dev If ETH token is about to be swapped ensure that we will keep enough ETH token to pay the fees
 *      of this transaction
 */
export const enforce_swap_fees = async(  swapTx: SwapTx, txArgs: SwapExactETHForTokens, options: SwapOptions ): Promise<{ value: bigint, tx: SwapExactETHForTokens }> => {

    let { signer, trade, Router } = swapTx 
    let { amountIn, tokenIn, tokenOut, pool, route, deadline, path, to } = trade
    

    const feesPerGas =  await Router.swapExactETHForTokens.estimateGas( ...Object.values( txArgs ), { value: amountIn })
    
    const feeDatas = await signer.provider!.getFeeData()
    const totalFees = feesPerGas * feeDatas.gasPrice!

    const balance = await get_balance( ZeroAddress, swapTx.signer )

    if ( balance.bigint < (amountIn + totalFees) )
    {
        amountIn = amountIn - totalFees * BigInt( 10 )
        swapTx.trade = await get_trade( signer, tokenIn, tokenOut, ethers.formatEther( amountIn ), pool, route, options )
    }

    return { value: amountIn, tx: { amountOutMin: swapTx.trade.amountOutMin, path, to, deadline } }
}