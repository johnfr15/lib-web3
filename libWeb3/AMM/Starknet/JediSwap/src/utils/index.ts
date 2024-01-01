import { ethers } from "ethers";
import { get_swap_calldata } from "../calldatas/swapCalldata";
import { Account, Contract, Uint256, uint256 } from "starknet";
import { get_add_liq_calldata } from "../calldatas/addLiqCalldata";
import { Pool, SwapTx, SwapCallData, AddLiquidityTx } from "../../types";
import { Token, JSBI, TokenAmount, StarknetChainId } from "l0k_swap-sdk";
import { ERC20_ABI, JEDI_FACTORY_ABI, FACTORY_ADDRESS, JEDI_PAIR_ABI, TOKENS } from "../../config/constants";


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


/**
 * @name enforce_fees
 * @dev If ETH token is about to be swapped ensure that we will keep enough ETH token to pay the fees
 *      of this transaction
 */
export const enforce_swap_fees = async( swapTx: SwapTx, fees: bigint ): Promise<SwapCallData> => {
    const { swapCalldata, utils } = swapTx
    const { signer, trade, path, network, slipage, deadline } = utils

    try {
        
        const amountIn: Uint256 = trade.tradeType === 0 ? swapCalldata.calldata[0] as Uint256 : swapCalldata.calldata[1] as Uint256
        let amount: bigint = uint256.uint256ToBN( amountIn )

        const balance = await get_balance( signer.address, TOKENS[ network ].eth, signer )
        
        if ( balance.bigint < (amount + fees) )
        {
            if ( trade.tradeType === 0 )
            {
                const new_amount: string =  ethers.formatEther( amount - (fees * BigInt( 4 )) )
                const { swapCalldata } = await get_swap_calldata( signer, path, new_amount, null, network, slipage, deadline )

                return swapCalldata
            }

            swapCalldata.calldata[1] = uint256.bnToUint256( amount - (fees * BigInt( 2 )) )
            return swapCalldata
        }
        else
            return swapCalldata

    } catch (error) {
        
        throw( error )

    }
}


/**
 * @name enforce_fees
 * @dev If ETH token is about to be swapped ensure that we will keep enough ETH token to pay the fees
 *      of this transaction
 */
export const enforce_add_liq_fees = async( addTx: AddLiquidityTx, utils: { [key: string]: any }, fees: bigint ): Promise<AddLiquidityTx> => {

    const [ tokenA, tokenB, amountADesired, amountBDesired ] = addTx.calldata
    const { signer, network, slipage, deadline } = utils

    const eth_address: string    = TOKENS[ utils.network ].eth === tokenA ? tokenA as string : tokenB as string
    const eth_amount: Uint256    = TOKENS[ utils.network ].eth === tokenA ? amountADesired as Uint256 : amountBDesired as Uint256
    const tokenB_address: string = TOKENS[ utils.network ].eth !== tokenA ? tokenA as string : tokenB as string

    try {
        
        const amount: bigint = uint256.uint256ToBN( eth_amount )
        const balance = await get_balance( signer.address, TOKENS[ network ].eth, signer )
    
        if ( balance.bigint < (amount + fees) )
        {
            const new_amount = ethers.formatEther( amount - (fees * BigInt( 4 )))
            const { addLiquidityTx } = await get_add_liq_calldata( signer, eth_address, new_amount, tokenB_address, null, false, network, slipage, deadline )
            return addLiquidityTx
        }
        else
            return  addTx

    } catch (error) {
        
        throw( error )

    }
}

export const log_balances = async(signer: Account, network: 'TESTNET' | 'MAINNET') => {

    const Dai = new Contract(ERC20_ABI, TOKENS[ network ].dai, signer)
    const Eth = new Contract(ERC20_ABI, TOKENS[ network ].eth, signer)
    const Usdc = new Contract(ERC20_ABI, TOKENS[ network ].usdc, signer)
    const Usdt = new Contract(ERC20_ABI, TOKENS[ network ].usdt, signer)

    const { balance: daiBalance }  = await Dai.balanceOf( signer.address ) 
    const { balance: ethBalance }  = await Eth.balanceOf( signer.address ) 
    const { balance: usdcBalance } = await Usdc.balanceOf( signer.address ) 
    const { balance: usdtBalance } = await Usdt.balanceOf( signer.address ) 

    console.log( "Balance DAI:  ", Uint256_to_string( daiBalance ) )
    console.log( "Balance ETH:  ", Uint256_to_string( ethBalance ) )
    console.log( "Balance USDC: ", Uint256_to_string( usdcBalance, 6) )
    console.log( "Balance USDT: ", Uint256_to_string( usdtBalance, 6) )
    console.log("\n")
}