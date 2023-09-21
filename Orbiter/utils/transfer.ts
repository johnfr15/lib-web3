import { CrossAddressExt } from "../types"
import { ethers } from "ethers"
export const is_native_token = ( tokenAddress: string ): boolean => {

    // polygon matic token
    if ( tokenAddress === "0x0000000000000000000000000000000000001010" )
      return true

    return /^0x0+$/i.test( tokenAddress )
}

/**
 * 
 * @param ext 
 * @dev 
 *  - This function will concatenate the target network ( 0x01 == polygon, 0x03 == starknet ) and the wallet address of the sender
 *
 */
export const encode_ext = ( ext: CrossAddressExt ) => {

  return ethers.concat( [ ext.type, ext.value ] )
}