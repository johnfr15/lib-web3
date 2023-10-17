import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { BridgeStatusOptions, BridgeStatus } from "../../type/api/app";

dotenv.config()

const ENDPOINT = "/health"

/**
 * @return Returns the status of the bridging transaction if completed or pending.
 */
export const get_health = async(): Promise<boolean> => {

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