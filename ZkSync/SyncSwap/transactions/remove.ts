import { ethers, Wallet, Contract, TransactionResponse, TransactionReceipt } from "ethers";
import { RemoveLiquidity } from "../types";
import { ROUTER_ADDRESS, ROUTER_ABI, TICKER } from "../config/constants"

export const exec_remove = async( removeLiq: RemoveLiquidity, signer: Wallet ) => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined

    const { tokenA, tokenB, pool, liquidity, data, minLiquidities, callback, callbackData, network, percent } = removeLiq
    const Router: Contract = new Contract( ROUTER_ADDRESS[ network ], ROUTER_ABI, signer ) 

    console.log(`2) Withdrawing ${ percent }% of liquidity for:\n\t\
        (minimum)${ ethers.formatUnits( minLiquidities[0], tokenA.decimals ) } ${ TICKER[ tokenA.address ] }\n\t\
        (minimum)${ ethers.formatUnits( minLiquidities[1], tokenB.decimals ) } ${ TICKER[ tokenB.address ] }
    `)

    console.log( removeLiq )

    tx = await Router.burnLiquidity(
        pool,
        liquidity,
        data,
        minLiquidities,
        callback,
        callbackData
    )

    receipt = await tx.wait()
        
    console.log("Transaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt as TransactionReceipt
}