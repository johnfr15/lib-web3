import axios from "axios"
import { HOUDINI_URL, PARTNER_ID, SECRET } from "../config/constants"
import { Quote, TokenId } from "../types"

const ENDPOINT = '/quote'

export const get_quote = async( amount: string, tokenFrom: TokenId, tokenTo: TokenId, anonymous: boolean ): Promise<Quote> => {

    const url = HOUDINI_URL + ENDPOINT
    const headers = {
        'Authorization': `${ PARTNER_ID }:${ SECRET }`,
        'Content-Type': 'application/json'
    }
    const params = { 
        amount: amount, 
        from: tokenFrom, 
        to: tokenTo, 
        anonymous: anonymous 
    }

    try {
        
        const res = await axios.get( url, { headers, params } )
        const quote: Quote = res.data

        return quote

    } catch ( error: any ) {
        
        throw( error )

    }
}
