import { Account, Contract, Uint256 } from "starknet"
import { TradeType, Token } from "l0k_swap-sdk";
import { SwapCallData } from "../types";
import { get_pool, get_token, jsbi_to_Uint256, string_to_Uint256 } from "../utils";
import { ROUTER_ADDRESS, JEDI_ROUTER_ABI } from "../constant";
import { Pool, Trade, SwapTx } from "../types";
import { get_out_min, get_trade, get_in_max } from "../utils/swap";



export const get_swap_calldata = async(
    signer: Account,
    path: [string, string],
    amountIn: string | null,
    amountOut: string | null,
    network: 'TESTNET' | 'MAINNET',
    slipage: number,
    priceImpact: number,
    deadline?: number,
): Promise<SwapTx> => {

    try {

        const Router = new Contract( JEDI_ROUTER_ABI, ROUTER_ADDRESS[ network ], signer )

        const token_in: Token   = await get_token( path[0], network, signer )
        const token_out: Token  = await get_token( path[1], network, signer )
        const pool: Pool        = await get_pool( token_in, token_out, network, signer )
        const trade: Trade      = await get_trade( token_in, amountIn, token_out, amountOut, pool, Router )

        if ( trade.priceImpact > priceImpact )
            throw new Error(`Price impact tolerance exceeded: ${ trade.priceImpact }`)
    
        if ( trade.tradeType === TradeType.EXACT_INPUT ) trade.amountOutMin = get_out_min( trade.amountOut, slipage )
        if ( trade.tradeType === TradeType.EXACT_OUTPUT ) trade.amountInMax = get_in_max( trade.amountIn, slipage )
        
        deadline = deadline ? deadline : Math.floor( Date.now() / 1000 ) + 60 * 20 // 20 minutes from the current Unix time

        const swapCalldata: SwapCallData = {
            contractAddress: Router.address,
            entrypoint: trade.tradeType ? "swap_tokens_for_exact_tokens" : "swap_exact_tokens_for_tokens",
            calldata: [
                amountIn ? string_to_Uint256( amountIn, token_in.decimals ) : string_to_Uint256( amountOut!, token_out.decimals ),
                trade.amountOutMin ?? trade.amountInMax!, 
                path,
                signer.address,
                deadline,
            ],
        }

        return { 
            swapCalldata,
            utils: {
                signer: signer,
                path: path,
                network: network,
                slipage: slipage,
                priceImpact: trade.priceImpact,
                deadline: deadline,
                trade: trade, 
                input: trade.amountInMax ?? string_to_Uint256( amountIn!, token_in.decimals ), 
                output: trade.amountOutMin ?? string_to_Uint256( amountOut!, token_out.decimals )
            } 
        } 

    } catch (error: any) {
        
        throw error

    }
}