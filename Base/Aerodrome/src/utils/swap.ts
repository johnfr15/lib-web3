import { get_quote } from ".";
import { ethers, Wallet } from "ethers";
import { Pool, Token, Chains, Balance, Fees } from "../../types";
import { Trade, TradeType, SwapOptions } from "../../types/swap";

/**
 * This function will fetch all the informations we need in order to swap
 * token 'in' for token 'out'
 */
export const get_trade = async( 
    signer: Wallet,
    tokenIn: Token, 
    tokenOut: Token,
    amount: string,
    pool: Pool,
    chain: Chains,
    options: SwapOptions
): Promise<Trade> => {

    let amount_out_min: bigint | undefined
    let amount_in_max: bigint | undefined

    try {

        const { EXACT_INPUT, EXACT_OUTPUT } = TradeType 
        const { tradeType, slipage, deadline } = options

        let amount_in: bigint  = ethers.parseUnits( tradeType === EXACT_INPUT ? amount : '0', tokenIn.decimals ) 
        let amount_out: bigint = ethers.parseUnits( tradeType === EXACT_OUTPUT ? amount : '0', tokenOut.decimals )

        
        if ( tradeType === EXACT_INPUT ) 
        {
            amount_out = await get_amount_out( tokenIn, tokenOut, amount_in, pool )
            amount_out_min = amount_out * BigInt( parseInt( ((100 - slipage!) * 100).toString() ) ) / BigInt( 100 * 100 )
        }
        if ( tradeType === EXACT_OUTPUT ) 
        {
            amount_in = await get_amount_in( tokenIn, tokenOut, amount_out, pool )
            amount_in_max = amount_in * BigInt( parseInt( ((slipage! + 100) * 100).toString() ) ) / BigInt( 100 * 100 )
        }
        

        const trade: Trade = {
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            path: [ tokenIn.address, tokenOut.address ],
            pathEncoded: encode_path( tokenIn, tokenOut, pool.fees ),
            amountIn: amount_in, 
            amountOut: amount_out, 
            amountInMax: amount_in_max, 
            amountOutMin: amount_out_min,
            priceImpact: 0,
            sqrtPriceLimitX96: pool.state.sqrtPrice_96,
            to: signer.address,
            pool: pool,
            slipage: slipage!,
            tradeType: tradeType!,
            deadline: deadline!,
            chain: chain,
        }

        return trade

    } catch (error) {
        
        throw error

    }
}

/**
 * Mock the transaction using the 'Quoter' contract to get the output amount of this swap
 * 
 */
export const get_amount_out = async( tokenIn: Token, tokenOut: Token, amountIn: bigint, pool: Pool ): Promise<bigint> => {

    try {

        const encoded_path: string = encode_path( tokenIn, tokenOut, pool.fees )
        const [ amountOut ] = await pool.Quoter.swapAmount.staticCall( amountIn, encoded_path )
    
        return amountOut

    } catch (error) {
        
        throw( error )

    }
}

/**
 * Mock the transaction using the 'Quoter' contract to get the input amount to get the EXACT output
 * 
 */
export const get_amount_in = async( tokenIn: Token, tokenOut: Token, amountOut: bigint, pool: Pool ): Promise<bigint> => {

    try {

        const encoded_path: string = encode_path( tokenIn, tokenOut, pool.fees )
        const [ amountIn ] = await pool.Quoter.swapDesire.staticCall( amountOut, encoded_path )
    
        return amountIn

    } catch (error) {

        throw( error )

    }
}

export const calc_price_impact = async( trade: Trade, pool: Pool ): Promise<number> => {

    const amountIn: number = parseFloat( ethers.formatUnits( trade.amountIn, trade.tokenIn.decimals) )

    const quoteOut: bigint = get_quote( amountIn, trade.tokenIn, pool )
    const quoteString: string = ethers.formatUnits( quoteOut, trade.tokenOut.decimals ) 

    const amountOut: string = ethers.formatUnits( trade.amountOut, trade.tokenOut.decimals )

    const priceImpact = 100 - parseFloat( amountOut ) * 100 / parseFloat( quoteString )

    return priceImpact
}

/**
 * This function will return the amount we want to send/received depending of the option specified
 * Fix amount / max of our balance / percentage of our balance 
 * 
 */
export const get_amount = ( amount: string | null, balance_in: Balance, balance_out: Balance, options: SwapOptions ): string => {

    const { max, percent, tradeType } = options
    const balance: Balance = tradeType === TradeType.EXACT_INPUT ? balance_in : balance_out  

    if ( max )
        return balance.string
    if ( percent )
        return ethers.formatUnits( ( balance.bigint * BigInt( percent * 100 ) / BigInt( 100 * 100 ) ), balance.decimals )
    
    return amount!
}

export const encode_path = ( tokenIn: Token, tokenOut: Token, fees: Fees ) => {

    const fee_uint8: Uint8Array = ethers.toBeArray( ethers.getUint( fees ) );
    const encoded_fee: string = ethers.zeroPadValue( fee_uint8, 3 ); // Ensure it's 3 bytes long

    // Concatenate the encoded values
    const encoded_path: string = ethers.concat([ tokenIn.address, encoded_fee, tokenOut.address ]);

    return encoded_path
}

/**
 * @name enforce_fees
 * @dev If ETH token is about to be swapped ensure that we will keep enough ETH token to pay the fees
 *      of this transaction
 */
// export const enforce_swap_fees = async(  swapTx: SwapTx, txArgs: SwapExactETHForTokens | SwapETHForExactTokens ): Promise<{ value: bigint, tx: SwapExactETHForTokens | SwapETHForExactTokens}> => {

//     let { signer, trade, Router } = swapTx 
//     let { amountIn, amountOut, amountInMax, tokenFrom, tokenTo, pool, slipage, deadline, network, tradeType, path, to } = trade
    
//     try {    

//         let feesPerGas: bigint = BigInt( 0 )

//         if ( tradeType === TradeType.EXACT_INPUT )  feesPerGas =  await Router.swapExactETHForTokens.estimateGas( ...Object.values( txArgs ), { value: amountIn })
//         if ( tradeType === TradeType.EXACT_OUTPUT ) feesPerGas =  await Router.swapETHForExactTokens.estimateGas( ...Object.values( txArgs ), { value: amountIn })
        
//         const feeDatas = await signer.provider!.getFeeData()
//         const totalFees = feesPerGas * feeDatas.gasPrice!

//         const balance = await get_balance( NATIVE_TOKEN, swapTx.signer )

//         if ( balance.bigint < (amountIn + totalFees) )
//         {
//             if ( tradeType === TradeType.EXACT_OUTPUT )
//                 return { value: amountInMax - totalFees * BigInt( 10 ) , tx: { amountOut: swapTx.trade.amountOut, path, to, deadline } } 

//             amountIn = amountIn - totalFees * BigInt( 10 )

//             swapTx.trade = await get_trade( 
//                 swapTx.signer, 
//                 tokenFrom, 
//                 tokenTo, 
//                 ethers.formatEther( amountIn ), 
//                 ethers.formatEther( amountOut ), 
//                 pool, 
//                 slipage, 
//                 deadline, 
//                 network 
//             )
//         }

//         if ( tradeType === TradeType.EXACT_INPUT )
//             return { value: amountIn, tx: { amountOutMin: swapTx.trade.amountOutMin, path, to, deadline } }
//         else
//             return { value: amountInMax, tx: { amountOut: swapTx.trade.amountOut, path, to, deadline } }

//     } catch (error) {
        
//         throw( error )

//     }
// }