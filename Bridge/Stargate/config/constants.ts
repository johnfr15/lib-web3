import { BridgeOptions, Chains } from "../types"
import erc20_abi from "./abis/erc20"
import router_abi from "./abis/router"
import router_eth_abi from "./abis/router_eth"



// Misc
export const POLYGON_PROVIDER: {[key: string]: string} = {
  "MAINNET": "https://polygon-mainnet.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8",
  "TESTNET": "https://polygon-mumbai.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8",
}






// ABIS
export const ERC20_ABI = erc20_abi
export const ROUTER_ABI = router_abi
export const ROUTER_ETH_ABI = router_eth_abi






// Addressess
export const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const ROUTER: { [key in Chains]: any } = {
  polygon: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
  arbitrum: "0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614",
  optimism: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
  ethereum: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
  avalanche: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
  bsc: "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8",
  metis: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590", 
  kava: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
  linea: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
  base: '0x45f1A95A4D3f3836523F5c83673c797f4d4d263B',

  ethereumTestnet: '0x7612aE2a34E5A363E137De748801FB4c86499152',
  polygonTestnet: '0x817436a076060D158204d955E5403b6Ed0A5fac0',
  arbitrumTestnet: '0xb850873f4c993Ac2405A1AdD71F6ca5D4d4d6b4f',
  avalancheTestnet: "0x13093E05Eb890dfA6DacecBdE51d24DabAb2Faa1",
} 

export const ROUTER_ETH: { [key in Chains]: any } = {
  ethereum: "0x150f94B44927F078737562f0fcF3C95c01Cc2376",
  polygon: "",
  arbitrum: "0xbf22f0f184bCcbeA268dF387a49fF5238dD23E40",
  optimism: "0xB49c4e680174E331CB0A7fF3Ab58afC9738d5F8b",
  avalanche: "",
  bsc: "0x50B6EbC2103BFEc165949CC946d739d5650d7ae4",
  metis: "", 
  kava: "",
  linea: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
  base: '',

  ethereumTestnet: '',
  polygonTestnet: '',
  arbitrumTestnet: '',
  avalancheTestnet: "",
} 

export const WETH: { [key in Chains]: any } = {
  polygon: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  arbitrum: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1 ",
  optimism: "",
  ethereum: "",
  avalanche: "",
  bsc: "",
  metis: "", 
  kava: "",
  linea: "",
  base: '',
  
  ethereumTestnet: '',
  polygonTestnet: '',
  arbitrumTestnet: '',
  avalancheTestnet: "",
}


export const TOKENS: { [key in Chains]: any } = {

  polygon: {
    matic: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    wmatic: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    usdc:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    dai:'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    usdt:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },

  arbitrum: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    usdc:'0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    dai:'0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    usdt:'0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  
  optimism: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x4200000000000000000000000000000000000006",
    dai: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    usdc: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    usdt: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },

  ethereum: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },

  avalanche: {
    avax: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    weth: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    usdt: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    dai: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  },

  bsc: {
    bnb: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    dai: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    usdt: '0x55d398326f99059fF775485246999027B3197955',
  },

  metis: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x420000000000000000000000000000000000000A",
    usdc: "0xEA32A96608495e54156Ae48931A7c20f0dcc1a21",
    usdt: "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC",
    dai: '0x4c078361FC9BbB78DF910800A991C7c3DD2F6ce0',
  },
  
  kava: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D",
    usdc: "0xfA9343C3897324496A05fC75abeD6bAC29f8A40f",
    usdt: "0xB44a9B6905aF7c801311e8F4E76932ee959c663C",
    dai: '0x765277EebeCA2e31912C9946eAe1021199B39C61',
  },
  
  linea: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f",
    usdc: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
    usdt: "0xa219439258ca9da29e9cc4ce5596924745e12b93",
    dai: '0x4af15ec2a0bd43db75dd04e62faa3b8ef36b00d5',
  },

  base: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x4200000000000000000000000000000000000006",
    usdc: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    usdt: "",
    dai: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  },

  ethereumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    dai: '0x73967c6a0904aA032C103b4104747E88c566B1A2',
    weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    sgeth: '0xCf1F9cD3789Fc6296f4abB11dc460067Ae1a2673',
    usdc:'0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620',
    usdt:'0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951',
  },

  avalancheTestnet: {
    avax: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth: '',
    dai: '0x12C135a68b7B3Cd006eDb785cB53398a5DA59613',
    usdc:'0x4A0D1092E9df255cf95D72834Ea9255132782318',
    usdt:'0x134Dc38AE8C853D1aa2103d5047591acDAA16682',
  },

  polygonTestnet: {
    matic: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    usdc:'0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7',
    usdt:'0x6Fc340be8e378c2fF56476409eF48dA9a3B781a0',
    wmatic: "0x5B67676a984807a212b1c59eBFc9B3568a474F0a",
    weth: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    dai:'0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
  },

  arbitrumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    sgeth: "0xb45186E02CC4AbC0e390EdFfdc2aBC8D523ea15e",
    weth: '',
    usdc:'0x6aAd876244E7A1Ad44Ec4824Ce813729E5B6C291',
    usdt:'0x533046F316590C19d99c74eE661c6d541b64471C',
  },
}

// Function

export const DEFAULT_BRIDGE_OPTION: BridgeOptions = {
  max: false,
  slipage: 2          // 2% of slipage tolerance
}

// STARGATE

export const MINIMUM_GAS: bigint = BigInt( 100000 )

export enum Stargate_func {
  NULL,
  SWAP_REMOTE,
  ADD_LIQUIDITY,          
  REDEEM_LOCAL_CALL_BACK,
  WITHDRAW_REMOTE,
}

export const STARGATE_POOL_IDS: { [key in Chains]: any } = {

  arbitrum: {
    'USDC.e': 1,
    USDT: 2,
    FRAX: 7,
    SGETH: 13,
    LUSD: 15,
    MAI: 16,
  },

  arbitrumTestnet: {
    USDC: 1,
    USDT: 2,
    FRAX: 7,
    SGETH: 13,
    LUSD: 15,
    MAI: 16,
  },

  polygon: {
    USDC: 1,
    USDT: 2,
    DAI: 3,
    MAI: 16,
  },

  polygonTestnet: {
    USDC: 1,
    USDT: 2,
    DAI: 3,
    MAI: 16,
  },

  optimism: {
    USDC: 1,
    DAI: 3,
    FRAX: 7,
    SGETH: 13,
    sUSD: 14,
    LUSD: 15,
    MAI: 16,
  },

  ethereum: {
    USDC: 1,
    USDT: 2,
    DAI: 3,
    FRAX: 7,
    USDD: 11,
    SGETH: 13,
    sUSD: 14,
    LUSD: 15,
    MAI: 16,
    METIS: 17,
    metisUSDT: 19,
  },

  avalanche: {
    USDC: 1,
    USDT: 2,
    FRAX: 7,
    MAI: 16,
    metisUSDT: 19,  
  },

  avalancheTestnet: {
    USDC: 1,
    USDT: 2,
    FRAX: 7,
    MAI: 16,
    metisUSDT: 19,  
  },

  bsc: {
    USDT: 2,
    BUSD: 5,
    USDD: 11,
    MAI: 16,
    METIS: 17,
    metisUSDT: 19,
  },

  ethereumTestnet: {
    USDC: 1,
    USDT: 2,
    DAI: 3,
    FRAX: 7,
    USDD: 11,
    SGETH: 13,
    sUSD: 14,
    LUSD: 15,
    MAI: 16,
    METIS: 17,
    metisUSDT: 19,
  },

  metis: {
    METIS: 17,
    "metisUSDT": 19,
  }, 

  kava: {
    USDT: 2
  },

  linea: {
    ETH: 13,
  },

  base: {
    USDC: 1, 
    ETH: 13,
  },
}

export const STARGATE_CHAIN_ID: { [ key in Chains ]: number } = {

  ethereum: 101,
  bsc: 102,
  avalanche: 106,
  polygon: 109,
  arbitrum: 110,
  optimism: 111,
  metis: 151, 
  kava: 177,
  linea: 183,
  base: 184,
  
  ethereumTestnet: 10121,
  arbitrumTestnet: 10143,
  polygonTestnet: 10109,
  avalancheTestnet: 10106,
}

// Misc 
export const CHAIN_ID: { [ key in Chains ]: number } = {

  ethereum: 1,
  arbitrum: 42161,
  polygon: 137,
  avalanche: 43114,
  optimism: 10,
  bsc: 56,
  metis: 1088, 
  kava: 2222,
  linea: 59144,
  base: 8453,

  ethereumTestnet: 5,
  arbitrumTestnet: 421613,
  polygonTestnet: 80001,
  avalancheTestnet: 43113,
}

export const CHAIN_ID_TO_NAME: { [ key: number ]: Chains } = {

  1: "ethereum", 
  42161: "arbitrum",
  56: "bsc",
  137: "polygon", 
  43114: "avalanche",
  10: "optimism",
  1088: "metis",
  2222: "kava",
  59144: "linea",
  8453: "base",

  5: "ethereumTestnet",
  421613: "arbitrumTestnet",
}