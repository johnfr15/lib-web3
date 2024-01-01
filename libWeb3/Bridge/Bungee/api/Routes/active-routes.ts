import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { ActiveRoute } from "../../type/api/routes";

dotenv.config()

const ENDPOINT = "/route/active-routes"

export const start = async( activeRouteId: number ): Promise<ActiveRoute> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { activeRouteId }
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