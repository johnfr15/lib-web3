import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { ToTokenListOptions } from "../../type/api/tokenLists"
import { Token } from "../../type/types";

dotenv.config()

const ENDPOINT = "/token-lists/to-token-list"
const DEFAULT_OPTIONS: ToTokenListOptions = {
    isShortList: true
}

export const get_to_token_list = async( fromChainId: number, toChainId: number, options?: ToTokenListOptions ): Promise<Token[]> => {

    options =  { ...DEFAULT_OPTIONS, ...options }

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { fromChainId, toChainId, ...options }
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