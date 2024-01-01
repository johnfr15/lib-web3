import { Contract, Wallet } from "ethers";
import { Token, Chains, AddOptions } from "../../types";
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

export const check_add_inputs = ( amountA: string | null, amountB: string | null, options: AddOptions ) => {

    if ( options!.slipage! < 0.01 || options!.slipage! > 100 )
        throw("Slipage need to be a number between 2 and 100");
    if ( amountA === null && amountB === null && options!.max === false && options.percent === undefined )
        throw("Need to provide at least a value for 'amountA' or 'amountB' or set max or percent");
    if ( options.percent && (options.percent! <= 0 || options.percent! > 100) )
        throw("Percent need to be set between 0 to 100")
}