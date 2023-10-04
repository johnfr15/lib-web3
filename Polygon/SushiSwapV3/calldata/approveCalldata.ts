import { ethers, Wallet, Contract } from "ethers";
import { ERC20_ABI, SWAP_ROUTER } from "../config/constants";
import { ApproveTx, Chains, Token } from "../types";
import { is_native } from "../utils";

export const get_approve_tx = async(
    signer: Wallet, 
    token: Token,
    amount: string, 
    chain: Chains
): Promise<ApproveTx | undefined> => {

    try {
        
        if ( is_native( token.address, chain ) ) 
            return undefined

        const swapRouter = SWAP_ROUTER[ chain ]
        const erc20 = new Contract( token.address, ERC20_ABI, signer );

        const big_amount = ethers.parseUnits( amount, token.decimals )
    
        return { signer: signer, Erc20: erc20, token: token, chain: chain, spender: swapRouter, amount: big_amount }

    } catch (error: any) {
        
        throw error

    }

}