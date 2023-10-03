import erc20_abi from "./abis/erc20"
import v2_router_abi from "./abis/v2_router" 
import v2_factory_abi from "./abis/v2_factory" 
import v2_pair_abi from "./abis/v2_pair"




// Misc
export const ARBITRUM_PROVIDER: {[key: string]: string} = {
  "MAINNET": "https://arbitrum-mainnet.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8",
  "TESTNET": "https://arbitrum-goerli.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8",
}





// ABIS
export const ERC20_ABI = erc20_abi
export const V2_ROUTER_ABI = v2_router_abi
export const V2_FACTORY_ABI = v2_factory_abi
export const V2_PAIR_ABI = v2_pair_abi





// Addresses
export const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
export const V3_FACTORY = '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865'

export const SWAP_ROUTER: { [key: string | number]: string } = {
  'MAINNET': "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
  'TESTNET': "0x1b81D678ffb9C0263b24A97847620C99d213eB14"
}

export const QUOTER_V2: { [key: string | number]: string } = {
  'MAINNET': "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
  'TESTNET': "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2"
}

export const MASTER_CHEF: { [key: string | number]: string } = {
  'MAINNET': "0x5e09ACf80C0296740eC5d6F643005a4ef8DaA694",
  'TESTNET': "0x66A9870FF7707936B0B0278cF999C5f2Ac2e42F5"
}

export const SMART_ROUTER: { [key: string | number]: string } = {
  'MAINNET': "0x32226588378236Fd0c7c4053999F88aC0e5cAc77",
  'TESTNET': "0x9a489505a00cE272eAa5e07Dba6491314CaE3796"
}

export const WETH: { [key: string | number]: string } = {
  'MAINNET': "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  'TESTNET': "0x5B67676a984807a212b1c59eBFc9B3568a474F0a"
}

export const CHAIN_ID: { [key: string]: number } = {
  'MAINNET': 42161,
  'TESTNET': 421613,
}




// Tokens
export const TOKENS: { [key: string]: any } = {

  'MAINNET': {
      eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      weth: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      dai: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  'TESTNET': {
      eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      weth: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      dai: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
      usdc: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747', 
      usdt: '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832', 
  }
}

export const TICKER: {[key: string]: string} = {

    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": "ETH",

    "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": "WETH",
    "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa": "WETH",

    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": "USDC",
    "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747": "USDC",

    "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063": "DAI",
    "0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253": "DAI",

    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": "USDT",
    "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832": "USDT",
}

