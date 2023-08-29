export const is_native_token = ( tokenAddress: string ): boolean => {

    // polygon matic token
    if ( tokenAddress === "0x0000000000000000000000000000000000001010" )
      return true

    return /^0x0+$/i.test( tokenAddress )
}