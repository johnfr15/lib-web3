import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { QuoteParams, QuoteOptions, Quote } from "../../type/api/quote";

dotenv.config()

const ENDPOINT = "/quote"

/**
 * @return Returns all the possible routes for bridging tokens from one chain to another. 
 *         One of the routes can be selected and passed in to start the route.
 */
export const get_quote = async( quote: QuoteParams, options?: QuoteOptions ): Promise<Quote> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { ...quote, ...options }
    const headers = {
        'API-KEY': process.env.SOCKET_APIKEY!,
        'Content-Type': 'application/json'
    }

    try {

        const res = await axios.get( url, { params, headers } )

        return res.data.result
        
    } catch (error) {
        
        throw( error )

    }
}