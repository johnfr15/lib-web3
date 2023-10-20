import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { StartRoute } from "../../type/api/routes";
import { RouteTx } from "../../type/api/app";

dotenv.config()

const ENDPOINT = "/route/start"

export const start = async( route: StartRoute ): Promise<RouteTx> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const headers = {
        'API-KEY': process.env.SOCKET_APIKEY!,
        'Content-Type': 'application/json'
    }

    try {

        const res = await axios.post( url, route, { headers } )

        return res.data.result
        
    } catch (error) {
        
        throw( error )

    }
}