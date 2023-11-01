import { Contract, Wallet } from "ethers";
import { Token, Chains } from "../../types";
import { CONTRACTS, LIQUIDITY_MANAGER_ABI } from "../../config/constants";
import { PoolMeta, Liquidity } from "../../types/add";

export const find_liquidity = async( 
    tokenX: Token, 
    tokenY: Token, 
    chain: Chains,
    signer: Wallet, 
): Promise<Liquidity | undefined> => {
        
    const NftManager = new Contract( CONTRACTS[ chain ].periphery.liquidityManager, LIQUIDITY_MANAGER_ABI, signer )
    const balance = await NftManager.balanceOf( signer.address )

    for( let i = 0; i < balance; i++ )
    {
        const id = await NftManager.tokenOfOwnerByIndex( signer.address, i )
        const liquidity: any = await NftManager.liquidities( id )
        const pool_meta: PoolMeta = await NftManager.poolMetas( liquidity.poolId )

        const liq: Liquidity = {
            leftPt: liquidity.leftPt,
            rightPt: liquidity.rightPt,
            liquidity: liquidity.liquidity,
            lastFeeScaleX_128: liquidity.lastFeeScaleX_128,
            lastFeeScaleY_128: liquidity.lastFeeScaleY_128,
            remainTokenX: liquidity.remainTokenX,
            remainTokenY: liquidity.remainTokenY,
            poolId: liquidity.poolId,
            tokenId: id,
        }

        if ( BigInt( pool_meta.tokenX ) === BigInt( tokenX.address ) &&
             BigInt( pool_meta.tokenY ) === BigInt( tokenY.address ) )
            return liq

        
    }

    return undefined
}

export const get_liquidity = async( 
    tokenX: Token, 
    tokenY: Token, 
    chain: Chains,
    tokenId: number,
    signer: Wallet, 
): Promise<Liquidity | undefined> => {
        
    const NftManager = new Contract( CONTRACTS[ chain ].periphery.liquidityManager, LIQUIDITY_MANAGER_ABI, signer )

    const liquidity: Liquidity = await NftManager.liquidities( tokenId )
    const pool_meta: PoolMeta = await NftManager.poolMetas( liquidity.poolId )

    const liq: Liquidity = {
        leftPt: liquidity.leftPt,
        rightPt: liquidity.rightPt,
        liquidity: liquidity.liquidity,
        lastFeeScaleX_128: liquidity.lastFeeScaleX_128,
        lastFeeScaleY_128: liquidity.lastFeeScaleY_128,
        remainTokenX: liquidity.remainTokenX,
        remainTokenY: liquidity.remainTokenY,
        poolId: liquidity.poolId,
        tokenId: tokenId,
    }

    if ( BigInt( pool_meta.tokenX ) === BigInt( tokenX.address ) &&
         BigInt( pool_meta.tokenY ) === BigInt( tokenY.address ) )
        return liq

    throw new Error(`TokenId ${ tokenId } do not match pool ${ tokenX.symbol }/${ tokenY.symbol }`)
}