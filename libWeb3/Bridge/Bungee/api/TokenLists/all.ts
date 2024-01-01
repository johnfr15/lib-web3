import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { Token } from "../../type/types";

dotenv.config()

const ENDPOINT = "/token-lists/all"

export const get_all_token = async( isShortList: boolean = true ): Promise<Token[]> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { isShortList: isShortList }
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