import { Chains, Fees } from "../types"

// V3 POOL

export const BEST_FEE_POOL: { [key in Chains]: any } = {

    ethereum: {
                  
        WETH_USDC: Fees.LOW,
        WETH_USDT: Fees.LOW,
        WETH_DAI: Fees.VERY_LOW,
  
        USDC_WETH: Fees.LOW,
        USDC_USDT: Fees.VERY_LOW,
        USDC_DAI: Fees.VERY_LOW,
  
        USDT_WETH: Fees.LOW,
        USDT_USDC: Fees.VERY_LOW,
        USDT_DAI: Fees.VERY_LOW,
  
        DAI_WETH: Fees.VERY_LOW,
        DAI_USDC: Fees.VERY_LOW,
        DAI_USDT: Fees.VERY_LOW,

    },

    arbitrum: {
  
        WETH_USDC: Fees.LOW,
        WETH_USDT: Fees.LOW,
        WETH_DAI: Fees.VERY_LOW,
  
        USDC_WETH: Fees.LOW,
        USDC_USDT: Fees.VERY_LOW,
        USDC_DAI: Fees.VERY_LOW,
  
        USDT_WETH: Fees.LOW,
        USDT_USDC: Fees.VERY_LOW,
        USDT_DAI: Fees.VERY_LOW,
  
        DAI_WETH: Fees.VERY_LOW,
        DAI_USDC: Fees.VERY_LOW,
        DAI_USDT: Fees.VERY_LOW,

    },

    bsc: {

        BNB_WETH: Fees.MEDIUM,
        BNB_USDC: Fees.MEDIUM,
        BNB_USDT: Fees.LOW,
        BNB_DAI: Fees.LOW,

        WETH_BNB: Fees.MEDIUM,
        WETH_USDC: Fees.LOW,
        WETH_USDT: Fees.LOW,
        WETH_DAI: Fees.LOW,
  
        USDC_BNB: Fees.MEDIUM,
        USDC_WETH: Fees.LOW,
        USDC_USDT: Fees.VERY_LOW,
        USDC_DAI: Fees.LOW,
  
        USDT_BNB: Fees.LOW,
        USDT_WETH: Fees.LOW,
        USDT_USDC: Fees.VERY_LOW,
        USDT_DAI: Fees.VERY_LOW,
  
        DAI_BNB: Fees.LOW,
        DAI_WETH: Fees.LOW,
        DAI_USDC: Fees.LOW,
        DAI_USDT: Fees.VERY_LOW,

    },
  
    zkevm: {},
    linea: {},
    base: {},
    zksync: {},









    ethereumTestnet: {

        WETH_USDC: Fees.LOW,
        WETH_USDT: Fees.LOW,
        WETH_DAI: Fees.VERY_LOW,
  
        USDC_WETH: Fees.LOW,
        USDC_USDT: Fees.VERY_LOW,
        USDC_DAI: Fees.VERY_LOW,
  
        USDT_WETH: Fees.LOW,
        USDT_USDC: Fees.VERY_LOW,
        USDT_DAI: Fees.VERY_LOW,
  
        DAI_WETH: Fees.VERY_LOW,
        DAI_USDC: Fees.VERY_LOW,
        DAI_USDT: Fees.VERY_LOW,

    },

    arbitrumTestnet: {

        WETH_USDC: Fees.LOW,
        WETH_USDT: Fees.LOW,
        WETH_DAI: Fees.VERY_LOW,
  
        USDC_WETH: Fees.LOW,
        USDC_USDT: Fees.VERY_LOW,
        USDC_DAI: Fees.VERY_LOW,
  
        USDT_WETH: Fees.LOW,
        USDT_USDC: Fees.VERY_LOW,
        USDT_DAI: Fees.VERY_LOW,
  
        DAI_WETH: Fees.VERY_LOW,
        DAI_USDC: Fees.VERY_LOW,
        DAI_USDT: Fees.VERY_LOW,

    },

    bscTestnet: {

        BNB_WETH: Fees.MEDIUM,
        BNB_USDC: Fees.MEDIUM,
        BNB_USDT: Fees.LOW,
        BNB_DAI: Fees.LOW,

        WETH_BNB: Fees.MEDIUM,
        WETH_USDC: Fees.LOW,
        WETH_USDT: Fees.LOW,
        WETH_DAI: Fees.LOW,
  
        USDC_BNB: Fees.MEDIUM,
        USDC_WETH: Fees.LOW,
        USDC_USDT: Fees.VERY_LOW,
        USDC_DAI: Fees.LOW,
  
        USDT_BNB: Fees.LOW,
        USDT_WETH: Fees.LOW,
        USDT_USDC: Fees.VERY_LOW,
        USDT_DAI: Fees.VERY_LOW,
  
        DAI_BNB: Fees.LOW,
        DAI_WETH: Fees.LOW,
        DAI_USDC: Fees.LOW,
        DAI_USDT: Fees.VERY_LOW,

    },

    zkSyncTestnet: {},
    zkevmTestnet: {}
}