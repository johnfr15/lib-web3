import fs from "fs"
import { ethers, Wallet, Contract } from "ethers"
import { ERC20_ABI, CHAIN_ID, WMATIC, V3_FACTORY, V3_POOL_ABI, QUOTER_ABI, QUOTER } from "../config/constants"
import { Token } from "@uniswap/sdk-core";
import { FeeAmount, computePoolAddress, Pool } from "@uniswap/v3-sdk";
import { PoolInfo, TokenJSON } from "../types"

export const get_token = async( tokenAddress: string, network: 'TESTNET' | 'MAINNET' ): Promise<Token> => {

    const FILE_PATH = __dirname + "/../config/tokens.json"
    let Tokens: TokenJSON[] = []

    if ( is_native( tokenAddress ) )
        tokenAddress = WMATIC[ network ]

    try {
        
        Tokens = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        
    } catch (error) {

        throw(`Error: ${ FILE_PATH } do not contains the tokens datas`)    

    }

    const token = Tokens.find( ( token: TokenJSON ) => 
    {
        return  ( BigInt( token.address ) === BigInt( tokenAddress ) && token.chainId === CHAIN_ID[ network ]  )
    })


    if ( token === undefined )
        throw(`Error: Can't find token ${ tokenAddress } on network ${ network }, please add it to /Mute/config/tokens.ts`)


    return new Token( token.chainId, token.address, token.decimals, token.symbol, token.name )
}

export const get_pool = async( tokenA: Token, tokenB: Token, signer: Wallet ): Promise<PoolInfo> => {

    try {

        const pool_address = computePoolAddress({
            factoryAddress: V3_FACTORY,
            tokenA: tokenA,
            tokenB: tokenB,
            fee: FeeAmount.MEDIUM
        })

        const PoolContract   = new ethers.Contract( pool_address, V3_POOL_ABI, signer )
        
        const [token0, token1, fee, liquidity, slot0 ] = await Promise.all([
          PoolContract.token0(),
          PoolContract.token1(),
          PoolContract.fee(),
          PoolContract.liquidity(),
          PoolContract.slot0(),
        ])
        
        const pool = new Pool(
            tokenA,
            tokenB,
            fee,
            slot0[0].toString(),
            liquidity.toString(),
            slot0[1],
        )
    
        const poolInfo: PoolInfo = {
            token0: token0,
            token1: token1,
            pool: pool,
            poolAddress: pool_address,
            PoolContract: PoolContract
        }
    
        return poolInfo

    } catch (error) {

        throw( error )
        
    }
}


export const get_balance = async(
    tokenAddress: string, 
    signer: Wallet,
): Promise<{ bigint: bigint, string: string, decimals: number }> => {
    
    let balance: bigint;
    let decimals: number

    try {

        const erc20 = new Contract(tokenAddress, ERC20_ABI, signer);

        if ( is_native( tokenAddress ))
        {
            balance  = await signer.provider!.getBalance( signer.address )
            decimals = 18
        }
        else
        {
            balance = await erc20.balanceOf( signer.address );
            decimals = await erc20.decimals();
        }

        let formated = ethers.formatUnits( balance , decimals );
        
        return { 
            bigint: balance,
            string: formated, 
            decimals: decimals
        };

    } catch (error: any) {

        throw new Error(error)

    }

}

export const is_balance = async(signer: Wallet, addressA: string, addressB: string): Promise<number> => {

    try {

        const balanceA = await get_balance( addressA, signer )
        const balanceB = await get_balance( addressB, signer )

        if ( balanceA.string === '0.0' || balanceB.string === '0.0' )
            return 0;
        else
            return 1;
        
    } catch (error: any) {
        
        throw error

    }
}

export const is_native = ( token: string ): boolean => {
    return  ( BigInt( token ) === BigInt( 0 ) ||  BigInt( token ) === BigInt( WMATIC[ "TESTNET" ] ) ||  BigInt( token ) === BigInt( WMATIC[ "MAINNET" ] )  )
}