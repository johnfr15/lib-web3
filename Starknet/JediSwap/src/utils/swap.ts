import { ethers } from "ethers";
import { Pool, Trade } from "../../types";
import { Contract, Uint256, uint256 } from "starknet";
import { jsbi_to_Uint256, string_to_Uint256 } from "./index";
import { TokenAmount, Token, TradeType, Fraction } from "l0k_swap-sdk";



export const get_amount_out = async( amountIn: TokenAmount, pool: Pool, Router: Contract ): Promise<TokenAmount> => {

    try {

        const reserve_in: Uint256  = amountIn.token.address === pool.token0.address ? pool.reserve0 : pool.reserve1
        const reserve_out: Uint256 = amountIn.token.address !== pool.token0.address ? pool.reserve0 : pool.reserve1
        const token_out: Token     = amountIn.token.address !== pool.token0.address ? pool.token0 : pool.token1

        const { amountOut }: { amountOut: Uint256 } = await Router.get_amount_out( jsbi_to_Uint256( amountIn.raw ), reserve_in, reserve_out )
        const amount_out = new TokenAmount( token_out, uint256.uint256ToBN( amountOut ) )

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
    

        const { amountIn }: { amountIn: Uint256 } = await Router.get_amount_in( jsbi_to_Uint256( amountOut.raw ), reserve_in, reserve_out )
        const amount_in = new TokenAmount( token_in, uint256.uint256ToBN( amountIn ) )
        
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

        return { 
            tradeType: tradeType, 
            amountIn: amount_in, 
            amountInMax: null, 
            amountOut: amount_out, 
            amountOutMin: null, 
            priceImpact: priceImpact 
        }

    } catch (error) {
        
        throw error

    }
}



export const calc_price_impact = async( amountIn: TokenAmount, amountOut: TokenAmount, tradeType: TradeType, Router: Contract, pool: Pool ) => {

    let percent: string

    const reserve_in  = amountIn.token.address === pool.token0.address ? pool.reserve0 : pool.reserve1
    const reserve_out = amountIn.token.address !== pool.token0.address ? pool.reserve0 : pool.reserve1

    if ( tradeType == TradeType.EXACT_INPUT )
    {
        const { amountB: quoteOut }: { amountB: Uint256 } = await Router.quote( jsbi_to_Uint256( amountIn.raw, amountIn.token.decimals ), reserve_in, reserve_out )
        const impact = amountOut.multiply( BigInt( 10000 )).multiply( ethers.parseUnits( '100', amountOut.token.decimals ) ).divide( uint256.uint256ToBN( quoteOut ))

        percent = impact.divide( BigInt( 10000 ) ).subtract( BigInt( 100 )).toSignificant(3) 
    }
    else
    {
        const { amountB: quoteIn }: { amountB: Uint256 } = await Router.quote( jsbi_to_Uint256( amountOut.raw ), reserve_out, reserve_in )
        const impact = amountIn.multiply( BigInt( 10000 )).multiply( ethers.parseUnits( '100', amountIn.token.decimals ) ).divide( uint256.uint256ToBN( quoteIn ))

        percent = impact.divide( BigInt( 10000 ) ).subtract( BigInt( 100 )).toSignificant(3) 
    }

    const priceImpact = parseFloat(percent) < 0 ? (parseFloat(percent) * -1) : parseFloat(percent)

    return priceImpact
}



export const get_out_min = ( amountOut: TokenAmount, slipage: number): Uint256 => {

    const amount_out_min = amountOut.multiply( new Fraction( BigInt( (100 - slipage) * 100 ) ) )
                                    .divide( BigInt( 100 * 100 ) )
                                    .toFixed( amountOut.token.decimals )

    return string_to_Uint256( amount_out_min, amountOut.token.decimals )
}



export const get_in_max = ( amountIn: TokenAmount, slipage: number): Uint256 => {

    const amount_in_max = amountIn.multiply( new Fraction( BigInt( (100 + slipage) * 100 ) ) )
                                    .divide( BigInt( 100 * 100 ) )
                                    .toFixed( amountIn.token.decimals )

    return string_to_Uint256( amount_in_max, amountIn.token.decimals )
}