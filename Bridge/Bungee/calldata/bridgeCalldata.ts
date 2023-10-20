import { Wallet, ethers } from "ethers";
import { Chains, BridgeOptions, BridgeTx, Token } from "../type/types";
import { Quote } from "../type/api/quote";
import { get_token } from "../utils";
import { fetch_quote } from "../utils/bridge";
import { get_balance } from "../api/Balances/token-balance" 
import { fetch_tx } from "../utils/bridge";
import { get_build_tx } from "../api/App/build-tx"
import { Balance } from "../type/api/balances";
import { CHAIN_ID, NATIVE_TOKEN, TOKENS } from "../config/constants";
import { RouteTx } from "../type/api/app";


export const get_bridge_tx = async(
    signer: Wallet,
    tokenFrom: string,
    tokenTo: string,
    fromChain: Chains, 
    toChain: Chains,
    amount: string | null,
    options: BridgeOptions,
): Promise<BridgeTx> => {

    try {

        if ( options?.max === false && amount === null )
            throw( `Error: in the options param you either need to specify "max" to true or set a number for 'amount'.`)
        
        const token_from: Token       = await get_token( tokenFrom, fromChain )
        const token_to: Token         = await get_token( tokenTo, toChain )
        const balance_from: Balance   = await get_balance( tokenFrom, CHAIN_ID[ fromChain ], signer.address )
        const balance_native: Balance = await get_balance( NATIVE_TOKEN, CHAIN_ID[ fromChain ], signer.address )

        const big_amount: bigint = options.max ? balance_from.balance : ethers.parseUnits( amount!, token_from.decimals)
        const quote: Quote = await fetch_quote( signer, token_from, token_to, fromChain, toChain, big_amount, options )


        if ( quote.routes.length === 0 )
            throw( `Error: No route found for ${ fromChain } ${ ethers.formatUnits( balance_from.balance, balance_from.decimals ) } ${ token_from.symbol } to ${ toChain } ${ token_to.symbol }.`)

        
        const routeTx: RouteTx = await fetch_tx( quote )

        const brideTx: BridgeTx = { 
            signer: signer,
            fromToken: token_from,
            toToken: token_to,
            fromChain: fromChain,
            toChain: toChain,
            amount: big_amount,
            quote: quote,
            routeTx: routeTx,
        }

        return brideTx

    } catch (error: any) {
        
        throw( error )

    }
}
