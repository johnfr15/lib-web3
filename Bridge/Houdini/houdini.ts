import { Wallet } from "ethers";
import { TokenId, Network, SwapOptions, SwapTx, Trade, Order } from "./types";
import { resolve_chain } from "./utils"
import { create_order } from "./api/exchange";
import { get_trade } from "./utils/swap";
import { exec_order } from "./transactions/swap";
import { DEFAULT_OPTION } from "./config/constants"


/**
 * @name bridge
 * @param signer        - Wallet to perform the swap
 * @param tokenFrom     - Token to be bridge
 * @param tokenTo       - Token to be received in the target chain
 * @param fromChain     - Current chain 
 * @param toChain       - target chain
 * @param options
 *        - receiveAddress:  (optional) the wallet that will receive the funds on the target network
 *        - slipage:         (optional) protection against price movement or to high price impact default is 0.5%
 *        - anonymous:       (optional) if set to true houdini will perform extra swaps on Monero (increase fees by 1%)
 *        - ip:              (optional) ip address
 *        - userAgent:       (optional) The application agent that send request to houdini
 */
export const bridge = async(
    signer: Wallet,
    amount: string,
    tokenFrom: TokenId,
    tokenTo: TokenId,
    fromNetwork: Network, 
    toNetwork: Network,
    options?: SwapOptions
) => {

    signer = resolve_chain( signer, fromNetwork )
    options = { ...DEFAULT_OPTION, ...options }
    
    try {

        const trade: Trade = await get_trade( signer, amount, tokenFrom, tokenTo, fromNetwork, toNetwork, options )
        const order: Order = await create_order( trade.eo )

        const swapTx: SwapTx = { signer, trade, order }

        /*========================================= TX =================================================================================================*/
        await exec_order( swapTx )
        /*==============================================================================================================================================*/
        
    } catch (error) {
        
        throw( error )

    }
}