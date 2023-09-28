import { ethers, TransactionResponse, TransactionReceipt } from "ethers";
import { RemoveLiquidity, RemoveLiquidityETH, RemoveLiquidityTx } from "../types";
import { is_native } from "../utils";
import { TICKER } from "../config/constants"

export const exec_remove = async( removeLiq: RemoveLiquidityTx ) => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined
    let args: RemoveLiquidity | RemoveLiquidityETH
    let fees: bigint

    const { pool, liquidity, amountAMin, amountBMin, to, deadline, stable, percent, Router } = removeLiq
    const { token0, token1 } = pool

    console.log(`\n\nWithdrawing ${ percent }% of liquidity for:\n\t\
        (minimum)${ ethers.formatUnits( amountAMin, token0.decimals ) } ${ TICKER[ token0.address ] }\n\t\
        (minimum)${ ethers.formatUnits( amountBMin, token1.decimals ) } ${ TICKER[ token1.address ] }
    `)

    if ( is_native( pool.token0.address ) || is_native( pool.token1.address ) )
    {
        let token           = is_native( token0.address ) ? token1.address : token0.address
        let amountTokenMin  = is_native( token0.address ) ? amountBMin : amountAMin
        let amountETHMin    = is_native( token0.address ) ? amountAMin : amountBMin

        args = { 
            token, 
            liquidity, 
            amountTokenMin, 
            amountETHMin, 
            to, 
            deadline 
        } as RemoveLiquidityETH

        fees = await Router.removeLiquidityETH.estimateGas( args )

        tx = await Router.removeLiquidityETH( args, { maxPriorityFeePerGas: fees } )
    }
    else 
    {
        args = { 
            tokenA: token0.address, 
            tokenB: token1.address, 
            liquidity, 
            amountAMin, 
            amountBMin, 
            to, 
            deadline
        } as RemoveLiquidity

        fees = await Router.removeLiquidity.estimateGas( args )

        tx = await Router.removeLiquidity( args, { maxPriorityFeePerGas: fees } )
    }

    receipt = await tx.wait()
        
    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt
}