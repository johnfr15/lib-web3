import { Contract, Wallet } from "ethers";
import { Token, Chains, Position } from "../types";
import { NFT_MANAGER, NFT_MANAGER_ABI } from "../config/constants";

export const find_position = async( 
    tokenA: Token, 
    tokenB: Token, 
    chain: Chains, 
    signer: Wallet, 
    tokenId?: number 
): Promise<Position> => {
    
    try {
        
        let pos: any
        const NftManager = new Contract( NFT_MANAGER[ chain ], NFT_MANAGER_ABI, signer )
        const balance = await NftManager.balanceOf( signer.address )

        if ( tokenId )
        {
            pos = await NftManager.positions()

        }
        else
        {
            for( let i = 0; i < balance; i++ )
            {
                const id = await NftManager.tokenOfOwnerByIndex( signer.address, i )
                const position = await NftManager.positions( id )

                if ( is_position( position, tokenA, tokenB ) )
                {
                    pos = position
                    tokenId = id
                    break
                }
            }
        }

        if ( pos === undefined )
            throw(`Error: can't find position for token ${ tokenA.symbol }/${ tokenB.symbol }`)

        const position: Position = {
            tokenId: tokenId!,
            nonce: pos['0'],
            operator: pos['1'],
            token0: pos['2'],
            token1: pos['3'],
            fee: pos['4'],
            tickLower: pos['5'],
            tickUpper: pos['6'],
            liquidity: pos['7'],
            feeGrowthInside0LastX128: pos['8'],
            feeGrowthInside1LastX128: pos['9'],
            tokensOwed0: pos['10'],
            tokensOwed1: pos['11'],
        } 

        return position
        
    } catch (error) {
        
        throw( error )

    }
}

export const is_position = ( position: any, tokenA: Token, tokenB: Token ): boolean => {

    const pos0 = BigInt( position.token0 )
    const pos1 = BigInt( position.token1 )
    const tokA = BigInt( tokenA.address )
    const tokB = BigInt( tokenB.address )

    if ( pos0 === tokA && pos1 === tokB  ) return true
    if ( pos0 === tokB && pos1 === tokA  ) return true

    return false
}


export const get_amounts = async( tokenId: number, liquidity: bigint, deadline: number, NftManager: Contract ): Promise<{amount0: bigint, amount1: bigint}> => {

    try {

        const args = {
            tokenId: tokenId,
            liquidity: liquidity,
            amount0Min: 0,
            amount1Min: 0,
            deadline: deadline,
        }
        const amounts = await NftManager.decreaseLiquidity.staticCall( args )

        return { amount0: amounts[0], amount1: amounts[1] }

    } catch (error) {
     
        throw( error )

    }
}