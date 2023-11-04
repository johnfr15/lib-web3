import { Wallet, Contract } from "ethers";
import { SwapOptions } from "../../types/swap";
import { get_balance, get_pool, get_token } from "../utils";
import { Token, Pool, Trade, SwapTx, Balance } from "../../types";
import { CONTRACTS, SWAP_ROUTER_ABI } from "../../config/constants";
import { get_trade,  get_amount } from "../utils/swap";



export const get_swap_tx = async(
    signer: Wallet,
    path: [string, string],
    amount: string | null,
    options: SwapOptions
): Promise<SwapTx> => {

    const SwapRouter = new Contract( CONTRACTS.SWAP_ROUTER_V3, SWAP_ROUTER_ABI, signer )

    const balance_in: Balance = await get_balance( path[0], signer )
    const token_in: Token     = await get_token( path[0] )
    const token_out: Token    = await get_token( path[1] )
    const pool: Pool          = await get_pool( token_in, token_out, signer )

    const amount_in: string = get_amount( amount, balance_in, options )
    const trade: Trade = await get_trade( signer, token_in, token_out, amount_in, pool, options )

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
}