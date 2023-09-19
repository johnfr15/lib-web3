import { Wallet, Contract, TransactionRequest, ethers } from "ethers";
import { get_pool, get_token, is_native } from "../utils";
import { ROUTER_ADDRESS, MUTE_ROUTER_ABI, MUTE_PAIR_ABI } from "../config/constants";
import { calc_price_impact, encode_swap_datas, get_trade } from "../utils/swap";
import { Token, Pool, Trade } from "../types";



export const get_swap_tx = async(
    signer: Wallet,
    path: [string, string],
    amountIn: string,
    network: 'TESTNET' | 'MAINNET',
    slipage: number,
    priceImpact: number,
    deadline?: number,
): Promise<{ swapTx: TransactionRequest, trade: Trade, pool: Pool }> => {

    try {

        const Router = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer )
        
        const token_in: Token   = await get_token( path[0], network, signer )
        const token_out: Token  = await get_token( path[1], network, signer )
        const pool: Pool        = await get_pool( token_in, token_out, network, signer )
        const trade: Trade      = await get_trade( token_in, token_out, amountIn, pool, slipage, deadline, network, signer )

        trade.priceImpact = await calc_price_impact( trade, pool, network, signer )
        
        
        if ( trade.priceImpact > priceImpact )
            throw new Error(`Price impact tolerance exceeded: ${ trade.priceImpact }`)

        const datas = encode_swap_datas( trade, Router )

        const swapTx: TransactionRequest = {
            to: ROUTER_ADDRESS[ network ],
            value: is_native( path[0] ) ? trade.amountIn : '',
            data: datas
        }

        return { swapTx, trade, pool } 

    } catch (error: any) {
        
        throw error

    }
}