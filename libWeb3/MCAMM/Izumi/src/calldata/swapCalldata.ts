import { Wallet, Contract } from "ethers";
import { get_balance, get_pool, get_token } from "../utils";
import { CONTRACTS, SWAP_ABI } from "../../config/constants";
import { get_trade, calc_price_impact, get_amount } from "../utils/swap";
import { Token, Pool,  Chains, Balance } from "../../types";
import { Trade, SwapTx, SwapOptions } from "../../types/swap"



export const get_swap_tx = async(
    signer: Wallet,
    path: [string, string],
    amount: string | null,
    chain: Chains,
    options: SwapOptions
): Promise<SwapTx> => {

    try {

        const Swap = new Contract( CONTRACTS[ chain ].periphery.swap, SWAP_ABI, signer )

        const balance_in: Balance  = await get_balance( path[0], signer )
        const balance_out: Balance = await get_balance( path[1], signer )
        const token_in: Token      = await get_token( path[0], chain )
        const token_out: Token     = await get_token( path[1], chain )
        const pool: Pool           = await get_pool( token_in, token_out, signer, chain, options.fee )

        amount = get_amount( amount, balance_in, balance_out, options )
        const trade: Trade = await get_trade( signer, token_in, token_out, amount, pool, chain, options )

        trade.priceImpact = await calc_price_impact( trade, pool )

        
        if ( trade.priceImpact > options.slipage! )
            throw new Error(`Price impact tolerance exceeded: ${ trade.priceImpact }% of impact caused with this trade`)
        if ( balance_in.bigint === BigInt( 0 ) )
            throw new Error(`Error: Balance of token ${ token_in.symbol } is empty`)
        if ( balance_in.bigint < (trade.amountInMax ?? trade.amountIn) )
            throw new Error(`Error: Not enough balance require ${ trade.amountInMax ?? trade.amountIn } ${ token_in.symbol } for this trade`)

            
        const swapTx: SwapTx = {
            signer: signer,
            trade: trade,
            Swap: Swap
        }

        return swapTx 

    } catch (error: any) {
        
        throw error

    }
}