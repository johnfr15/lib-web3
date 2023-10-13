import axios from "axios"
import { TokenId, Network, Token } from "../types"
import { HOUDINI_URL, PARTNER_ID, SECRET } from "../config/constants"

const ENDPOINT = '/tokens'

export const get_token = async( tokenId: TokenId, network: Network ): Promise<Token> => {

    let Tokens: Token[]

    const url = HOUDINI_URL + ENDPOINT
    const headers = {
        'Authorization': `${ PARTNER_ID }:${ SECRET }`,
        'Content-Type': 'application/json'
    }

    try {
        
        const response = await axios.get( url, { headers } )

        Tokens = response.data
        
    } catch ( error: any ) {

        throw( error )    

    }

    const token = Object.values( Tokens ).find( (token: Token) => 
    {
        if ( tokenId === token.id && network === token.network.name )
            return true

        return false
    })


    if ( token === undefined )
        throw(`Error: Token ${ tokenId } not available on network ${ network }.`)
    

    return token
}