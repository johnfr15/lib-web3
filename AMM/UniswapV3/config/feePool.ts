import { Chains, Fees } from "../types"

// V3 POOL

export const BEST_FEE_POOL: { [key in Chains]: any } = {

    polygon: {

      WMATIC_WETH: Fees.MEDIUM,
      WMATIC_USDC: Fees.LOW,
      WMATIC_USDT: Fees.LOW,
      WMATIC_DAI: Fees.MEDIUM,

      WETH_WMATIC: Fees.MEDIUM,
      WETH_USDC: Fees.LOW,
      WETH_USDT: Fees.MEDIUM,
      WETH_DAI: Fees.MEDIUM,

      USDC_WMATIC: Fees.LOW,
      USDC_WETH: Fees.LOW,
      USDC_USDT: Fees.VERY_LOW,
      USDC_DAI: Fees.VERY_LOW,

      USDT_WMATIC: Fees.LOW,
      USDT_WETH: Fees.MEDIUM,
      USDT_USDC: Fees.VERY_LOW,
      USDT_DAI: Fees.VERY_LOW,

      DAI_WMATIC: Fees.MEDIUM,
      DAI_WETH: Fees.MEDIUM,
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
    
    optimism: {
          
        WETH_USDC: Fees.MEDIUM,
        WETH_USDT: Fees.MEDIUM,
        WETH_DAI: Fees.LOW,
  
        USDC_WETH: Fees.MEDIUM,
        USDC_USDT: Fees.LOW,
        USDC_DAI: Fees.LOW,
  
        USDT_WETH: Fees.MEDIUM,
        USDT_USDC: Fees.LOW,
        USDT_DAI: Fees.MEDIUM,
  
        DAI_WETH: Fees.LOW,
        DAI_USDC: Fees.LOW,
        DAI_USDT: Fees.MEDIUM,

    },
  
    ethereum: {
                  
        WETH_USDC: Fees.LOW,
        WETH_USDT: Fees.MEDIUM,
        WETH_DAI: Fees.MEDIUM,
  
        USDC_WETH: Fees.LOW,
        USDC_USDT: Fees.LOW,
        USDC_DAI: Fees.VERY_LOW,
  
        USDT_WETH: Fees.MEDIUM,
        USDT_USDC: Fees.LOW,
        USDT_DAI: Fees.VERY_LOW,
  
        DAI_WETH: Fees.MEDIUM,
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

    ethereumTestnet: {
                          
        WETH_USDC: Fees.LOW,
        WETH_USDT: Fees.MEDIUM,
        WETH_DAI: Fees.MEDIUM,
  
        USDC_WETH: Fees.LOW,
        USDC_USDT: Fees.LOW,
        USDC_DAI: Fees.VERY_LOW,
  
        USDT_WETH: Fees.MEDIUM,
        USDT_USDC: Fees.LOW,
        USDT_DAI: Fees.VERY_LOW,
  
        DAI_WETH: Fees.MEDIUM,
        DAI_USDC: Fees.VERY_LOW,
        DAI_USDT: Fees.VERY_LOW,

    },

    polygonTestnet: {

        WMATIC_WETH: Fees.MEDIUM,
        WMATIC_USDC: Fees.LOW,
        WMATIC_USDT: Fees.LOW,
        WMATIC_DAI: Fees.MEDIUM,
  
        WETH_WMATIC: Fees.MEDIUM,
        WETH_USDC: Fees.LOW,
        WETH_USDT: Fees.MEDIUM,
        WETH_DAI: Fees.MEDIUM,
  
        USDC_WMATIC: Fees.LOW,
        USDC_WETH: Fees.LOW,
        USDC_USDT: Fees.VERY_LOW,
        USDC_DAI: Fees.VERY_LOW,
  
        USDT_WMATIC: Fees.LOW,
        USDT_WETH: Fees.MEDIUM,
        USDT_USDC: Fees.VERY_LOW,
        USDT_DAI: Fees.VERY_LOW,
  
        DAI_WMATIC: Fees.MEDIUM,
        DAI_WETH: Fees.MEDIUM,
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
    
    optimismTestnet: {
                  
        WETH_USDC: Fees.MEDIUM,
        WETH_USDT: Fees.MEDIUM,
        WETH_DAI: Fees.LOW,
  
        USDC_WETH: Fees.MEDIUM,
        USDC_USDT: Fees.LOW,
        USDC_DAI: Fees.LOW,
  
        USDT_WETH: Fees.MEDIUM,
        USDT_USDC: Fees.LOW,
        USDT_DAI: Fees.MEDIUM,
  
        DAI_WETH: Fees.LOW,
        DAI_USDC: Fees.LOW,
        DAI_USDT: Fees.MEDIUM,

    },
}