import { Contract, Wallet } from "ethers"

export type Token = {
    id: string,
    name: string,
    symbol: string,
    network: {
      name: string,
      shortName: string,
      addressValidation: string,
      memoNeeded: boolean,
      explorerUrl: string,
      addressUrl: string
    },
    color: string,
    keyword: string,
    displayName: string,
    chain?: number,
    address?: string,
    hasMarkup: boolean,
    hasFixed: boolean,
    hasFixedReverse: boolean,
    icon: string
}

export type Balance = { 
    big: bigint, 
    string: string, 
    decimals: number 
}

export type SwapOptions = {
    receiveAddress?: string
    slipage?: number
    anonymous?: boolean
    ip?: string,
    userAgent?: string,
}

export type TokenId = 'POOF' | 'ETH' | 'BNB' | 'BTC' | 'XMR' | 'ADA' | 'ARB' | 'ARC' | 'AVAXC' | 'BDX' | 'BRISE' | 'BONE' | 
                      'BTCLN' | 'BUSD' | 'BUSDETH' | 'ATOM' | 'CRO' | 'DAIBSC' | 'DAI' | 'DASH' | 'DCR' | 'DOGE' | 'ETHARB' | 
                      'ETHBASE' | 'ETHBSC' | 'FIRO' | 'FLOKI' | 'FTM' | 'HEX' | 'ICP' | 'KAVA' | 'KNCBSC' | 'KNC' | 'LEASH' | 
                      'LTC' | 'MATIC' | 'OP' | 'OPBNB' | 'PEPE' | 'PIVX' | 'SCRT' | 'SHIB' | 'SOL' | 'SOUL' | 'SUI' | 'TRX' | 
                      'USDCBSC' | 'USDC' | 'USDTARB' | 'USDTBSC' | 'USDT' | 'USDTTRON' | 'VERSE' | 'WAIT' | 'WBTC' | 'X7R' | 'XRP'

export type Network = 'Ethereum Mainnet' | 'Binance Smart Chain' | 'Bitcoin' | 'Monero' | 'Cardano' | 'Arbitrum' | 'Avalanche C-Chain' | 
                      'BELDEX' | 'BRISE network' | 'LN' | 'COSMOS network' | 'Chronos' | 'DASH' | 'DECRED' | 'Doge' | 'BASE Base' | 
                      'Firo network' | 'FANTOM network' | 'Internet Computer' | 'KAVA network' | 'Litecoin network' | 'Polygon' | 
                      'Optimism' | 'OPBNB' | 'PIVX' | 'Secret network' | 'Solana' | 'PHANTASMA' | 'SUI' | 'Tron network' | 'Ripple'

export type Quote = {
    amountOut: number
    min: number
    max: number
}

export type ExchangeOrder = {
    amount: number,
    from: TokenId,
    to: TokenId,
    receiverTag: string,
    addressTo: string,
    anonymous: boolean,
    ip: "0.0.0.0" | string,
    userAgent: string,
}

export type Order = {
    houdiniId: string,
    created: Date,
    senderAddress: string,
    receiverAddress: string,
    anonymous: boolean,
    expires: Date,
    status: number,
    inAmount: number,
    inSymbol: string,
    outAmount: number,
    outSymbol: string,
    fixed: false,
    direction: 'from',
    notified: false,
    eta: number
}

export type Trade = {
    eo: ExchangeOrder
    tokenFrom: Token
    tokenTo: Token
    amount: number
    quote: Quote
}

export type SwapTx = {
    signer: Wallet
    trade: Trade
    order: Order
}