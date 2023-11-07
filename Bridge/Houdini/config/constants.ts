import erc20_abi from "./abis/erc20"
import { Network, SwapOptions } from "../types"





/***********************************|
|              ABIS                 |
|__________________________________*/
export const ERC20_ABI = erc20_abi





/***********************************|
|           CREDENTIALS             |
|__________________________________*/ 
export const HOUDINI_URL = "https://api-partner.houdiniswap.com"
export const PARTNER_ID = process.env.PARTNER_ID!
export const SECRET = process.env.HOUDINI_SECRET!





/***********************************|
|              TOKENS               |
|__________________________________*/
export const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const TOKENS: { [key in Network]: any } = {

  'Ethereum Mainnet': {},  
  'Binance Smart Chain': {},
  'Bitcoin': {},           
  'Monero': {},
  'Cardano': {},           
  'Arbitrum': {},
  'Avalanche C-Chain': {}, 
  'BELDEX': {},
  'BRISE network': {},     
  'LN': {},
  'COSMOS network': {},    
  'Chronos': {},
  'DASH': {},              
  'DECRED': {},
  'Doge': {},              
  'BASE Base': {},
  'Firo network': {},      
  'FANTOM network': {},
  'Internet Computer': {}, 
  'KAVA network': {},
  'Litecoin network': {},  
  'Polygon': {},
  'Optimism': {},          
  'OPBNB': {},
  'PIVX': {},              
  'Secret network': {},
  'Solana': {},            
  'PHANTASMA': {},
  'SUI': {},               
  'Tron network': {},
  'Ripple': {}
}





/***********************************|
|              MISC                 |
|__________________________________*/
export const DEFAULT_OPTION: SwapOptions = {
  slipage: 0.5, // 0.5% of slipage tolerance
  anonymous: true,
  ip: '0.0.0.0',
  userAgent: '',
}
