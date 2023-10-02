import { ethers, Wallet, Contract } from "ethers";
import { ERC20_ABI, V2_ROUTER } from "../config/constants";
import { ApproveTx } from "../types";
import { is_native } from "../utils";

export const get_approve_tx = async(
    signer: Wallet, 
    amount: string, 
    tokenAddress: string, 
    network: 'TESTNET' | 'MAINNET'
): Promise<ApproveTx | undefined> => {

    try {
        
        if ( is_native( tokenAddress ) ) 
            return undefined

        const router = V2_ROUTER
        const erc20 = new Contract( tokenAddress, ERC20_ABI, signer );

        const decimals = await erc20.decimals()
        const big_amount = ethers.parseUnits( amount, decimals )
    
        return { Erc20: erc20, spender: router, amount: big_amount, decimals: decimals, network: network }

    } catch (error: any) {
        
        throw error

    }

}