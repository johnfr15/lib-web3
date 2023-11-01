import { Wallet, Contract } from "ethers";
import { get_pool, get_token, sort_tokens } from "../utils";
import { get_amounts } from "../utils/remove";
import { Pool, Token, Chains, RemoveOptions } from "../../types";
import { CHAIN_ID, CONTRACTS, LIQUIDITY_MANAGER_ABI } from "../../config/constants";
import { Liquidity } from "../../types/add";
import { RemoveLiquidityTx } from "../../types/remove";
import { get_liquidity, find_liquidity } from "../utils/add";


export const get_remove_tx = async(
    signer: Wallet, 
    tokenX: string, 
    tokenY: string, 
    chain: Chains,
    options: RemoveOptions
): Promise<RemoveLiquidityTx> => {
        
        const token_a: Token = await get_token( tokenX, chain )
        const token_b: Token = await get_token( tokenY, chain )

        const { token0, token1 } = sort_tokens( token_a, token_b, '0', '0' )
        const pool: Pool         = await get_pool( token0, token1, signer, chain )

        const removeTx: RemoveLiquidityTx = await get_removeLiq( signer, pool, chain, options )

        return removeTx
}

const get_removeLiq = async(
    signer: Wallet, 
    pool: Pool,
    chain: Chains,
    options: RemoveOptions
): Promise<RemoveLiquidityTx> => {

    let position: Liquidity | undefined

    const { tokenId, percent, slipage, deadline } = options

    const NftManager = new Contract( CONTRACTS[ chain ].periphery.liquidityManager, LIQUIDITY_MANAGER_ABI, signer )

    if ( tokenId )
        position = await get_liquidity( pool.tokenX, pool.tokenY, chain, tokenId, signer )
    else
        position = await find_liquidity( pool.tokenX, pool.tokenY, chain, signer )


    if ( position === undefined )
        throw( `Error: Position not minted yet.`)
    if ( position.liquidity === BigInt( 0 ) )
        throw( `Error: There is no liquidity in this position.`)

    const { amountX, amountY } = await get_amounts( position, deadline!, NftManager )

    const amountXMin = amountX * BigInt( 100 * (100 - slipage!) ) / BigInt( 100 * 100 )
    const amountYMin = amountY * BigInt( 100 * (100 - slipage!) ) / BigInt( 100 * 100 )


    const removeLiq: RemoveLiquidityTx = {
        signer: signer,
        pool: pool,
        lp: { chainId: CHAIN_ID[ chain ], address: pool.pairAddress, decimals: 1, symbol: "LP", name: "Izumi LP", logoURI: "" },
        token0: pool.tokenX,
        token1: pool.tokenY,
        position: position,
        liquidity: position.liquidity,
        amount0: amountX,
        amount1: amountY,
        amountXMin: amountXMin,
        amountYMin: amountYMin,
        deadline: deadline!,
        percent: percent!,
        chain: chain,
        NftManager: NftManager
    } 
    
    return removeLiq
}