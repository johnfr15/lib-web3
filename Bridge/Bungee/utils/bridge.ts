import { Wallet, ethers, toTwos } from "ethers";
import { Chains, BridgeOptions, Token, BridgeTx } from "../type/types";
import { QuoteParams, Quote, QuoteOptions, RefuelData } from "../type/api/quote";
import { get_quote } from "../api/Quote/quote"
import { CHAIN_ID } from "../config/constants";
import { get_build_tx } from "../api/App/build-tx";
import { start } from "../api/Routes/start"
import { Route, RouteOptions, RouteTx } from "../type/api/app";
import { UserTx } from "../type/api/quote";
import { StartRoute } from "../type/api/routes";

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
        uniqueRoutesPerBridge: true,
        sort: 'output'
    }

    const quote_options: QuoteOptions = {
        includeDexes: ["oneinch", "zerox", "rainbow"]
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

/**
 * @dev In this function the 'bridge' step hold all the informations necessary for the api where they are going to build the tx 
 *      we will send to the blockchain
 * 
 * @notice At some point we need to approve the token 'in' the api is also building the parameters needed for us in 
 *         'approvalData' in RouteTx
 *  
 * @returns {RouteTx} all the information for the 'signer' to send to the blockchain
 */
export const fetch_tx = async( quote: Quote ): Promise<RouteTx> => {

    let tx: RouteTx

    try {

        const { sender, recipient, routePath, steps } = quote.routes[0].userTxs[0]
        const { fromChainId, toChainId, fromAsset, toAsset, fromAmount, toAmount } = steps[ 0 ] 

        if ( steps.length === 1 )
        {
            const route: Route = {
                sender: sender,
                recipient: recipient,
                routePath: routePath,
                fromChainId: fromChainId,
                toChainId: toChainId,
                fromTokenAddress: fromAsset.address,
                toTokenAddress: toAsset.address,
                fromAmount: fromAmount,
                toAmount: toAmount,
                bridgeInputTokenAddress: fromAsset.address,
            }

            const options: RouteOptions = {
                bridgeWithGas: true
            }
    
            tx = await get_build_tx( route, options )

        }
        else
        {
            const { routes, fromChainId, toChainId, fromToken, toToken } = quote

            const startRoute: StartRoute = {
                fromChainId: fromChainId,
                toChainId: toChainId,
                fromAssetAddress: fromToken.address,
                toAssetAddress: toToken.address,
                includeFirstTxDetails: true,
                route: routes[0],
                refuel: quote.refuel,

            }

            tx = await start( startRoute )
        }

        return tx

    } catch (error) {
        
        throw( error )

    }
} 