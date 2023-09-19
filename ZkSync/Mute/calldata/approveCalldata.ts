import { ethers, Wallet, Contract, TransactionRequest } from "ethers";
import { ERC20_ABI, ROUTER_ADDRESS } from "../config/constants";

export const get_approve_tx = async(
    signer: Wallet, 
    amount: string, 
    tokenAddress: string, 
    network: string
): Promise<TransactionRequest> => {

    try {
        
        const router_address = ROUTER_ADDRESS[ network ]
        const erc20 = new Contract( tokenAddress, ERC20_ABI, signer );

        const decimals = await erc20.decimals()
        const big_amount =  ethers.parseUnits( amount, decimals )
        

        const approveTx: TransactionRequest = {
            to: tokenAddress,
            data: erc20.interface.encodeFunctionData( "approve", [ router_address, big_amount ]),
        }
    
        return approveTx

    } catch (error: any) {
        
        throw error

    }

}