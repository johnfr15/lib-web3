import { Wallet, Contract } from "ethers";
import { Token, Pool, Balance } from "../../types";
import { get_balance, get_pool, get_token } from "../utils";
import { CONTRACTS, ROUTER_ABI } from "../../config/constants";
import { Trade, SwapTx, SwapOptions } from "../../types/swap";
import { get_trade, calc_price_impact, get_amount } from "../utils/swap";



export const  get_swap_tx = async(
    signer: Wallet,
    path: [string, string],
    amount: string | null,
    options: SwapOptions
): Promise<SwapTx> => {

    try {

        const Router = new Contract( CONTRACTS.ROUTER, ROUTER_ABI, signer )

        const balance_in: Balance  = await get_balance( path[0], signer )
        const token_in: Token      = await get_token( path[0] )
        const token_out: Token     = await get_token( path[1] )
        const pool: Pool           = await get_pool( token_in, token_out, signer, options )

        amount = get_amount( amount, balance_in, options )
        const trade: Trade = await get_trade( signer, token_in, token_out, amount, pool, options )

        trade.priceImpact = await calc_price_impact( trade, pool )

        
        // if ( trade.priceImpact > options.slipage! )
        //     throw new Error(`Price impact tolerance exceeded: ${ trade.priceImpact }% of impact caused with this trade`)
        // if ( balance_in.bigint === BigInt( 0 ) )
        //     throw new Error(`Error: Balance of token ${ token_in.symbol } is empty`)
        // if ( balance_in.bigint < trade.amountIn )
        //     throw new Error(`Error: Not enough balance require ${ trade.amountIn } ${ token_in.symbol } for this trade`)

            
        const swapTx: SwapTx = {
            signer: signer,
            trade: trade,
            Router: Router,
            options: options
        }

        return swapTx 

    } catch (error: any) {
        
        throw error

    }
}