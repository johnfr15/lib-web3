import { ethers, Wallet, Contract } from "ethers"
import { ERC20_ABI, TOKENS, CHAIN_ID, TICKER, ZERO_ADDRESS, ROUTER_ABI, CLASSIC_POOL_FACTORY, CLASSIC_POOL_FACTORY_ABI, CLASSIC_POOL_ABI } from "../config/constants"
import fs from "fs"
import { Token, Pool } from "../types";


export const get_token = async( tokenAddress: string, network: 'TESTNET' | 'MAINNET' ): Promise<Token> => {

    const FILE_PATH = __dirname + "/../config/tokens.json"
    let Tokens: {[key: string]: Token } = {}

    try {
        
        Tokens = await JSON.parse( fs.readFileSync( FILE_PATH ).toString('ascii') )
        
    } catch (error) {

        throw(`Error: ${ FILE_PATH } do not contains the tokens datas`)    

    }

    const token = Object.values(Tokens).find( (token: Token) => 
    {
        return  ( BigInt( token.address ) === BigInt( tokenAddress ) && token.chainId === CHAIN_ID[ network ]  )
    })


    if ( token === undefined )
        throw(`Error: Can't find token ${ tokenAddress } on network ${ network }, please add it to /Mute/config/tokens.ts`)
    
    if ( is_native( token.address ) )
        token.address = TOKENS[ network ].weth

    return token
}

export const get_pool = async( tokenA: Token, tokenB: Token, network: string, signer: Wallet ): Promise<Pool> => {

    const Classic_pool_factory: Contract = new Contract( CLASSIC_POOL_FACTORY[ network ], CLASSIC_POOL_FACTORY_ABI, signer );
    const pool_address: string = await Classic_pool_factory.getPool( tokenA.address, tokenB.address )

    if ( pool_address === ZERO_ADDRESS ) 
        throw('Error: Pool does not exist yet.');
    

    const Pool = new Contract( pool_address, CLASSIC_POOL_ABI, signer )
    const reserves = await Pool.getReserves()

    const { token0, token1 } = sort_tokens( tokenA, tokenB, '0', '0')
    const [ reserve0, reserve1 ] = BigInt( tokenA.address ) < BigInt( tokenB.address ) ? reserves : [ reserves[1], reserves[0] ]


    const pool: Pool = {
        pair: pool_address,
        tokenA: token0,
        tokenB: token1,
        reserveA: reserve0,
        reserveB: reserve1,
    }

    return pool
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

export const get_quote = ( amountIn: string, tokenIn: Token, tokenOut: Token, pool: Pool): string => {

    const reserveIn: bigint  = BigInt( tokenIn.address )  === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB
    const reserveOut: bigint = BigInt( tokenOut.address ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB 

    const amount_in  = ethers.parseUnits( amountIn, tokenIn.decimals )

    const quote = amount_in * reserveOut / reserveIn

    
    return ethers.formatUnits( quote, tokenOut.decimals )
}

export const is_native = ( token: string ): boolean => {
    return BigInt( token ) === BigInt( 0 )
}


export const sort_tokens = ( tokenA: Token, tokenB: Token, amountA: string | null, amountB: string | null ): { token0: Token, token1: Token, amount0: bigint, amount1: bigint } => {

    const token0 = BigInt( tokenA.address ) < BigInt( tokenB.address ) ? tokenA : tokenB
    const token1 = BigInt( tokenA.address ) > BigInt( tokenB.address ) ? tokenA : tokenB 
    const amount0 = token0.address === tokenA.address ? ethers.parseUnits( amountA ?? '0', token0.decimals) : ethers.parseUnits( amountB ?? '0', token0.decimals)
    const amount1 = token1.address === tokenA.address ? ethers.parseUnits( amountA ?? '0', token1.decimals) : ethers.parseUnits( amountB ?? '0', token1.decimals)

    return { token0, token1, amount0, amount1 }
}
