import { Wallet } from "ethers";
import { Chains, BridgeOptions, Token } from "../../types/types";
import { QuoteParams, Quote, QuoteOptions, RouteData } from "../../types/api/quote";
import { get_quote } from "../../api/Quote/quote"
import { CHAIN_ID } from "../../config/constants";

export const fetch_quote = async(
    signer: Wallet,
    tokenFrom: Token,
    tokenTo: Token,
    fromChain: Chains, 
    toChain: Chains,
    amount: bigint,
    options: BridgeOptions,
): Promise<Quote> => {

    const quote_params: QuoteParams = {
        fromChainId: CHAIN_ID[ fromChain ],
        fromTokenAddress: tokenFrom.address,
        toChainId: CHAIN_ID[ toChain ],
        toTokenAddress: tokenTo.address,
        fromAmount: amount,
        userAddress: signer.address,
        uniqueRoutesPerBridge: options.uniqueRoutesPerBridge!,
        sort: options.sort!
    }

    const quote_options: QuoteOptions = {
        singleTxOnly: true,
        bridgeWithInsurance: true,
        isContractCall: false,
        defaultSwapSlippage: options.slipage,
        defaultBridgeSlippage: options.slipage
    }
    

    try {

        const quote: Quote = await get_quote( quote_params, quote_options )
        quote.fromToken = tokenFrom
        quote.toToken = tokenTo

        return quote
        
    } catch (error) {
        
        throw( error )

    }
}

export const get_route = ( routes: RouteData[], minSecurity: number, index: number = 0 ): RouteData | undefined => {

    if ( routes[ index ] === undefined )
        return

    const { stepCount, steps } = routes[ index ].userTxs[0]

    // Last step is always the bridge step which we want to know its security
    if ( steps[ stepCount - 1 ].protocol.securityScore >= minSecurity )
        return routes[ index ]

    return get_route( routes, minSecurity, index + 1)
}