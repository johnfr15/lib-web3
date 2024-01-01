import axios from "axios";
import dotenv from "dotenv"
import { SOCKET_V2_URL } from "../../config/constants";
import { AddressLike } from "ethers";

dotenv.config()

const ENDPOINT = "/approval/check-allowance"

/**
 * @notice Gives approval values of given tokens for a given owner & chainId
 */
export const check_allowance = async(
    chainID: number,
    owner: AddressLike,
    allowanceTarget: AddressLike,
    tokenAddress: AddressLike
): Promise<{ value: bigint, tokenAddress: string }> => {

    const url = SOCKET_V2_URL + ENDPOINT
    const params = { chainID, owner, allowanceTarget, tokenAddress }
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