import { AddressLike } from "ethers";
import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../../config/constants";
import { UsersOptions } from "../../../type/api/active-routes/users";
import { ActiveRoute } from "../../../type/api/routes";

dotenv.config()

const ENDPOINT = "/route/active-routes/users"
const DEFAULT_OPTIONS: UsersOptions = {
    sort: 'updatedAt'
}

/**
 * @notice Get all the active routes from a user address. Filters like fromChainId, 
 *         toChainId and token addresses can be used to get back specific active routes.
 */
export const users = async( userAddress: AddressLike, options?: UsersOptions ): Promise<ActiveRoute> => {

    options = { ...DEFAULT_OPTIONS, ...options }

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { userAddress, ...options }
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