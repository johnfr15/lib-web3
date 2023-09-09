import { ethers } from "ethers";
import { Account, Contract, Uint256 } from "starknet"
import { TradeType, TokenAmount, Route, Percent, Token, JSBI, Pair } from "l0k_swap-sdk";
import { SwapCallData } from "../types";
import { get_pool, get_token, jsbi_to_Uint256, sort_tokens } from "../utils";
import { ROUTER_ADDRESS, JEDI_ROUTER_ABI } from "../constant";
import { Pool, Trade } from "../types";
import { get_trade } from "../utils/swap";



export const get_swap_calldata = async(
    signer: Account,
    path: [string, string],
    amountIn: string | null,
    amountOut: string | null,
    network: 'TESTNET' | 'MAINNET',
    slipage: number,
    priceImpact: number,
    deadline?: number,
): Promise<SwapCallData | void> => {

    let amount_out_min: Uint256
    let amount_in_max: Uint256

    try {

        const Router = new Contract( JEDI_ROUTER_ABI, ROUTER_ADDRESS[ network ], signer )

        const token_in: Token   = await get_token( path[0], network, signer )
        const token_out: Token  = await get_token( path[1], network, signer )
        const pool: Pool        = await get_pool( token_in, token_out, network, signer )
        const trade: Trade      = await get_trade( token_in, amountIn, token_out, amountOut, pool, Router )

        if ( trade.priceImpact > priceImpact )
            throw new Error(`Price impact tolerance exceeded: ${ trade.priceImpact }`)
    
/*
        if ( trade.tradeType === 0 ) amount_out_min = trade.minimumAmountOut( new Percent( BigInt( slipage * 100 ), BigInt( 100 * 100 ) ) ).raw
        if ( trade.tradeType === 1 ) amount_in_max  = trade.maximumAmountIn( new Percent( BigInt( 100 * 100 ), BigInt( slipage * 100 ) ) ).raw

        deadline = deadline ? deadline : Math.floor( Date.now() / 1000 ) + 60 * 20 // 20 minutes from the current Unix time
        const calldata: SwapCallData = {
            contractAddress: l0k_router.address,
            entrypoint: trade.tradeType ? "swapTokensForExactTokens" : "swapExactTokensForTokens",
            calldata: [
                amount_in_max ? jsbi_to_Uint256( amount_in_max, token_in.decimals ) : jsbi_to_Uint256( amount_in!.raw, token_in.decimals ),
                amount_out_min ? jsbi_to_Uint256( amount_out_min, token_out.decimals ) : jsbi_to_Uint256( amount_out!.raw, token_out.decimals ), 
                path,
                signer.address,
                deadline,
            ],
            utils: {
                priceImpact: trade.priceImpact.toSignificant(2),
                tradeType: trade.tradeType
            }
        }

        return calldata
*/
    } catch (error: any) {
        
        throw error

    }
}