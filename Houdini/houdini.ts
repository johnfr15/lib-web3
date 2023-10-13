import { Wallet } from "ethers";
import { TokenId, Network, SwapOptions, SwapTx, Trade, Order } from "./types";
import { resolve_chain } from "./utils"
import { create_order } from "./api/exchange";
import { get_trade } from "./utils/swap";
import { exec_order } from "./transactions/swap";
import { DEFAULT_OPTION } from "./config/constants"


/**
 * @name swap
 * @param signer        - Wallet to perform the swap
 * @param tokenFrom     - Token to be brTokenIdge
 * @param tokenTo       - Token to be received in the target chain
 * @param fromChain     - Current chain 
 * @param toChain       - target chain
 * @param options
 *        - slipage:      (optional) protection against price movement or to high price impact default is 0.5%
 */
export const swap = async(
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