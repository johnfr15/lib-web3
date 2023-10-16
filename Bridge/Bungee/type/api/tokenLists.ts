export type ToTokenListOptions = {
    // Flag to specify if tokens that need dex swap should be ignored. This option will be ignored if singleTxOnly is marked true.
    disableSwapping?: boolean
    // Specify Dexes that should be included for token support.
    includeDexes?: string[]
    // Specify Dexes that should be excluded for token support. This option will be ignored if includeDexes is specified.
    excludeDexes?: string[]
    // Specify Bridges that should be included for token support.
    includeBridges?: string[]
    // Specify Bridges that should be excluded for token support. This option will be ignored if includeBridges is specified.
    excludeBridges?: string[]
    // To be Marked true if you want the token list that needs only a single transaction from the user to bridge.
    singleTxOnly?: boolean
    // To be Marked true if you want the shorter and more efficient token list.
    isShortList?: boolean
}

export type FromTokenListOptions = {
    // Id of destination chain, e.g xDAI = 100
    toChainId?: string
    // Flag to specify if tokens that need dex swap should be ignored. This option will be ignored if singleTxOnly is marked true.
    disableSwapping?: boolean
    // Specify Dexes that should be included for token support.
    includeDexes?: string[]
    // Specify Dexes that should be excluded for token support. This option will be ignored if includeDexes is specified.
    excludeDexes?: string[]
    // Specify Bridges that should be included for token support.
    includeBridges?: string[]
    // Specify Bridges that should be excluded for token support. This option will be ignored if includeBridges is specified.
    excludeBridges?: string[]
    // To be Marked true if you want the token list that needs only a single transaction from the user to bridge.
    singleTxOnly?: boolean
    // To be Marked true if you want the shorter and more efficient token list.
    isShortList?: boolean
}