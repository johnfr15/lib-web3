import { ethers, Wallet } from "ethers";
import { ExchangeOrder, TokenId, Network, SwapOptions, Trade, Token, Quote, Balance } from "../types";
import { get_quote } from "../api/quote"
import { get_token } from "../api/tokens";
import { get_balance } from ".";


export const get_trade = async(    
    signer: Wallet,
    amount: string,
    tokenFrom: TokenId,
    tokenTo: TokenId,
    fromNetwork: Network, 
    toNetwork: Network,
    options: SwapOptions
): Promise<Trade> => {

    try {
        
        const token_from: Token     = await get_token( tokenFrom, fromNetwork )
        const token_to: Token       = await get_token( tokenTo, toNetwork )
        const balance_from: Balance = await get_balance( token_from, signer )

        
        if ( parseFloat( amount ) > parseFloat( balance_from.string ) )
            throw new Error(`Error: Not enough balance. Expect to send ${ amount } ${ token_from.symbol } but balance is ${ balance_from.string } ${ token_from.symbol }`)


        const quote: Quote          = await get_quote( amount, tokenFrom, tokenTo, options.anonymous! )
        const eo: ExchangeOrder     = get_eo( signer, amount, tokenFrom, tokenTo, options )


        if ( parseFloat( amount ) < quote.min )
            throw new Error(`Error: Not enought amount ${ amount } ${ token_from.symbol } but require at least ${ quote.min } ${ token_from.symbol }`)
        if ( parseFloat( amount ) > quote.max )
            throw new Error(`Error: Amount exceed ${ amount } ${ token_from.symbol } but maximum is ${ quote.max } ${ token_from.symbol }`)



        const trade: Trade = {
            eo: eo,
            tokenFrom: token_from,
            tokenTo: token_to,
            amount: parseFloat( amount ),
            quote: quote
        }

        return trade

    } catch ( error: any ) {

        throw( error )

    }
}

const get_eo = (
    signer: Wallet,
    amount: string,
    tokenFrom: TokenId,
    tokenTo: TokenId,
    options: SwapOptions
): ExchangeOrder => {

    const { anonymous, receiveAddress, ip, userAgent } = options

    const eo: ExchangeOrder = {
        amount: parseFloat( amount ),
        from: tokenFrom,
        to: tokenTo,
        receiverTag: "",
        addressTo: receiveAddress ?? signer.address,
        anonymous: anonymous!,
        ip: ip!,
        userAgent: userAgent!
    }

    return eo
} 
