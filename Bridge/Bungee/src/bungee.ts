import { Wallet } from "ethers"
import { Chains, BridgeOptions } from "../type/types"
import { resolve_chain } from "./utils"
import { get_bridge_tx } from "./calldatas/bridgeCalldata"
import { exec_approve } from "./transactions/approve"
import { exec_bridge } from "./transactions/bridge"
import { DEFAULT_BRIDGE_OPTION } from "../config/constants"



/**
 * @name bridge
 * @param signer        - Wallet to perform the swap
 * @param tokenFrom     - Token to be bridge
 * @param tokenTo       - Token to be received in the target chain
 * @param fromChain     - Current chain 
 * @param toChain       - target chain
 * @param options       
 *        - max:          (optional) Will bridge maximum amount from balance of 'tokenFrom' of signer
 *        - percent:      (optional) Will bridge 'percent' of amount from balance of 'tokenFrom' of signer
 *        - slipage:      (optional) protection against price movement or to high price impact default is 0.5%
 * 
 */
export const bridge = async(
    signer: Wallet,
    tokenFrom: string,
    tokenTo: string,
    fromChain: Chains, 
    toChain: Chains,
    amount: string | null,
    options?: BridgeOptions,
) => {
    
    options = { ...DEFAULT_BRIDGE_OPTION, ...options }
    
    try {

        signer = resolve_chain( signer, fromChain )

        const bridgeTx = await get_bridge_tx( signer, tokenFrom, tokenTo, fromChain, toChain, amount, options )

        /*========================================= TX =================================================================================================*/
        await exec_approve( bridgeTx )
        await exec_bridge( bridgeTx )
        /*=============================================================================================================================================*/
    } catch (error: any) {

        throw( error )

    }
}