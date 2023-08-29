import { ethers } from "ethers"
import { BridgeToken, MarkerType } from "../types"


/**
   * @param token
   * @param fromChain
   * @param toChain
   * @param amount Human readable amount
   */
export const get_amounts = (
    token: BridgeToken,
    maker: MarkerType,
    amount: string,
    max: boolean
): { payAmount: bigint, receiveAmount: bigint } => {

    const { fromChainName, toChainName, tradingFee, precision, minPrice, maxPrice } = maker
    let pay_amount: any;

    const b_amount    = ethers.parseUnits( amount, precision )
    const b_min_price = ethers.parseUnits( minPrice, precision )
    const b_max_price = ethers.parseUnits( maxPrice, precision )

    // Check minPrice, maxPrice
    if ( b_amount < b_min_price )
      throw new Error(`Orbiter get amounts failed: amount less than minPrice(${ minPrice }), token: ${token.name}, fromChain: ${ fromChainName }, toChain: ${ toChainName }`)
    if ( b_amount > b_max_price ) 
      throw new Error(`Orbiter get amounts failed: amount greater than maxPrice(${ maxPrice }), token: ${token.name}, fromChain: ${ fromChainName }, toChain: ${ toChainName }`)
    

    if ( max )
      pay_amount = b_amount - BigInt( 10000 ) // letting enough for identification ID  
    else
      pay_amount = b_amount + ethers.parseUnits( tradingFee, precision )

    const receive_amount = get_receive_amount( ethers.formatUnits( pay_amount, precision ), maker )

    return { payAmount: pay_amount, receiveAmount: receive_amount }
}

const get_receive_amount = ( inputAmount: string, selectMakerInfo: MarkerType ): bigint => {
    const { precision, tradingFee, gasFee } = selectMakerInfo

    let output_minus_tradingFee = ethers.parseUnits( inputAmount, precision ) - ethers.parseUnits( tradingFee, precision )
    
    let gas_fee = output_minus_tradingFee * BigInt( gasFee * 100 ) / BigInt( 100000 )

    let receive_amount = output_minus_tradingFee - gas_fee

    return receive_amount
}
