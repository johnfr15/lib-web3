import { ethers } from "ethers";
import { Account, Contract, uint256 } from "starknet"
import { Token, JSBI } from "l0k_swap-sdk";
import { ERC20_ABI, ROUTER_ADDRESS } from "../constant";
import { get_balance, get_pool, get_token, sort_tokens } from "../utils";
import { RemoveLiquidityTx, RemoveLiquidityCallData, Pool } from "../types";


export const get_remove_calldata = async(
    signer: Account, 
    tokenA: string, 
    tokenB: string, 
    percent: number, 
    slipage: number, 
    network: 'TESTNET' | 'MAINNET',
    deadline: number,
): Promise<RemoveLiquidityCallData> => {

    try {
        
        const token_a = await get_token( tokenA, network, signer )
        const token_b = await get_token( tokenB, network, signer )
        
        const { token0, token1 } = sort_tokens( token_a, token_b, '0', '0' )
        const pool = await get_pool( token0, token1, network, signer )
        
        const tx: RemoveLiquidityTx = await get_removeLiq_tx( signer, pool, percent, slipage, network, deadline )
        
        return {
            removeLiquidityTx: tx,
            utils: { token0, token1, pool },
        }

    } catch (error: any) {
        
        throw error

    }
}

const get_removeLiq_tx = async(
    signer: Account, 
    pool: Pool,
    percent: number, 
    slipage: number, 
    network: 'TESTNET' | 'MAINNET',
    deadline: number,
): Promise<RemoveLiquidityTx> => {

    try {

        const { totalSupply } = await pool.Pool.functions.totalSupply()
        const reserveLp = uint256.uint256ToBN( totalSupply )
        const balanceLp = await get_balance( signer.address, pool.Pool.address, signer )

        const liquidity: bigint    = balanceLp.bigint * BigInt( percent * 100 ) / BigInt( 100 * 100 )
        const amount_0_min: bigint = ( uint256.uint256ToBN( pool.reserve0 ) * liquidity / reserveLp) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )
        const amount_1_min: bigint = ( uint256.uint256ToBN( pool.reserve1 ) * liquidity / reserveLp) * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        const tx: RemoveLiquidityTx = {
            contractAddress: ROUTER_ADDRESS[ network ],
            entrypoint: "remove_liquidity",
            calldata: [
                pool.token0.address,
                pool.token1.address,
                uint256.bnToUint256( liquidity ),
                uint256.bnToUint256( amount_0_min ),
                uint256.bnToUint256( amount_1_min ),
                signer.address,
                deadline
            ],
        } 
        
        return tx

    } catch (error) {
        
        throw error

    }
}