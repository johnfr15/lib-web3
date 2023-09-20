import { ethers, Contract, Wallet, TransactionResponse, TransactionReceipt } from "ethers";
import { MUTE_ROUTER_ABI, ROUTER_ADDRESS, TICKER } from "../config/constants";
import { is_native } from "../utils";
import { Trade } from "../types";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const exec_swap = async( swapTx: Trade, signer: Wallet ): Promise<TransactionReceipt> => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    const { path, tokenFrom, tokenTo, amountIn, amountOutMin, deadline, network } = swapTx
    const Router: Contract = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer ) 


    console.log(`2) Swapping exact ${ ethers.formatUnits( amountIn, tokenFrom.decimals)  } ${ TICKER[ path[0] ] } for (min)${ ethers.formatUnits( amountOutMin, tokenTo.decimals ) } ${ TICKER[ path[1] ] }`)      


    if ( is_native( path[0] ) )
    {
        tx = await Router.swapExactETHForTokens( 
            amountOutMin,
            [ tokenFrom.address, tokenTo.address ],
            signer.address,
            deadline,
            [ false ],
            { value: amountIn }
        )
    }
    else if ( is_native( path[1] ) )
    {
        tx = await Router.swapExactTokensForETH(
            amountIn,
            amountOutMin,
            [ tokenFrom.address, tokenTo.address ],
            signer.address,
            deadline,
            [ false ]
        )
    }
    else
    {
        tx = await Router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            [ tokenFrom.address, tokenTo.address ],
            signer.address,
            deadline,
            [ false ]
        )
    }

    receipt = await signer.provider?.waitForTransaction( tx.hash )
        
    console.log("Transaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt as TransactionReceipt
}