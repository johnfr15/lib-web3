import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";

dotenv.config()

const ENDPOINT = "/tx-receipt"

/**
 * @return Returns the status of the bridging transaction if completed or pending.
 */
export const get_tx_receipt = async( transactionHash: string, chainId: number ): Promise<Object> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { transactionHash, chainId }
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