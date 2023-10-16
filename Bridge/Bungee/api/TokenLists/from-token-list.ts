import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { FromTokenListOptions } from "../../type/api/tokenLists"

dotenv.config()

const ENDPOINT = "/token-lists/from-token-list"
const DEFAULT_OPTIONS: FromTokenListOptions = {
    isShortList: true
}

export const get_from_token_list = async( fromChainId: number, options?: FromTokenListOptions ) => {

    options =  { ...DEFAULT_OPTIONS, ...options }

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { fromChainId, ...options }
    const headers = {
        'API-KEY': process.env.SOCKET_APIKEY!,
        'Content-Type': 'application/json'
    }

    try {

        const res = await axios.get( url, { params, headers } )

        return res.data 
        
    } catch (error) {
        
        throw( error )

    }
}