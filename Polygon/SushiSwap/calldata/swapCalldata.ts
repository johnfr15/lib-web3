import { Wallet, Contract } from "ethers";
import { get_balance, get_pool, get_token } from "../utils";
import { TICKER, V2_ROUTER_ABI, V2_ROUTER } from "../config/constants";
import { calc_price_impact, get_trade } from "../utils/swap";
import { Token, Pool, Trade, SwapTx } from "../types";



export const get_swap_tx = async(
    signer: Wallet,
    path: [string, string],
    amountIn: string | null,
    amountOut: string | null,
    network: 'TESTNET' | 'MAINNET',
    slipage: number,
    priceImpact: number,
    deadline?: number,
): Promise<SwapTx> => {

    try {

        const Router = new Contract( V2_ROUTER, V2_ROUTER_ABI, signer )

        const balance_in        = await get_balance( path[0], signer )
        const token_in: Token   = await get_token( path[0], network )
        const token_out: Token  = await get_token( path[1], network )
        const pool: Pool        = await get_pool( token_in, token_out, signer )
        const trade: Trade      = await get_trade( signer, token_in, token_out, amountIn, amountOut, pool, slipage, deadline, network )

        trade.priceImpact       = await calc_price_impact( trade, pool )
        

        if ( trade.priceImpact > priceImpact )
            throw new Error(`Price impact tolerance exceeded: ${ trade.priceImpact }% of impact caused with this trade`)
        if ( balance_in.bigint === BigInt( 0 ) )
            throw new Error(`Error: Balance of token ${ TICKER[ path[0] ] } is empty`)

        const swapTx: SwapTx = {
            signer: signer,
            trade: trade,
            tokenA: token_in,
            tokenB: token_out,
            path: path,
            Router: Router
        }

        return swapTx 

    } catch (error: any) {
        
        throw error

    }
}