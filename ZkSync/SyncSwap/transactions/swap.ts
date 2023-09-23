import { ethers, Contract, Wallet, TransactionResponse, TransactionReceipt } from "ethers";
import { ROUTER_ABI, ROUTER_ADDRESS, TICKER } from "../config/constants";
import { is_native } from "../utils";
import { Trade } from "../types";


export const exec_swap = async( swapTx: Trade, signer: Wallet ): Promise<TransactionReceipt> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    try {
        
        const { paths, path, tokenFrom, tokenTo, amountIn, amountOutMin, deadline, network } = swapTx
        const Router: Contract = new Contract( ROUTER_ADDRESS[ network ], ROUTER_ABI, signer ) 
    
        console.log(`\nSwapping exact ${ ethers.formatUnits( amountIn, tokenFrom.decimals)  } ${ TICKER[ path[0] ] } for (min)${ ethers.formatUnits( amountOutMin, tokenTo.decimals ) } ${ TICKER[ path[1] ] }`)      
    
        tx = await Router.swap( 
            paths, 
            amountOutMin, 
            deadline, 
            { value: is_native( path[0] ) ? amountIn : undefined } 
        ) 
        receipt = await signer.provider?.waitForTransaction( tx.hash )
            
        console.log("\nTransaction valided !")
        console.log("hash: ", tx.hash)
        console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))
    
        return receipt as TransactionReceipt

    } catch (error) {
        
        throw( error )

    }
}