import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { GasPrice } from "../../type/api/app";

dotenv.config()

const ENDPOINT = "/gas-price"

/**
 * @notice Current gas prices for a chain
 */
export const get_gas_price = async( chainId: number ): Promise<GasPrice> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { chainId }
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