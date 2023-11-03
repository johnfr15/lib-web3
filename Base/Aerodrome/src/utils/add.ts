import { Token } from "../../types";
import { Contract, Wallet } from "ethers";
import { PoolMeta, Liquidity } from "../../types/add";
import { CONTRACTS, ROUTER_ABI } from "../../config/constants";

export const find_liquidity = async( 
    tokenX: Token, 
    tokenY: Token, 
    signer: Wallet, 
): Promise<Liquidity | undefined> => {
        
    const Router = new Contract( CONTRACTS.Router, ROUTER_ABI, signer )
    const balance = await Router.balanceOf( signer.address )

    for( let i = 0; i < balance; i++ )
    {
        const id = await Router.tokenOfOwnerByIndex( signer.address, i )
        const liquidity: any = await Router.liquidities( id )
        const pool_meta: PoolMeta = await Router.poolMetas( liquidity.poolId )

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
    tokenId: number,
    signer: Wallet, 
): Promise<Liquidity | undefined> => {
        
    const Router = new Contract( CONTRACTS.Router, ROUTER_ABI, signer )

    const liquidity: Liquidity = await Router.liquidities( tokenId )
    const pool_meta: PoolMeta = await Router.poolMetas( liquidity.poolId )

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