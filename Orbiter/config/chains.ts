export const ethereum_chain = {
      name: 'ethereum',
      orbiterId: 1,
      chainId: 1,
      shortName: 'eth',
      networkId: 1,
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpc: [
        'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
        'wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}',
        'https://api.mycryptoapi.com/eth',
        'https://cloudflare-eth.com',
      ],
      faucets: [],
      explorers: [],
      infoURL: 'https://etherscan.io/',
}

export const rinkeby_chain = {
      name: 'rinkeby',
      orbiterId: 5,
      chainId: 4,
      shortName: 'rin',
      networkId: 4,
      nativeCurrency: {
        name: 'Rinkeby Ether',
        symbol: 'RIN',
        decimals: 18,
      },
      rpc: [
        'https://rinkeby.infura.io/v3/${INFURA_API_KEY}',
        'wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}',
      ],
      faucets: ['https://faucet.rinkeby.io'],
      explorers: [],
      infoURL: 'https://rinkeby.etherscan.io/',
}

export const ropsten_chain = {
      name: 'ropsten',
      orbiterId: 88,
      chainId: 3,
      shortName: 'rop',
      networkId: 3,
      nativeCurrency: {
        name: 'Ropsten Ether',
        symbol: 'ROP',
        decimals: 18,
      },
      rpc: [
        'https://ropsten.infura.io/v3/${INFURA_API_KEY}',
        'wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}',
      ],
      faucets: ['https://faucet.ropsten.be?${ADDRESS}'],
      explorers: [],
      infoURL: 'https://ropsten.etherscan.io/',
}

export const goerli_chain = {
      name: 'goerli',
      orbiterId: 0,
      chainId: 5,
      shortName: 'gor',
      networkId: 5,
      nativeCurrency: {
        name: 'Görli Ether',
        symbol: 'GOR',
        decimals: 18,
      },
      rpc: [
        'https://rpc.goerli.mudit.blog/',
        'https://rpc.slock.it/goerli ',
        'https://goerli.prylabs.net/',
      ],
      faucets: [
        'https://goerli-faucet.slock.it/?address=${ADDRESS}',
        'https://faucet.goerli.mudit.blog',
      ],
      explorers: [],
      infoURL: 'https://goerli.net/#about',
}

export const arbitrum_chain = {
      name: 'arbitrum',
      orbiterId: 2,
      chainId: 42161,
      shortName: 'arb1',
      networkId: 42161,
      nativeCurrency: {
        name: 'Ether',
        symbol: 'AETH',
        decimals: 18,
      },
      rpc: [
        'https://endpoints.omniatech.io/v1/arbitrum/one/public',
        'https://mainnet.infura.io/v3/${INFURA_API_KEY}',
        'https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}',
        'https://arb1.arbitrum.io/rpc',
      ],
      faucets: [],
      explorers: [],
      infoURL: 'https://arbiscan.io/',
}

export const arbitrum_goerli_chain = {
      name: 'arbitrum-testnet',
      orbiterId: 22,
      chainId: 421613,
      shortName: "arb-goerli",
      networkId: 421613,
      nativeCurrency: {
        "name": "Arbitrum Görli Ether",
        "symbol": "AGOR",
        "decimals": 18
      },
      rpc: [
        "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
        "https://goerli-rollup.arbitrum.io/rpc/",
    ],
      faucets: [],
      explorers: [],
      infoURL: 'https://arbitrum.io/',
}

export const polygon_chain = {
      name: 'polygon',
      orbiterId: 6,
      chainId: 137,
      shortName: 'matic',
      networkId: 137,
      nativeCurrency: {
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpc: [
        'https://endpoints.omniatech.io/v1/matic/mainnet/public',
        'https://rpc-mainnet.matic.network',
        'https://rpc-mainnet.matic.quiknode.pro',
        'https://matic-mainnet.chainstacklabs.com',
      ],
      faucets: [],
      explorers: [],
      infoURL: 'https://matic.network/',
}

export const mumbai_chain = {
      name: 'mumbai',
      orbiterId: 66,
      chainId: 80001,
      shortName: 'maticmum',
      networkId: 80001,
      nativeCurrency: {
        name: 'Matic',
        symbol: 'tMATIC',
        decimals: 18,
      },
      rpc: [
        'https://polygon-testnet.public.blastapi.io', 
        'https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}',
        'https://rpc-mumbai.matic.today', 
    ],
      faucets: ['https://faucet.matic.network/'],
      explorers: [],
      infoURL: 'https://matic.network/',
}
export const optimism_chain = {
      name: 'optimism',
      orbiterId: 7,
      chainId: 10,
      shortName: 'oeth',
      networkId: 10,
      nativeCurrency: {
        name: 'Ether',
        symbol: 'OETH',
        decimals: 18,
      },
      rpc: ['https://mainnet.optimism.io/'],
      faucets: [],
      explorers: [],
      infoURL: 'https://optimistic.etherscan.io/',
}
export const optimism_kovan_chain = {
      name: 'optimism(K)',
      orbiterId: 77,
      chainId: 69,
      shortName: 'okov',
      networkId: 69,
      nativeCurrency: {
        name: 'Kovan Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpc: ['https://kovan.optimism.io/'],
      faucets: [],
      explorers: [],
      infoURL: 'https://kovan-optimistic.etherscan.io/',
}
export const metis = {
      name: 'Metis',
      orbiterId: 10,
      chainId: 1088,
      shortName: 'andromeda-metis',
      networkId: 1088,
      nativeCurrency: {
        name: 'METIS',
        symbol: 'METIS',
        decimals: 18,
      },
      rpc: ['https://andromeda.metis.io/?owner=1088'],
      faucets: [],
      explorers: [],
      infoURL: 'https://andromeda-explorer.metis.io',
}
export const metis_testnet_chain = {
      name: 'metis(R)',
      orbiterId: 510,
      chainId: 588,
      shortName: 'stardust-metis',
      networkId: 588,
      nativeCurrency: {
        name: 'METIS',
        symbol: 'tMETIS',
        decimals: 18,
      },
  
      rpc: ['https://stardust.metis.io/?owner=588', 'wss://stardust-ws.metis.io/'],
      faucets: [],
      explorers: [],
      infoURL: 'https://stardust-explorer.metis.io',
}
export const bsc_chain = {
      name: 'binance Smart Chain Mainnet',
      orbiterId: 15,
      chainId: 56,
      networkId: 56,
      shortName: 'bnb',
      nativeCurrency: {
        "name": "Binance Chain Native Token",
        "symbol": "BNB",
        "decimals": 18
      },
      rpc: [
        "https://bsc-dataseed1.binance.org",
        "https://bsc-dataseed2.binance.org",
        "https://bsc-dataseed3.binance.org",
        "https://bsc-dataseed4.binance.org",
        "https://bsc-dataseed1.defibit.io",
        "https://bsc-dataseed2.defibit.io",
        "https://bsc-dataseed3.defibit.io",
        "https://bsc-dataseed4.defibit.io",
        "https://bsc-dataseed1.ninicoin.io",
        "https://bsc-dataseed2.ninicoin.io",
        "https://bsc-dataseed3.ninicoin.io",
        "https://bsc-dataseed4.ninicoin.io",
        "wss://bsc-ws-node.nariox.org"
      ],
      faucets: [],
      explorers: [],
      infoURL: 'https://www.binance.org',
}
export const bsc_testnet_chain = {
      name: "binance Smart Chain Testnet",
      orbiterId: 515,
      chainId: 97,
      networkId: 97,
      shortName: 'bnbt',
      nativeCurrency: {
        "name": "Binance Chain Native Token",
        "symbol": "tBNB",
        "decimals": 18
      },
      rpc: [
        "https://data-seed-prebsc-1-s1.binance.org:8545",
        "https://data-seed-prebsc-2-s1.binance.org:8545",
        "https://data-seed-prebsc-1-s2.binance.org:8545",
        "https://data-seed-prebsc-2-s2.binance.org:8545",
        "https://data-seed-prebsc-1-s3.binance.org:8545",
        "https://data-seed-prebsc-2-s3.binance.org:8545"
      ],
      faucets: [],
      explorers: [],
      infoURL: 'https://www.binance.org',
}
export const arbitrum_nova_chain = {
      name: "arbitrum Nova",
      orbiterId: 16,
      chainId: 42170,
      networkId: 42170,
      shortName: 'Ether',
      nativeCurrency: {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18
      },
      rpc:["https://nova.arbitrum.io/rpc"],
      faucets: [],
      explorers: [],
      infoURL: "https://arbitrum.io",
}
