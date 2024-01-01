import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { BridgeStatus } from "../../type/api/app";

dotenv.config()

const ENDPOINT = "/bridge-status-t2b"

/**
 * @returns Returns the status of the bridging transaction if completed or pending.
 */
export const get_bridge_status_t2b = async( 
    transactionHash: string, 
    fromChainId: number, 
): Promise<BridgeStatus> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { transactionHash, fromChainId }
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