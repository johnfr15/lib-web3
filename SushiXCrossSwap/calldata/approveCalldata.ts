import { ethers, Wallet, Contract } from "ethers";
import { ERC20_ABI, SUSHI_X_SWAP_V2 } from "../config/constants";
import { ApproveTx, Chains, Token } from "../types";
import { is_native } from "../utils";

export const get_approve_tx = async(
    signer: Wallet, 
    amount: string, 
    token: Token,
    chain: Chains
): Promise<ApproveTx | undefined> => {

    try {
        
        if ( is_native( token.address ) ) 
            return undefined

        const router_address = SUSHI_X_SWAP_V2[ chain ]
        const erc20 = new Contract( token.address, ERC20_ABI, signer );

        const decimals = await erc20.decimals()
        const big_amount =  ethers.parseUnits( amount, decimals )
    
        const approveTx: ApproveTx = { 
            signer: signer, 
            Erc20: erc20, 
            spender: router_address, 
            amount: big_amount, 
            token: token,
            network: 'MAINNET'
        }

        return approveTx

    } catch (error: any) {
        
        throw error

    }

}