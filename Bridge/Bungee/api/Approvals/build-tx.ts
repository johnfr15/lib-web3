import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { AddressLike } from "ethers";

dotenv.config()

const ENDPOINT = "/approval/build-tx"

/**
 * @return Return the Approval Tx Data for the given params.
 */
export const get_approval_tx = async(
    chainID: number,
    owner: AddressLike,
    allowanceTarget: AddressLike,
    tokenAddress: AddressLike,
    amount: bigint
): Promise<{ data: string, to: AddressLike, from: AddressLike }> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { chainID, owner, allowanceTarget, tokenAddress, amount }
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