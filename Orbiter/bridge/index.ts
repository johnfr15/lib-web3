import { ethers } from "ethers"
import { BridgeToken, MarkerType } from "../types"



export const get_amounts = (
    token: BridgeToken,
    maker: MarkerType,
    amount: string,
    max: boolean
): { payAmount: bigint, receiveAmount: bigint } => {

    const { fromChainName, toChainName, tradingFee, fromPrecision, minPrice, maxPrice } = maker
    let pay_amount: any;

    const b_amount    = ethers.parseUnits( amount, fromPrecision )
    const b_min_price = ethers.parseUnits( minPrice.toString(), fromPrecision )
    const b_max_price = ethers.parseUnits( maxPrice.toString(), fromPrecision )

    // Check minPrice, maxPrice
    if ( b_amount < b_min_price )
      throw(`Amount less than minPrice( ${ minPrice } ), token: ${ token.name }, fromChain: ${ fromChainName }, toChain: ${ toChainName }`)
    if ( b_amount > b_max_price ) 
      throw(`Amount greater than maxPrice( ${ maxPrice } ), token: ${ token.name }, fromChain: ${ fromChainName }, toChain: ${ toChainName }`)
    

    if ( max )
      pay_amount = b_amount - BigInt( 10000 ) // letting enough for identification ID  
    else
      pay_amount = b_amount + ethers.parseUnits( tradingFee.toString(), fromPrecision )

    const receive_amount = get_receive_amount( ethers.formatUnits( pay_amount, fromPrecision ), maker )

    return { payAmount: pay_amount, receiveAmount: receive_amount }
}

export const get_receive_amount = ( inputAmount: string, selectMakerInfo: MarkerType ): bigint => {
    const { fromPrecision, tradingFee, gasFee } = selectMakerInfo

    let output_minus_tradingFee = ethers.parseUnits( inputAmount, fromPrecision ) - ethers.parseUnits( tradingFee.toString(), fromPrecision )
    
    let gas_fee = output_minus_tradingFee * BigInt( gasFee * 100 ) / BigInt( 100000 )

    let receive_amount = output_minus_tradingFee - gas_fee

    return receive_amount
}

