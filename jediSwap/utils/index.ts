import { ethers } from "ethers"
import { Account, Contract, Uint256, uint256 } from "starknet"
import { ERC20_ABI, JEDI_FACTORY_ABI, FACTORY_ADDRESS, JEDI_PAIR_ABI, TICKER } from "../constant"
import { Token, JSBI, TokenAmount, StarknetChainId } from "l0k_swap-sdk"
import { Pool } from "../types"


export const get_token = async( tokenAddress: string, network: 'TESTNET' | 'MAINNET', signer: Account ) => {

    const Erc20 = new Contract( ERC20_ABI, tokenAddress, signer )
    
    const { decimals } = await Erc20.functions.decimals()
    const chain_id = StarknetChainId[ network ]

    const token = new Token( chain_id, tokenAddress, Number( decimals ) )

    return token
}

export const get_pool = async( tokenA: Token, tokenB: Token, network: string, signer: Account ): Promise<Pool> => {

    const Factory = new Contract( JEDI_FACTORY_ABI, FACTORY_ADDRESS[ network ], signer )
    const { pair } = await Factory.get_pair( tokenA.address, tokenB.address )

    const Pool = new Contract( JEDI_PAIR_ABI, '0x' + pair.toString(16), signer )
    const { reserve0, reserve1 } = await Pool.get_reserves()
    const { token0, token1 } = sort_tokens( tokenA, tokenB, null, null )

    return { Pool, token0, token1, reserve0, reserve1 }
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

export const sort_tokens = ( tokenA: Token, tokenB: Token, amountA: string | null, amountB: string | null ): { token0: Token, token1: Token, amount0: TokenAmount, amount1: TokenAmount } => {

    const token0 = BigInt( tokenA.address ) < BigInt( tokenB.address ) ? tokenA : tokenB
    const token1 = BigInt( tokenA.address ) > BigInt( tokenB.address ) ? tokenA : tokenB 
    const amount0 = token0.address === tokenA.address ? new TokenAmount( token0, ethers.parseUnits( amountA ?? '0', token0.decimals)) : new TokenAmount( token0, ethers.parseUnits( amountB ?? '0', token0.decimals))
    const amount1 = token1.address === tokenA.address ? new TokenAmount( token1, ethers.parseUnits( amountA ?? '0', token1.decimals)) : new TokenAmount( token1, ethers.parseUnits( amountB ?? '0', token1.decimals))

    return { token0, token1, amount0, amount1 }
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
export const string_to_Uint256 = (number: string, decimals: number = 18): Uint256 => 
{
    return uint256.bnToUint256( ethers.parseUnits( number, decimals ) )
}