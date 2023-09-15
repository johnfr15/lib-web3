import { ethers } from "ethers"
import { Account, Contract, Uint256, uint256 } from "starknet"
import { ERC20_ABI, TOKENS } from "../constant"
import { JSBI, StarknetChainId, Token, Pair, Trade, TradeType, Percent, TokenAmount } from "l0k_swap-sdk"
import { get_add_liq_calldata } from "../calldata/addLiqCalldata"
import { SwapCallData, AddLiquidityTx } from "../types"


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

/**
 * @name enforce_fees
 * @dev If ETH token is about to be swapped ensure that we will keep enough ETH token to pay the fees
 *      of this transaction
 */
export const enforce_swap_fees = async( swapTx: SwapCallData, fees: bigint,  signer: Account, network: 'TESTNET' | 'MAINNET'): Promise<any> => {
    const { tradeType } = swapTx.utils
    try {
        
        const amountIn: Uint256 = tradeType === 0 ? swapTx.calldata[0] as Uint256 : swapTx.calldata[1] as Uint256
        let amount: bigint = uint256.uint256ToBN( amountIn )

        const balance = await get_balance( signer.address, TOKENS[ network ].eth, signer )
        
        if ( balance.bigint < (amount + fees) && tradeType === 0 )
        {
            if ( tradeType === 0 )
            {
                amount =  amount - (fees * BigInt( 4 ))
                let trade = new Trade( swapTx.utils.route, new TokenAmount( swapTx.utils.trade.inputAmount.token, amount ), TradeType.EXACT_INPUT )
                let slipage = new Percent( BigInt( swapTx.utils.slipage * 100 ), BigInt( 100 * 100 ) )

                swapTx.calldata[0] = uint256.bnToUint256( amount )
                swapTx.calldata[1] = jsbi_to_Uint256( trade.minimumAmountOut( slipage ).raw )

                return swapTx
            }

            swapTx.calldata[1] = uint256.bnToUint256( amount - (fees * BigInt( 2 )) )
            return swapTx
        }
        else
            return swapTx

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
            const { addTx: addTx2 } = await get_add_liq_calldata( signer, eth_address, new_amount, tokenB_address, null, false, network, slipage, deadline )
            return addTx2
        }
        else
            return  addTx

    } catch (error) {
        
        throw( error )

    }
}