import { ethers, Wallet, Contract } from "ethers";
import { ERC20_ABI, ROUTER } from "../config/constants";
import { ApproveTx, Chains, Token } from "../types";
import { is_native } from "../utils";

export const get_approve_tx = async(
    signer: Wallet, 
    amount: string, 
    token: Token,
    chain: Chains
): Promise<ApproveTx | undefined> => {

    try {
        
        if ( is_native( token.address, chain ) ) 
            return undefined

        const router_address = ROUTER[ chain ]
        const erc20 = new Contract( token.address, ERC20_ABI, signer );

        const decimals = await erc20.decimals()
        const big_amount =  ethers.parseUnits( amount, decimals )
    
        const approveTx: ApproveTx = { 
            signer: signer, 
            Erc20: erc20, 
            spender: router_address, 
            amount: big_amount, 
            token: token,
        }

        return approveTx

    } catch (error: any) {
        
        throw error

    }

}