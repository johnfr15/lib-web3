import { ethers } from "ethers";
import { Contract, Account, uint256 } from "starknet"
import { ERC20_ABI, ROUTER_ADDRESSES } from "../constant";
import { ApproveCallData } from "../types";

export const get_approve_calldata = async(
    signer: Account, 
    amount: string, 
    tokenAddress: string, 
    network: string
): Promise<ApproveCallData> => {

    try {
        
        const l0k_router_address = ROUTER_ADDRESSES[ network ]
        const erc20 = new Contract( ERC20_ABI, tokenAddress, signer );
        const { decimals } = await erc20.decimals()
        const big_amount = uint256.bnToUint256( ethers.parseUnits( amount, decimals ) * BigInt( 12 ) / BigInt( 10 ) )


        const calldata: ApproveCallData = {
            contractAddress: erc20.address,
            entrypoint: "approve",
            calldata: [ l0k_router_address, big_amount ],
        }
    
        return calldata

    } catch (error: any) {
        
        throw error

    }

}