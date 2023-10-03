import { Contract } from "ethers";
import { RemoveLiquidity } from "../types";
import { is_native } from ".";

export const encode_remove_datas = ( removeLiq: RemoveLiquidity, Router: Contract ) => {

    let datas: string;

    const { tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline, stable } = removeLiq

    if ( is_native( tokenA.address ) || is_native( tokenB.address ) )
    {
        datas = Router.interface.encodeFunctionData( "removeLiquidityETH", [
            is_native( tokenA.address ) ? tokenB.address : tokenA.address,
            liquidity,
            is_native( tokenA.address ) ? amountBMin : amountAMin,
            is_native( tokenA.address ) ? amountAMin : amountBMin,
            to,
            deadline,
            stable
        ])
    }
    else 
    {
        datas = Router.interface.encodeFunctionData( "removeLiquidity", [
            tokenA,
            tokenB,
            liquidity,
            amountAMin,
            amountBMin,
            to,
            deadline,
            stable
        ] )
    }

    return datas
}