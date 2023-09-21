import { ethers, Wallet, Contract } from "ethers"
import { ERC20_ABI, TOKENS, CHAIN_ID, ROUTER_ADDRESS, MUTE_ROUTER_ABI, TICKER } from "../config/constants"
import tokens from "../config/tokens"
import { Token, Pool } from "../types";


export const get_token = async( tokenAddress: string, network: 'TESTNET' | 'MAINNET', signer: Wallet ): Promise<Token> => {

    const token: Token | undefined = tokens.find( (token: Token) => 
    {
        return BigInt( token.address ) === BigInt( tokenAddress ) && token.chainId === CHAIN_ID[ network ] 
    })

    if ( token === undefined )
        throw(`Error: Can't find token ${ tokenAddress } on network ${ network }, please add it to /Mute/config/tokens.ts`)
    
    if ( is_native(token.address) )
        token.address = TOKENS[ network ].weth

    return token
}

export const get_pool = async( tokenA: Token, tokenB: Token, network: string, signer: Wallet ): Promise<Pool> => {

    const Router = new Contract( ROUTER_ADDRESS[ network ], MUTE_ROUTER_ABI, signer )

    const { token0, token1 } = sort_tokens( tokenA, tokenB, '0', '0')

    const fromToken = is_native( tokenA.address ) ? TOKENS[ network ].weth : tokenA.address
    const toToken = tokenB.address

    const pair = await Router.getPairInfo( [ fromToken, toToken], false )

    const pool: Pool = {
        tokenA: token0,
        tokenB: token1,
        pair: pair[2],
        reserveA: token0.address === fromToken ? pair[3] : pair[4],
        reserveB: token1.address === fromToken ? pair[3] : pair[4],
        fee: pair[5]
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

    const amount_in   = parseFloat( amountIn )
    const reserve_in  = parseFloat( ethers.formatUnits( reserveIn, tokenIn.decimals ) )
    const reserve_out = parseFloat( ethers.formatUnits( reserveOut, tokenOut.decimals ) )

    return (amount_in * reserve_out / reserve_in).toFixed( tokenOut.decimals )
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
