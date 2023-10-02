import { Wallet, Contract, ethers } from "ethers";
import { ROUTER, ROUTER_ABI, STARGATE_CHAIN_ID, STARGATE_POOL_IDS } from "../config/constants";
import { Chains, FUNCTION_TYPE, StargateParams, Token } from "../types";

export const get_stargate_params = ( 
    signer: Wallet,
    tokenFrom: Token, 
    tokenTo: Token, 
    fromChain: Chains, 
    toChain: Chains, 
    amount: bigint,
    slipage: number
): StargateParams => {

    const StargateParams: StargateParams = {

        dstChainId: STARGATE_CHAIN_ID[ toChain ],
        srcPoolId: STARGATE_POOL_IDS[ fromChain ][ tokenFrom.symbol ],
        dstPoolId: STARGATE_POOL_IDS[ toChain ][ tokenTo.symbol ],
        refundAddress: signer.address,
        amount: amount,
        amountMin: amount * BigInt( (100 - slipage) * 100 ) / BigInt( 100 * 100 ),
        lzTxParams: { 
            dstGasForCall: 0,
            dstNativeAmount: 0,
            dstNativeAddr: "0x",
        },
        to: ethers.zeroPadBytes( signer.address, 32 ),
        payload: "0x",

    }

    return StargateParams
}

/**
 * @dev This fees represent the cost needed for the target chain operations
 */
export const getFee = async( signer: Wallet, sp: StargateParams, chainFrom: Chains ): Promise<bigint> => {

    try {

        const Router = new Contract( ROUTER[ chainFrom ], ROUTER_ABI, signer )
        const functionType: number = FUNCTION_TYPE.SWAP_REMOTE

        let quoteData = await Router.quoteLayerZeroFee(
            sp.dstChainId,
            functionType,
            signer.address,
            "0x",
            sp.lzTxParams
        )

        return quoteData[0]

    } catch (error) {
        
        throw( error )

    }
}