import { ethers } from "ethers";
import { TokenAmount, Token, TradeType } from "l0k_swap-sdk";
import { Contract, Uint256, uint256 } from "starknet";
import { Pool, Trade } from "../types";
import { jsbi_to_Uint256 } from "./index"
import { TICKER } from "../constant";

export const get_amount_out = async( amountIn: TokenAmount, pool: Pool, Router: Contract ): Promise<TokenAmount> => {

    try {

        const reserve_in: Uint256  = amountIn.token.address === pool.token0.address ? pool.reserve0 : pool.reserve1
        const reserve_out: Uint256 = amountIn.token.address !== pool.token0.address ? pool.reserve0 : pool.reserve1
        const token_out: Token     = amountIn.token.address !== pool.token0.address ? pool.token0 : pool.token1

        console.log(`reserve in ${ TICKER[ amountIn.token.address ]}: `, ethers.formatEther( uint256.uint256ToBN( reserve_in ) ))
        console.log(`reserve out: ${ TICKER[ token_out.address ]}`, ethers.formatEther( uint256.uint256ToBN( reserve_out ) ))
    
        const { amountOut }: { amountOut: Uint256 } = await Router.get_amount_out( jsbi_to_Uint256( amountIn.raw ), reserve_in, reserve_out )
        const amount_out = new TokenAmount( token_out, uint256.uint256ToBN( amountOut ) )
        console.log("amount out: ", amount_out.toSignificant(3))
        return amount_out
        
    } catch (error) {
        
        throw error
    }
}

export const get_amount_in = async( amountOut: TokenAmount, pool: Pool, Router: Contract ): Promise<TokenAmount> => {
    
    try {
        
        const reserve_out: Uint256 = amountOut.token.address === pool.token0.address ? pool.reserve0 : pool.reserve1
        const reserve_in: Uint256  = amountOut.token.address !== pool.token0.address ? pool.reserve0 : pool.reserve1
        const token_in: Token      = amountOut.token.address !== pool.token0.address ? pool.token0 : pool.token1
    
        console.log(`reserve in ${ TICKER[ token_in.address ]}: `, ethers.formatEther( uint256.uint256ToBN( reserve_in ) ))
        console.log(`reserve out: ${ TICKER[ amountOut.token.address ]}`, ethers.formatEther( uint256.uint256ToBN( reserve_out ) ))

        const { amountIn }: { amountIn: Uint256 } = await Router.get_amount_in( jsbi_to_Uint256( amountOut.raw ), reserve_in, reserve_out )
        const amount_in = new TokenAmount( token_in, uint256.uint256ToBN( amountIn ) )
        
        console.log("amount in: ", amount_in.toSignificant(3))
        return amount_in

    } catch (error) {
        
        throw error

    }
}

export const get_trade = async( 
    tokenIn: Token, 
    amountIn: string | null, 
    tokenOut: Token, 
    amountOut: string | null,
    pool: Pool,
    Router: Contract 
): Promise<Trade> => {

    try {

        let amount_in  = new TokenAmount( tokenIn, ethers.parseUnits( amountIn ?? '0', tokenIn.decimals ) )
        let amount_out = new TokenAmount( tokenOut, ethers.parseUnits( amountOut ?? '0', tokenOut.decimals ) )
        const tradeType = amount_out.toExact() === '0' ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT
        
        if ( tradeType === TradeType.EXACT_INPUT )  amount_out = await get_amount_out( amount_in, pool, Router )
        if ( tradeType === TradeType.EXACT_OUTPUT ) amount_in  = await get_amount_in( amount_out, pool, Router )
        
        const priceImpact = await calc_price_impact( amount_in, amount_out, tradeType, Router, pool )

        return { tradeType: tradeType, amountIn: amount_in, amountOut: amount_out, priceImpact: priceImpact }

    } catch (error) {
        
        throw error

    }
}

export const calc_price_impact = async( amountIn: TokenAmount, amountOut: TokenAmount, tradeType: TradeType, Router: Contract, pool: Pool ) => {

    let percent: number

    const reserve_in  = amountIn.token.address === pool.token0.address ? pool.reserve0 : pool.reserve1
    const reserve_out = amountIn.token.address !== pool.token0.address ? pool.reserve0 : pool.reserve1

    if ( tradeType == TradeType.EXACT_INPUT )
    {
        const { amountB: quoteOut }: { amountB: Uint256 } = await Router.quote( jsbi_to_Uint256( amountIn.raw ), reserve_in, reserve_out )
        const diffOut = amountOut.multiply( uint256.uint256ToBN( reserve_out ) ).divide( uint256.uint256ToBN( quoteOut ))
        percent = 10000 - parseFloat( (uint256.uint256ToBN( reserve_out ) * BigInt(10000) / ethers.parseEther( diffOut.toSignificant(3))).toString() )
    }
    else
    {
        const { amountB: quoteIn }: { amountB: Uint256 } = await Router.quote( jsbi_to_Uint256( amountOut.raw ), reserve_out, reserve_in )
        const diffIn = amountIn.multiply(  uint256.uint256ToBN( reserve_in ) ).divide( uint256.uint256ToBN( quoteIn ))
        percent = 10000 - parseFloat( (uint256.uint256ToBN( reserve_in ) * BigInt(10000) / ethers.parseEther( diffIn.toSignificant(3))).toString() )
    }

    const priceImpact = percent < 0 ? (percent * -1) / 100 : percent / 100
    return priceImpact
}