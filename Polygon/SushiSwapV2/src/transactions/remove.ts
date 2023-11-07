import { is_native } from "../utils";
import { V2_ROUTER, V2_ROUTER_ABI } from "../../config/constants"
import { ethers, Contract, TransactionResponse, TransactionReceipt } from "ethers";
import { RemoveLiquidity, RemoveLiquidityETH, RemoveLiquidityTx } from "../../types";

export const exec_remove = async( removeLiq: RemoveLiquidityTx ) => {

    let tx: TransactionResponse
    let receipt: TransactionReceipt | null | undefined
    let txArgs: RemoveLiquidity | RemoveLiquidityETH
    let fees: bigint

    const { signer, tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline, percent } = removeLiq
    const Router = new Contract( V2_ROUTER, V2_ROUTER_ABI, signer ) 
    const nonce = await signer.getNonce()


    console.log(`\n\nWithdrawing ${ percent }% of liquidity for:\n\t\
        (minimum)${ ethers.formatUnits( amountAMin, tokenA.decimals ) } ${ tokenA.symbol }\n\t\
        (minimum)${ ethers.formatUnits( amountBMin, tokenB.decimals ) } ${ tokenB.symbol }
    `)

    if ( is_native( tokenA.address ) || is_native( tokenB.address ) )
    {
        let token           = is_native( tokenA.address ) ? tokenB.address : tokenA.address
        let amountTokenMin  = is_native( tokenA.address ) ? amountBMin : amountAMin
        let amountETHMin    = is_native( tokenA.address ) ? amountAMin : amountBMin

        txArgs = { token, liquidity, amountTokenMin, amountETHMin, to, deadline } as RemoveLiquidityETH

        tx = await Router.removeLiquidityETH( ...Object.values( txArgs ), { nonce: nonce } )
    }
    else 
    {
        txArgs = { tokenA: tokenA.address, tokenB: tokenB.address, liquidity, amountAMin, amountBMin, to, deadline } as RemoveLiquidity

        tx = await Router.removeLiquidity( ...Object.values( txArgs ), { nonce: nonce } )
    }

    receipt = await signer.provider?.waitForTransaction( tx.hash )
        
    console.log("\nTransaction valided !")
    console.log("hash: ", tx.hash)
    console.log("Fees: ", ethers.formatEther( receipt?.fee ?? '0' ))

    return receipt
}