import { Wallet, Contract, ethers } from "ethers";
import { MINIMUM_GAS, STARGATE_ADAPTER, STARGATE_ADAPTER_ABI, STARGATE_CHAIN_ID, STARGATE_POOL_IDS, Stargate_func } from "../config/constants";
import { Chains, StargateTeleportParams, Token, Bridge, BridgeParams } from "../types";

export const get_stargate_params = ( 
    signer: Wallet,
    tokenFrom: Token, 
    tokenTo: Token, 
    fromChain: Chains, 
    toChain: Chains, 
    amount: bigint,
    slipage: number
): StargateTeleportParams => {

    const stargateTeleportParams: StargateTeleportParams = {

        dstChainId: STARGATE_CHAIN_ID[ toChain ],
        token: tokenFrom.address,
        srcPoolId: STARGATE_POOL_IDS[ fromChain ][ tokenFrom.symbol ],
        dstPoolId: STARGATE_POOL_IDS[ toChain ][ tokenTo.symbol ],
        amount: amount,
        amountMin: amount * BigInt( (100 - slipage) * 100 ) / BigInt( 100 * 100 ),
        dustAmount: BigInt( 0 ),
        receiver: signer.address,
        to: signer.address,
        gas:  BigInt( 0 ),

    }

    return stargateTeleportParams
}

/**
 * @dev This fees represent the cost needed for the target chain operations
 */
export const getFee = async( signer: Wallet, stp: StargateTeleportParams, chainFrom: Chains ): Promise<bigint> => {

    try {

        const StargateAdapter = new Contract( STARGATE_ADAPTER[ chainFrom ], STARGATE_ADAPTER_ABI, signer )
        const functionType: number = Stargate_func.SWAP_REMOTE

        const fees = await StargateAdapter.getFee( stp.dstChainId, functionType, signer.address, stp.gas, stp.dustAmount, "0x" )

        return fees.a

    } catch (error) {
        
        throw( error )

    }
}

export const encode_stp = ( stp: StargateTeleportParams ) => {

    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint16", "address", "uint256", "uint256", "uint256", "uint256", "uint256", "address", "address", "uint256" ],
        Object.values( stp )
    )

    return encoded
}

export const get_bridge = ( signer: Wallet, stpEncoded: string, tokenIn: Token, chain: Chains, amount: bigint ): Bridge => {

    const bridge_params: BridgeParams = {
        refId: "0x0001",
        adapter: STARGATE_ADAPTER[ chain ],
        tokenIn: tokenIn.address,
        amountIn: amount,
        to: signer.address,
        adapterData: stpEncoded
    }

    const encoded_bridge_params: string = ethers.AbiCoder.defaultAbiCoder().encode(
        ["bytes2", "address", "address", "uint256", "address", "bytes"], 
        Object.values( bridge_params )
    )

    const bridge: Bridge = {
        bridgeParams: encoded_bridge_params,
        refundAddress: signer.address,
        swapPayload: "0x",
        payloadData: "0x"
    }

    return bridge
}