import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { AddressLike } from "ethers";
import { Balance } from "../../type/api/balances";

dotenv.config()

const ENDPOINT = "/balances"

/**
 * @return Returns the balance of all tokens for a user address on all supported chains
 */
export const get_all_balances = async( userAddress: AddressLike ): Promise<Balance[]> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { userAddress }
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