import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { RouteOptions, Route, RouteTx } from "../../types/api/app";
import { RouteData } from "../../types/api/quote";

dotenv.config()

const ENDPOINT = "/build-tx"
const DEFAULT_OPTIONS: RouteOptions = {
    bridgeSlippage: 2,
    swapSlippage: 2
}
/**
 * @notice Get the tx details for the route.
 */
export const get_build_tx = async( route: Route, options?: RouteOptions ): Promise<RouteTx> => {

    options = { ...DEFAULT_OPTIONS, ...options }
    
    const url = SOCKET_V2_URL + ENDPOINT
    const params = { ...route, ...options }
    const headers = {
        'API-KEY': process.env.SOCKET_APIKEY!,
        'Content-Type': 'application/json'
    }

    try {

        const res = await axios.get( url, { params, headers } )

        return res.data.result
        
    } catch (error: any) {
        
        throw( error.response.data.error.message )

    }
}

/**
 * @notice Get the tx details for the route.
 */
export const post_build_tx = async( route: RouteData ): Promise<any> => {

    
    const url = SOCKET_V2_URL + ENDPOINT
    const body = { route }
    const headers = {
        'API-KEY': process.env.SOCKET_APIKEY!,
        'Content-Type': 'application/json'
    }

    try {

        const res = await axios.post( url, body, { headers } )

        return res.data.result
        
    } catch (error: any) {
        
        throw( error.response.data.error.message )

    }
}