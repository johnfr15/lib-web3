import { Wallet, ethers, Contract } from "ethers";
import { get_balance, get_token } from "../utils";
import { ROUTER_ABI, ROUTER_ADDRESS, TICKER } from "../config/constants";
import { Token, Trade, Pair, Fetcher, Route, TokenAmount, TradeType, Percent } from "@uniswap/sdk";
import { SwapTx } from "../types";


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
        const pool: Pair        = await Fetcher.fetchPairData( token_in, token_out )
        
        const trade_type: TradeType = amountIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT

        const slipage: Percent        = new Percent( BigInt( slipageTolerance ) )
        const amount_in: TokenAmount  = new TokenAmount( token_in, ethers.parseUnits( amountIn ?? '0', token_in.decimals ) )
        const amount_out: TokenAmount = new TokenAmount( token_out, ethers.parseUnits( amountOut ?? '0', token_out.decimals ) )
        const route: Route            = new Route( [ pool ], token_in )
        const trade: Trade            = new Trade( route, amountIn ? amount_in : amount_out, trade_type )
        const Router: Contract        = new Contract(ROUTER_ADDRESS[ network ], ROUTER_ABI, signer )    


        if ( parseFloat( trade.priceImpact.toFixed(2) ) > priceImpact )
            throw new Error(`Price impact tolerance exceeded: ${ trade.priceImpact }% of impact caused with this trade`)
        if ( balance_in.bigint === BigInt( 0 ) )
            throw new Error(`Error: Balance of token ${ TICKER[ path[0] ] } is empty`)


        return {
            signer: signer,
            Router: Router,
            trade: trade,
            path: path,
            slipage: slipage,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
            network: network
        } 

    } catch (error: any) {
        
        throw error

    }
}