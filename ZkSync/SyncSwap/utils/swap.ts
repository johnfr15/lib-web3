import { Wallet, ethers } from "ethers";
import { Pool, Trade, Token, SwapStep, SwapPath, WithdrawMode } from "../types";
import { get_quote } from ".";
import { ZERO_ADDRESS } from "../config/constants";


export const get_trade = async(
    signer: Wallet,
    path: [string, string],
    tokenIn: Token, 
    tokenOut: Token,
    amountIn: string,
    pool: Pool,
    slipage: number,
    deadline: number | undefined,
    network: 'TESTNET' | 'MAINNET'
): Promise<Trade> => {

    try {
        
        const amount_in: bigint  = ethers.parseUnits( amountIn, tokenIn.decimals ) 
        const amount_out: bigint = get_amount_out( amount_in, pool.reserveA, pool.reserveB )
        const amount_out_min: bigint = amount_out * BigInt( 100 * 100 - (slipage * 100) ) / BigInt( 100 * 100 )

        // There is only 1 step (2 tokens involved in the tx)
        const steps: SwapStep[] = [{
            pool: pool.pair,
            data: encode_swap( tokenIn.address, signer.address, WithdrawMode.WITHDRAW_AND_UNWRAP_TO_NATIVE_ETH ),
            callback: ZERO_ADDRESS, // we don't have a callback
            callbackData: '0x',
        }];

        // There is only 1 step (2 tokens involved in the tx)
        const paths: SwapPath[] = [{
            steps: steps,
            tokenIn: path[0],
            amountIn: amount_in,
        }]

        return { 
            path: path,
            paths: paths,
            tokenFrom: tokenIn,
            tokenTo: tokenOut,
            pool: pool,
            amountIn: amount_in, 
            amountOut: amount_out, 
            amountOutMin: amount_out_min, 
            priceImpact: 0,
            deadline: deadline ?? Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
            network: network
        }

    } catch (error) {
        
        throw error

    }
}

export const calc_price_impact = async( trade: Trade, pool: Pool ): Promise<number> => {

    let percent: number

    const reserve_in  = BigInt( trade.tokenFrom.address ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB
    const reserve_out = BigInt( trade.tokenTo.address   ) === BigInt( pool.tokenA.address ) ? pool.reserveA : pool.reserveB

    const quoteOut: string = get_quote( ethers.formatUnits( trade.amountIn, trade.tokenFrom.decimals), trade.tokenFrom, trade.tokenTo, pool )
    const diffOut: bigint  = trade.amountOut * reserve_out / ethers.parseUnits( quoteOut, trade.tokenTo.decimals)

    percent = 10000 - parseFloat( (reserve_out * BigInt( 10000 ) / diffOut).toString() )

    const priceImpact = percent < 0 ? -percent / 100 : percent / 100

    return priceImpact
}

export const encode_swap = (tokenIn: string, signerAddress: string, withdrawMode: WithdrawMode): string => {

    const abiCoder = ethers.AbiCoder.defaultAbiCoder()

    const encoded_data = abiCoder.encode(
        [ "address", "address", "uint8" ],
        [ tokenIn, signerAddress, withdrawMode ],
    )

    return encoded_data
}

export const get_amount_out = (amount_in: bigint, reserve_in: bigint, reserve_out: bigint ): bigint => {
    let amount_out: bigint

    let amountInWithFee = amount_in * BigInt( 1000 ); // No fees
    let numerator = amountInWithFee * reserve_out;
    let denominator = reserve_in * BigInt( 1000 ) + amountInWithFee;
    amount_out = numerator / denominator;

    return  amount_out
}