import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { Chain } from "../../type/api/supported";

dotenv.config()

const ENDPOINT = "/supported/chains"

/**
 * @notice Get if token is supported.
 */
export const get_supported_chains = async(): Promise<Chain[]> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const headers = {
        'API-KEY': process.env.SOCKET_APIKEY!,
        'Content-Type': 'application/json'
    }

    try {

        const res = await axios.get( url, { headers } )

        return res.data.result
        
    } catch (error) {
        
        throw( error )

    }
}