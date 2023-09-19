import { ethers, Wallet, Contract } from "ethers"
import { ERC20_ABI, TOKENS, CHAIN_ID, ROUTER_ADDRESS, MUTE_ROUTER_ABI } from "../config/constants"
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

    const fromToken = is_native( tokenA.address ) ? TOKENS[ network ].weth : tokenA.address
    const toToken = tokenB.address

    const pair = await Router.getPairInfo( [ fromToken, toToken], false )

    const pool: Pool = {
        tokenA: pair[0],
        tokenB: pair[1],
        pair: pair[2],
        reserveA: pair[3],
        reserveB: pair[4],
        fee: pair[5]
    }

    return pool
}

export const get_balance = async(
    Wallet_address: string, 
    token_address: string, 
    signer: Wallet 
): Promise<{ bigint: bigint, string: string, decimals: number }> => {
    
    try {

        const erc20 = new Contract(token_address, ERC20_ABI, signer);

        const balance = await erc20.balanceOf(Wallet_address);
        const { decimals } = await erc20.decimals();
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

        const balanceA = await get_balance( signer.address, addressA, signer )
        const balanceB = await get_balance( signer.address, addressB, signer )

        if ( balanceA.string === '0.0' || balanceB.string === '0.0' )
            return 0;
        else
            return 1;
        
    } catch (error: any) {
        
        throw error

    }
}


export const is_native = ( token: string ): boolean => {
    return BigInt( token ) === BigInt( 0 )
}

/*
export const sort_tokens = ( tokenA: Token, tokenB: Token, amountA: string | null, amountB: string | null ): { token0: Token, token1: Token, amount0: TokenAmount, amount1: TokenAmount } => {

    const token0 = BigInt( tokenA.address ) < BigInt( tokenB.address ) ? tokenA : tokenB
    const token1 = BigInt( tokenA.address ) > BigInt( tokenB.address ) ? tokenA : tokenB 
    const amount0 = token0.address === tokenA.address ? new TokenAmount( token0, ethers.parseUnits( amountA ?? '0', token0.decimals)) : new TokenAmount( token0, ethers.parseUnits( amountB ?? '0', token0.decimals))
    const amount1 = token1.address === tokenA.address ? new TokenAmount( token1, ethers.parseUnits( amountA ?? '0', token1.decimals)) : new TokenAmount( token1, ethers.parseUnits( amountB ?? '0', token1.decimals))

    return { token0, token1, amount0, amount1 }
}
*/