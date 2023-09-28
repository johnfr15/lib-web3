import { Wallet, Contract } from "ethers";
import { get_balance, get_token } from "../utils";
import { get_trade } from "../utils/swap"
import { TICKER, UNIVERSAL_ROUTER, UNIVERSAL_ROUTER_ABI, V2_ROUTER_ABI, V3_ROUTER_ADDRESS } from "../config/constants";
import { SwapTx } from "../types";
import { Token, Percent, Fraction, } from "@uniswap/sdk-core";
import { SwapOptionsSwapRouter02, SwapType } from "@uniswap/smart-order-router";


export const get_swap_tx = async(
    signer: Wallet,
    path: [string, string],
    amountIn: string | null,
    amountOut: string | null,
    slipageTolerance: number,
    priceImpact: number,
    network: 'TESTNET' | 'MAINNET',
    deadline?: number
): Promise<SwapTx> => {

    try {

        const balance_in        = await get_balance( path[0], signer )
        const token_in: Token   = await get_token( path[0], network )
        const token_out: Token  = await get_token( path[1], network )
        
        const options: SwapOptionsSwapRouter02 = {
            recipient: signer.address,
            slippageTolerance: new Percent( slipageTolerance ),
            deadline: deadline ?? Math.floor(Date.now() / 1000 + 1800),
            type: SwapType.SWAP_ROUTER_02,
        }

        const trade = await get_trade( token_in, token_out, amountIn, amountOut, options, network )
        const Router = new Contract( UNIVERSAL_ROUTER, UNIVERSAL_ROUTER_ABI, signer)

        
        if ( trade.trade.priceImpact.greaterThan( new Fraction( priceImpact )) )
            throw new Error(`Price impact tolerance exceeded: ${  trade.trade.priceImpact.toSignificant(2) }% of impact caused with this trade`)
        if ( balance_in.bigint === BigInt( 0 ) )
            throw new Error(`Error: Balance of token ${ TICKER[ path[0] ] } is empty`)

        
        return {
            signer: signer,
            trade: trade,
            path: [ token_in.address, token_out.address ],
            slipage: slipageTolerance,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
            network: network,
            Router: Router
        } 

    } catch (error: any) {
        
        throw error

    }
}