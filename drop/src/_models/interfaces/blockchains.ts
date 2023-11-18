// export interface Chains {
//     arbitrum: "arbitrum";
//     arbitrumTestnet: "arbitrumTestnet";
//     bsc: "bsc";
//     ethereum: "ethereum";
//     optimism: "optimism";
//     polygon: "polygon";
//     polygonTestnet: "polygonTestnet";
//   }

  export interface Blockchain {
    chainId: number;
    gasToken: string;
    name: string;
    rpc: string;
    tokens: string[];
    type: string;
}

export interface TokenPrices {
  [key: string]: string;
}