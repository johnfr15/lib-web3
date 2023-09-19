import { ethers, Contract, Wallet } from "ethers";
import { Pool, Trade, Token } from "../types";
import { MUTE_ROUTER_ABI, ROUTER_ADDRESS } from "../config/constants";
import { is_native } from ".";


export const get_trade = async( 
    tokenIn: Token, 
    tokenOut: Token, 
    amountIn: string,
    pool: Pool,
    slipage: number,
    deadline: number | undefined,
    network: string,
    signer: Wallet
): Promise<Trade> => {

    try {

        const Router = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer )

        const reserve_in: number  = tokenIn.address === pool.tokenA ? parseFloat( ethers.formatUnits( pool.reserveA, tokenIn.decimals) ) : parseFloat( ethers.formatUnits( pool.reserveB, tokenIn.decimals ) )
        const reserve_out: number = tokenOut.address === pool.tokenA ? parseFloat( ethers.formatUnits( pool.reserveA, tokenOut.decimals) ) : parseFloat( ethers.formatUnits( pool.reserveB, tokenOut.decimals ) )

        const amount_in: bigint      = ethers.parseUnits( amountIn, tokenIn.decimals ) 
        const amount_out: bigint     = ethers.parseUnits( (parseFloat( amountIn ) * reserve_out / reserve_in).toString(), tokenOut.decimals )
        console.log(amount_out)
        const amount_out_min: bigint = amount_out * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        
        return { 
            tokenFrom: tokenIn,
            tokenTo: tokenOut,
            pool: pool,
            amountIn: amount_in, 
            amountOut: amount_out, 
            amountOutMin: amount_out_min, 
            priceImpact: 0,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20 // 20 minutes from the current Unix time
        }

    } catch (error) {
        
        throw error

    }
}

export const calc_price_impact = async( trade: Trade, pool: Pool, network: 'TESTNET' | 'MAINNET', signer: Wallet ): Promise<number> => {

    let percent: number

    const Router = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer )

    const reserve_in  = trade.tokenFrom.address === pool.tokenA ? pool.reserveA : pool.reserveB
    const reserve_out = trade.tokenTo.address   === pool.tokenA ? pool.reserveA : pool.reserveB

    const quoteOut: bigint = await Router.quote( trade.amountIn, reserve_in, reserve_out )
    const diffOut: bigint  = trade.amountOut * reserve_out / quoteOut

    percent = 10000 - parseFloat( (reserve_out * BigInt( 10000 ) / diffOut).toString() )

    const priceImpact = percent < 0 ? -percent / 100 : percent / 100

    return priceImpact
}

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const encode_swap_datas = ( trade: Trade, Router: Contract ): string => {

    let datas: string;

    if ( is_native( trade.tokenFrom.address ) )
    {
        datas = Router.interface.encodeFunctionData( "swapExactETHForTokens", [
            trade.amountOutMin,
            [ trade.tokenFrom.address, trade.tokenTo.address ],
            Router.target.toString(),
            trade.deadline,
            [ false ]
        ] )
    }
    else if ( is_native( trade.tokenTo.address ) )
    {
        datas = Router.interface.encodeFunctionData( "swapExactTokensForETH", [
            trade.amountIn,
            trade.amountOutMin,
            [ trade.tokenFrom.address, trade.tokenTo.address ],
            Router.target.toString(),
            trade.deadline,
            [ false ]
        ] )
    }
    else
    {
        datas = Router.interface.encodeFunctionData( "swapExactTokensForTokens", [
            trade.amountIn,
            trade.amountOutMin,
            [ trade.tokenFrom.address, trade.tokenTo.address ],
            Router.target.toString(),
            trade.deadline,
            [ false ]
        ] )
    }

    return datas
}