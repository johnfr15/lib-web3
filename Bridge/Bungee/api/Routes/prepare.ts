import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { PrepareOptions } from "../../type/api/routes";

dotenv.config()

const ENDPOINT = "/route/prepare"

/**
 * 
 * @param activeRouteId  - Id of Active Route.
 * @param userTxIndex    - Index of the userTxs in the Active Route. Every active route will have a userTxs array. userTxIndex is the index of the object in the userTxs array.
 * @returns 
 */
export const start = async( activeRouteId: number, userTxIndex: number, options: PrepareOptions ): Promise< 'PENDING' | 'COMPLETED' > => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { activeRouteId, userTxIndex, ...options }
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