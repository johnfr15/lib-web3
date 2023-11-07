import { Wallet } from "ethers";
import { resolve_chain } from "./utils";
import { exec_bridge } from "./transactions/bridge";
import { exec_approve } from "./transactions/approve";
import { Chains, BridgeOptions } from "../types/types";
import { get_bridge_tx } from "./calldatas/bridgeCalldata";
import { DEFAULT_BRIDGE_OPTION } from "../config/constants";



/**
 * @name bridge
 * @param signer        - Wallet to perform the swap
 * @param tokenFrom     - Token to be bridge
 * @param tokenTo       - Token to be received in the target chain
 * @param fromChain     - Current chain 
 * @param toChain       - target chain
 * @param options       
 *   - max:               (optional) Will bridge maximum amount from balance of 'tokenFrom' of signer. (DEFAULT => false)
 *   - percent:           (optional) Will bridge 'percent' of amount from balance of 'tokenFrom' of signer
 *   - slipage:           (optional) protection against price movement or to high price impact. (DEFAULT => 0.5)
 *   - sort               (optional): Which kind of transactions we would priotirize (DEFAULT => output)
 *   - uniqueRoutesPerBridge (optional): If we plan to bundle everything in a single transaction (DEFAULT => true)
 *   - securityBridges    (optional): It is the minimum security score (defined by https://l2beat.com/bridges/risk) of a brige we allow to use (DEFAULT => 3)
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