import { ethers, Wallet, Contract, TransactionResponse, TransactionReceipt } from "ethers";
import { RemoveLiquidity } from "../types";
import { is_native } from "../utils";
import { ROUTER_ADDRESS, MUTE_ROUTER_ABI, TICKER } from "../config/constants"

export const exec_remove = async( removeLiq: RemoveLiquidity, signer: Wallet ) => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    const { tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline, stable, network, percent } = removeLiq
    const Router: Contract = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer ) 

    console.log(`\nWithdrawing ${ percent }% of liquidity for:\n\t\
        (minimum)${ ethers.formatUnits( amountAMin, tokenA.decimals ) } ${ TICKER[ tokenA.address ] }\n\t\
        (minimum)${ ethers.formatUnits( amountBMin, tokenB.decimals ) } ${ TICKER[ tokenB.address ] }
    `)

    if ( is_native( tokenA.address ) || is_native( tokenB.address ) )
    {
        const fees = await Router.removeLiquidityETH.estimateGas(
            is_native( tokenA.address ) ? tokenB.address : tokenA.address,
            liquidity,
            is_native( tokenA.address ) ? amountBMin : amountAMin,
            is_native( tokenA.address ) ? amountAMin : amountBMin,
            to,
            deadline,
            stable
        )

        tx = await Router.removeLiquidityETH(
            is_native( tokenA.address ) ? tokenB.address : tokenA.address,
            liquidity,
            is_native( tokenA.address ) ? amountBMin : amountAMin,
            is_native( tokenA.address ) ? amountAMin : amountBMin,
            to,
            deadline,
            stable,
            { maxPriorityFeePerGas: fees}
        )
    }
    else 
    {
        tx = await Router.removeLiquidity(
            tokenA.address,
            tokenB.address,
            liquidity,
            amountAMin,
            amountBMin,
            to,
            deadline,
            stable
        )
    }

    receipt = await signer.provider?.waitForTransaction( tx.hash )
        
    console.log("Transaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt as TransactionReceipt
}