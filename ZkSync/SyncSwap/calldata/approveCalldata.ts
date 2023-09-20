import { ethers, Wallet, Contract, TransactionRequest } from "ethers";
import { ERC20_ABI, ROUTER_ADDRESS } from "../config/constants";

export const get_approve_tx = async(
    signer: Wallet, 
    amount: string, 
    tokenAddress: string, 
    network: 'TESTNET' | 'MAINNET'
): Promise<{ Erc20: Contract, spender: string, amount: bigint, network: 'TESTNET' | 'MAINNET' }> => {

    try {
        
        const router_address = ROUTER_ADDRESS[ network ]
        const erc20 = new Contract( tokenAddress, ERC20_ABI, signer );

        const decimals = await erc20.decimals()
        const big_amount =  ethers.parseUnits( amount, decimals )
    
        return { Erc20: erc20, spender: router_address, amount: big_amount, network: network }

    } catch (error: any) {
        
        throw error

    }

}