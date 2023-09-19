import { Contract } from "ethers";
import { is_native } from "./";
import { AddLiquidity } from "../types";

/**
 * @dev This function will check if native ETH token is in the path and encode the swap data the right way 
 * 
 */
export const encode_add_datas = ( addLiquidity: AddLiquidity, Router: Contract ): string => {

    const { tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline, feeType, stable } = addLiquidity
    let datas: string;

    if ( is_native( addLiquidity.tokenA.address ) || is_native( addLiquidity.tokenB.address ) )
    {
        datas = Router.interface.encodeFunctionData( "addLiquidityETH", [
            is_native( tokenA.address ) ? tokenB.address : tokenA.address,
            is_native( tokenA.address ) ? amountBDesired : amountADesired,
            is_native( tokenA.address ) ? amountBMin : amountAMin,
            is_native( tokenA.address ) ? amountAMin : amountBMin,
            to,
            deadline,
            feeType,
            stable
        ])
    }
    else 
    {
        datas = Router.interface.encodeFunctionData( "addLiquidity", [
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            to,
            deadline,
            feeType,
            stable
        ] )
    }

    return datas
}