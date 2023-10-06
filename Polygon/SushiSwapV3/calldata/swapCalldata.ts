import { Wallet, Contract } from "ethers";
import { get_balance, get_pool, get_token } from "../utils";
import { SWAP_ROUTER, SWAP_ROUTER_ABI } from "../config/constants";
import { get_trade } from "../utils/swap";
import { Token, Pool, Trade, SwapTx, Options, Chains } from "../types";



export const get_swap_tx = async(
    signer: Wallet,
    path: [string, string],
    amountIn: string | null,
    amountOut: string | null,
    chain: Chains,
    options: Options
): Promise<SwapTx> => {

    try {

        const SwapRouter = new Contract( SWAP_ROUTER[ chain ], SWAP_ROUTER_ABI, signer )

        const balance_in        = await get_balance( path[0], signer )
        const token_in: Token   = await get_token( path[0], chain )
        const token_out: Token  = await get_token( path[1], chain )
        const pool: Pool        = await get_pool( token_in, token_out, signer, chain )
        const trade: Trade      = await get_trade( signer, token_in, token_out, amountIn, amountOut, pool, chain, options )


        // trade.priceImpact       = await calc_price_impact( trade, pool )
        

        // if ( trade.priceImpact > options.slipage! )
        //     throw new Error(`Price impact tolerance exceeded: ${ trade.priceImpact }% of impact caused with this trade`)
        if ( balance_in.bigint === BigInt( 0 ) )
            throw new Error(`Error: Balance of token ${ token_in.symbol } is empty`)
        if ( balance_in.bigint < (trade.amountInMax ?? trade.amountIn) )
            throw new Error(`Error: Not enough balance require ${ trade.amountInMax ?? trade.amountIn } ${ token_in.symbol } for this trade`)

            
        const swapTx: SwapTx = {
            signer: signer,
            trade: trade,
            SwapRouter: SwapRouter
        }

        return swapTx 

    } catch (error: any) {
        
        throw error

    }
}