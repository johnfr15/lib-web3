import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { ActiveRoute, BuildNextTxOptions } from "../../type/api/routes";

dotenv.config()

const ENDPOINT = "/route/build-next-tx"
const DEFAULT_OPTIONS: BuildNextTxOptions = {
    bridgeSlippage: 2,
    swapSlippage: 2
}

/**
 * @notice Get next tx details of an active route
 */
export const build_next = async( activeRouteId: number, options?: BuildNextTxOptions ): Promise<ActiveRoute> => {

    options = { ...DEFAULT_OPTIONS, ...options }

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