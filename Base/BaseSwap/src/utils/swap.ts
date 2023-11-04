import { get_quote, is_native } from ".";
import { SwapOptions } from "../../types/swap";
import { ethers, Wallet, Contract } from "ethers";
import { Pool, Trade, Token, TradeType, Balance  } from "../../types";
import { ExactOutputSingle, ExactInputSingle } from "../../types/swap";
import { CONTRACTS, SWAP_ROUTER_ABI, MAX_UINT256 } from "../../config/constants";

export const get_trade = async( 
    signer: Wallet,
    tokenIn: Token, 
    tokenOut: Token,
    amount: string,
    pool: Pool,
    options: SwapOptions
): Promise<Trade> => {

    let amount_out_min: bigint | undefined
    let amount_in_max: bigint | undefined

    const { EXACT_INPUT, EXACT_OUTPUT } = TradeType
    const { tradeType } = options

    try {

        let amount_in: bigint  = ethers.parseUnits( tradeType === EXACT_INPUT ? amount : '0', tokenIn.decimals ) 
        let amount_out: bigint = ethers.parseUnits( tradeType === EXACT_OUTPUT ? amount : '0', tokenOut.decimals )

        
        if ( tradeType === EXACT_INPUT ) 
        {
            amount_out = await get_quote( parseFloat( ethers.formatUnits( amount_in, tokenIn.decimals) ), tokenIn,  pool )
            amount_out_min = amount_out * BigInt( parseInt( ((100 - options.slipage!) * 100).toString() ) ) / BigInt( 100 * 100 )
        }
        if ( tradeType === EXACT_OUTPUT ) 
        {
            amount_in = await get_quote( parseFloat( ethers.formatUnits( amount_out, tokenOut.decimals) ), tokenOut,  pool )
            amount_in_max = amount_in * BigInt( parseInt( ((options.slipage! + 100) * 100).toString() ) ) / BigInt( 100 * 100 )
        }

        const trade: Trade = { 
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            path: [ tokenIn.address, tokenOut.address ],
            amountIn: amount_in, 
            amountOut: amount_out, 
            amountInMax: amount_in_max, 
            amountOutMin: amount_out_min,
            sqrtPriceLimitX96: BigInt( 0 ),
            to: signer.address,
            priceImpact: 0,
            pool: pool,
            slipage: options.slipage!,
            tradeType: tradeType!,
            deadline: options.deadline!,
        }

        return trade

    } catch (error) {
        
        throw error

    }
}

export const get_amount_out = async( tokenIn: Token, tokenOut: Token, amountIn: bigint, pool: Pool, signer: Wallet ): Promise<bigint> => {

    let value: bigint = BigInt( 0 )

    const SwapRouter = new Contract( CONTRACTS.SWAP_ROUTER_V3, SWAP_ROUTER_ABI, signer )

    if ( is_native( tokenIn.address ) )
        value = amountIn

    const params: ExactInputSingle = { 
        tokenIn: tokenIn.address, 
        tokenOut: tokenOut.address, 
        fee: pool.fees, 
        recipient: signer.address,
        deadline: Math.floor( Date.now() / 1000 ) + 60 * 20,
        amountIn: amountIn,
        amountOutMinimum: BigInt( 0 ),
        sqrtPriceLimitX96: BigInt( 0 )
    }

    const [ amountOut ] = await SwapRouter.exactInputSingle.staticCall( params, { value: value } )

    return amountOut
}

export const get_amount_in = async( tokenIn: Token, tokenOut: Token, amountOut: bigint, pool: Pool, signer: Wallet ): Promise<bigint> => {

    const SwapRouter = new Contract( CONTRACTS.SWAP_ROUTER, SWAP_ROUTER_ABI, signer )

    const params: ExactOutputSingle = { 
        tokenIn: tokenIn.address,
        tokenOut: tokenOut.address,
        fee: pool.fees,
        recipient: signer.address,
        deadline: Math.floor( Date.now() / 1000 ) + 60 * 20,
        amountOut: amountOut,
        amountInMaximum: BigInt( MAX_UINT256 ),
        sqrtPriceLimitX96: BigInt( 0 )
    }

    const [ amountIn ] = await SwapRouter.exactOutputSingle.staticCall( params )

    return amountIn
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
export const get_amount = ( amount: string | null, balance: Balance, options: SwapOptions ): string => {

    const { max, percent } = options

    if ( max )
        return balance.string
    if ( percent )
        return ethers.formatUnits( ( balance.bigint * BigInt( percent * 100 ) / BigInt( 100 * 100 ) ), balance.decimals )
    
    return amount!
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