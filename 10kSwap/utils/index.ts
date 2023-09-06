import { ethers } from "ethers"
import { Account, Contract, Uint256, uint256 } from "starknet"
import { ERC20_ABI } from "../constant"
import { JSBI, StarknetChainId, Token, Pair, Fraction, Price, BigintIsh } from "l0k_swap-sdk"


export const get_token = async( tokenAddress: string, network: 'TESTNET' | 'MAINNET', signer: Account ) => {

    const Erc20 = new Contract( ERC20_ABI, tokenAddress, signer )
    
    const { decimals } = await Erc20.functions.decimals()
    const chain_id = StarknetChainId[ network ]

    const token = new Token( chain_id, tokenAddress, Number( decimals ) )

    return token
}

export const get_balance = async(
    account_address: string, 
    token_address: string, 
    signer: Account 
): Promise<{ uint256: Uint256, bigint: bigint, string: string, decimals: number }> => {
    
    try {

        const erc20 = new Contract(ERC20_ABI, token_address, signer);

        const { balance } = await erc20.balanceOf(account_address);
        const { decimals } = await erc20.decimals();
        let formated = ethers.formatUnits( uint256.uint256ToBN( balance ), decimals );
        
        return { 
            uint256: balance,
            bigint: uint256.uint256ToBN( balance ),
            string: formated, 
            decimals: decimals
        };

    } catch (error: any) {

        throw new Error(error)

    }

}

export const is_balance = async(signer: Account, addressA: string, addressB: string): Promise<number> => {

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

export const sort_tokens = ( addressA: string, addressB: string, pool: Pair ): { tokenA: Token, tokenB: Token } => {

    const tokenA = addressA === pool.token0.address ? pool.token0 : pool.token1
    const tokenB = addressB === pool.token0.address ? pool.token0 : pool.token1

    return { tokenA, tokenB }
}

export const sort_tokens_2 = ( tokenA: Token, tokenB: Token ): { token0: Token, token1: Token } => {

    const token0 = BigInt( tokenA.address ) < BigInt( tokenB.address ) ? tokenA : tokenB
    const token1 = BigInt( tokenA.address ) > BigInt( tokenB.address ) ? tokenA : tokenB 

    return { token0, token1 }
}

export const Uint256_to_string = (number: Uint256, decimals: number = 18): string => 
{
    return ethers.formatUnits( uint256.uint256ToBN( number ), decimals )
}
export const jsbi_to_string = (number: JSBI, decimals: number = 18): string => 
{
    return ethers.formatUnits( BigInt( number.toString() ), decimals )
}
export const jsbi_to_Uint256 = (number: JSBI, decimals: number = 18): Uint256 => 
{
    return uint256.bnToUint256( BigInt( number.toString() ) )
}