import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { TokenPrice } from "../../type/api/app";
import { AddressLike } from "ethers";

dotenv.config()

const ENDPOINT = "/token-price"

export const get_token_price = async( tokenAddress: AddressLike, chainId: number ): Promise<TokenPrice> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { tokenAddress, chainId }
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