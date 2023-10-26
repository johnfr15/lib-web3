import { Wallet, ethers } from "ethers";
import { Chains, BridgeOptions, BridgeTx, Token } from "../../type/types";
import { Quote, RouteData } from "../../type/api/quote";
import { get_token } from "../utils";
import { fetch_quote } from "../utils/bridge";
import { get_balance } from "../../api/Balances/token-balance" 
import { post_build_tx } from "../../api/App/build-tx"
import { Balance } from "../../type/api/balances";
import { CHAIN_ID, NATIVE_TOKEN } from "../../config/constants";
import { RouteTx } from "../../type/api/app";
import { get_route } from "../utils/bridge";


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

        if ( big_amount > BigInt( balance_from.balance ) )
            throw( `Error: No enough balance for amount ${ ethers.formatUnits (big_amount, balance_from.decimals ) } ${ token_from.symbol } in ${ fromChain }.`)


        const quote: Quote = await fetch_quote( signer, token_from, token_to, fromChain, toChain, big_amount, options )

        if ( quote.routes.length === 0 )
            throw( `Error: No route found for ${ fromChain } ${ ethers.formatUnits (big_amount, balance_from.decimals ) } ${ token_from.symbol } to ${ toChain } ${ token_to.symbol }.`)


        const route: RouteData | undefined = get_route( quote.routes, options.securityBridges! )

        if ( route === undefined )
            throw(`Error: No route with a minumum security of ${ options.securityBridges! } found.`)
        if ( BigInt( route.userTxs[0].gasFees.gasAmount ) > balance_native.balance )
            throw(`Error: Not enough native balance for paying gas fees. Balance: ${ ethers.formatEther( balance_native.balance ) } ${ balance_native.symbol }, Fees: ${ ethers.formatEther( route.userTxs[0].gasFees.gasAmount )} ${ balance_native.symbol }.`)


        const routeTx: RouteTx = await post_build_tx( route )

        const brideTx: BridgeTx = { 
            signer: signer,
            fromToken: token_from,
            toToken: token_to,
            fromChain: fromChain,
            toChain: toChain,
            amount: big_amount,
            quote: quote,
            userTx: route.userTxs[0],
            routeTx: routeTx,
        }

        return brideTx

    } catch (error: any) {
        
        throw( error )

    }
}
