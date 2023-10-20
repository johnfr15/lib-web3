import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { AddressLike } from "ethers";
import { Balance } from "../../type/api/balances";

dotenv.config()

const ENDPOINT = "/balances/token-balance"

/**
 * @return Returns the balance of the token on any given chain
 */
export const get_balance = async( tokenAddress: AddressLike, chainId: number, userAddress: AddressLike ): Promise<Balance> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { tokenAddress, chainId, userAddress }
    const headers = {
        'API-KEY': process.env.SOCKET_APIKEY!,
        'Content-Type': 'application/json'
    }

    try {

        const res = await axios.get( url, { params, headers } )

        res.data.result.balance = BigInt( res.data.result.balance )

        return res.data.result
        
    } catch (error) {
        
        throw( error )

    }
}