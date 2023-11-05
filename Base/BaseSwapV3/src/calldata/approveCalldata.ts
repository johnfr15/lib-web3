import { is_native } from "../utils";
import { ApproveTx, Token } from "../../types";
import { ethers, Wallet, Contract } from "ethers";
import { ERC20_ABI } from "../../config/constants";

export const get_approve_tx = async(
    signer: Wallet, 
    token: Token,
    spender: string,
    amount: string, 
): Promise<ApproveTx | undefined> => {

    try {
        
        if ( is_native( token.address ) ) 
            return undefined

        const erc20 = new Contract( token.address, ERC20_ABI, signer );

        const big_amount = ethers.parseUnits( amount, token.decimals )
    
        const approveTx: ApproveTx = {
            signer: signer, 
            Erc20: erc20, 
            token: token, 
            spender: spender, 
            amount: big_amount
        }

        return approveTx

    } catch (error: any) {
        
        throw error

    }

}