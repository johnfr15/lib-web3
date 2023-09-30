import { Wallet, ethers } from "ethers"
import { Chains, BridgeOptions, BridgeTx, ApproveTx } from "./types"
import { DEFAULT_BRIDGE_OPTION, STARGATE_CHAIN_ID } from "./config/constants"
import { resolve_provider } from "./utils"
import { get_bridge_tx } from "./calldata/bridgeCalldata"
import { get_approve_tx } from "./calldata/approveCalldata"
import { exec_approve } from "./transactions/approve"
import { exec_bridge } from "./transactions/bridge"



/**
 * @name bridge
 * @param signer        - Wallet to perform the swap
 * @param tokenFrom     - Token to be bridge
 * @param tokenTo       - Token to be received in the target chain
 * @param fromChain     - Current chain 
 * @param toChain       - target chain
 * @param options       - (optional) extra options for the tx 
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

        const provider = resolve_provider( STARGATE_CHAIN_ID[ fromChain ] )
        signer = new Wallet( signer.privateKey, provider )

        const bridgeTx: BridgeTx = await get_bridge_tx( signer, tokenFrom, tokenTo, fromChain, toChain, amount, options )
        const amountString: string = ethers.formatUnits( bridgeTx.bridge.bridgeParams.amountIn, bridgeTx.tokenIn.decimals )

        const approveTx: ApproveTx | undefined = await get_approve_tx( signer, amountString, bridgeTx.tokenIn, fromChain )

        /*========================================= TX =================================================================================================*/
        await exec_approve( approveTx )
        await exec_bridge( bridgeTx )
        /*=============================================================================================================================================*/
        
    } catch (error: any) {

        throw error

    }
}