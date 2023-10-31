import swap_abi from "./abis/swap"
import pool_abi from "./abis/pool"
import erc20_abi from "./abis/erc20"
import quoter_abi from "./abis/quoter"
import factory_abi from "./abis/factory"
import { SwapOptions, TradeType } from "../types/swap"
import liquidity_manager_abi from "./abis/liquidityManager"
import { Chains, ChainConfig, RemoveOptions, AddOptions } from "../types"





// ABIS
export const ERC20_ABI = erc20_abi
export const SWAP_ABI = swap_abi
export const POOL_ABI = pool_abi
export const FACTORY_ABI = factory_abi
export const QUOTER_ABI = quoter_abi
export const LIQUIDITY_MANAGER_ABI = liquidity_manager_abi





// CONTRACTS
export const CONTRACTS: ChainConfig = {

    bsc: {
      factory: "0x93BB94a0d5269cb437A1F71FF3a77AB753844422",
      swapX2YModule: "0x759424DD2d409b4d6B39A83199177d07dc257ad7",
      swapY2XModule: "0xb922af73b899a4F0B9761b0c4407F1250FdD05be",
      liquidityModule: "0x1eaa949444F5a4BeE40D25d31039ECDDda0EEb19",
      limitOrderModule: "0x2e2AbBFB7913669B930A4Ecfe130863c524A8810",
      flashModule: "0x20804C62079569E1491fa948db005f93FA9a383d",
      periphery: {
        quoterWithoutLimit: "0x0e79C263EeBc37977038F26fb86Dfa84636cFE84",
        quoterWith10000Ticks: "0xDCe9a4ACC59E69ECcC0cdA2E82fe601fdB726542",
        swap: "0xedf2021f41AbCfE2dEA4427E1B61f4d0AA5aA4b8",
        liquidityManager: "0xBF55ef05412f1528DbD96ED9E7181f87d8C9F453",
        limitOrderManager: "0x72fAfc28bFf27BB7a5cf70585CA1A5185AD2f201",
        box: "0x7cbF7b96a7069bA384E10Ccb4F556DEBaB9c89F0",
      },
    },

    aurora: {
      factory: "0xce326A82913EAb09f7ec899C4508Cbe0E6526A74",
      swapX2YModule: "0xA7B45d3546b736B04cf80aa5Dd10d46c38E83068",
      swapY2XModule: "0x731C540Ad98564a6E3dC387F783475609721d0C3",
      liquidityModule: "0x9e0E3D5c0c1D554e05Fd7BDb5EA1513108e88414",
      limitOrderModule: "0xF3409631f87B0bC9bD6e9D9FD26D31BaDAA21880",
      flashModule: "0x41BE134611a6039aeA79029050f164bC50a6e597",
      periphery: {
        quoterWithoutLimit: "0xF2bd6078D51576B5c8d7e80AF3C4E2292e916985",
        quoterWith10000Ticks: "0x5f6AF64f2FE0AE00D20932B6698aaB89AFb847eB",
        swap: "0xEB9668316Cb87Bd107b05C52455ed31577eA82Cc",
        liquidityManager: "0x61A41182CD6e94f2A026aE3c0D1b73B1AA579aEa",
        limitOrderManager: "0x05dCaF89dFA5A09d832aC4e7FE01f75e82643F60",
        box: "0x759424DD2d409b4d6B39A83199177d07dc257ad7",
      },
    },

    arbitrum: {
      factory: "0xCFD8A067e1fa03474e79Be646c5f6b6A27847399",
      swapX2YModule: "0xAC9788cfea201950dB91d7db6F28C448CF3A4B29",
      swapY2XModule: "0x93C22Fbeff4448F2fb6e432579b0638838Ff9581",
      liquidityModule: "0x9Bf8399c9f5b777cbA2052F83E213ff59e51612B",
      limitOrderModule: "0x12a76434182c8cAF7856CE1410cD8abfC5e2639F",
      flashModule: "0xBd3bd95529e0784aD973FD14928eEDF3678cfad8",
      periphery: {
        quoterWithoutLimit: "0x96539F87cA176c9f6180d65Bc4c10fca264aE4A5",
        quoterWith10000Ticks: "0x64b005eD986ed5D6aeD7125F49e61083c46b8F191",
        swap: "0xA8bCc8D2DD84ca74482420ab0Ae966B8D50DbF2E",
        liquidityManager: "0x59bb049DAffce8201023ceCdd5D9c35c9270a238",
        limitOrderManager: "0x8a36d4A793D40D4DB287ACD6d91492bF313A4b37",
        box: "0x209988f2F18eC13b8E5735F55E0599BD3c19e898",
      },
    },

    polygon: {
      factory: '0xcA7e21764CD8f7c1Ec40e651E25Da68AeD096037',
      swapX2YModule: '0x77aB297Da4f3667059ef0C32F5bc657f1006cBB0',
      swapY2XModule: '0x6a7CDD0CC87ec02ed85c196e57BaBe1bc0Acd6f2',
      liquidityModule: '0x4a41EbEa62E7aB70413356D30DF73cA803aaE41c',
      limitOrderModule: '0x45e5F26451CDB01B0fA1f8582E0aAD9A6F27C218',
      flashModule: '0x611575eE1fbd4F7915D0eABCC518eD396fF78F0c',
      periphery: {
        quoterWithoutLimit: '0xe6805638db944eA605e774e72c6F0D15Fb6a1347',
        quoterWith10000Ticks: '0xe4A0b241D8345d86FB140D40c87C5fbDd685B9dd',
        swap: '0x032b241De86a8660f1Ae0691a4760B426EA246d7',
        liquidityManager: '0x1CB60033F61e4fc171c963f0d2d3F63Ece24319c',
        limitOrderManager: '0x25C030116Feb2E7BbA054b9de0915E5F51b03e31',
      }
    },

    meter: {
      factory: '0xed31C5a9C764761C3A699E2732183ba5d6EAcC35',
      swapX2YModule: '0x2D7C302A10563dC4Dbb311401e1293C179db4386',
      swapY2XModule: '0x990A3A1dc2F643EB57dFf649d4E6122901cd96d0',
      liquidityModule: '0x381169C670b5DA2C6F82e33fDf6B96627F0fcfEA',
      limitOrderModule: '0x071479bb55290dda974f9E87fdD2Af252ac27BcD',
      flashModule: '0x56DAdA19632a80952383168E56fdBfbFBCfDaB82',
      periphery: {
        quoterWithoutLimit: '0x72F51b617A9c48EbaDF997586C5C6472c08775A3',
        quoterWith10000Ticks: '0x85a3871CA57637860b5d35E983341c92aE07Ed5C',
        swap: '0x90bd53037B504fB83687Ea153F9657D3BD989976',
        liquidityManager: '0x579ffe4A5c8CB2C969aE4E65039B7dBb6951d164',
        limitOrderManager: '0x35Dcc4e1ae93DA1316b603f0A9Fe3aD1b85C38C6',
      }
    },

    zksync: {
      factory: '0x575Bfc57B0D3eA0d31b132D622643e71735A6957',
      swapX2YModule: '0x65adD4267b7D1C342a943c7C1dA9D81d41A47293',
      swapY2XModule: '0x359BBb3b49b3bad5282502Df799aEEF6D9622b63',
      liquidityModule: '0x894dFD50c3e55b31f13b0497654737132675B33C',
      limitOrderModule: '0x6d7661E0E51e3E460B26De4021e0BEF4a2B0Ebf5',
      flashModule: '0x6B76e4EB16e61253F708F5b5406647da9019a763',
      periphery: {
        quoterWithoutLimit: '0x30C089574551516e5F1169C32C6D429C92bf3CD7',
        quoterWith10000Ticks: '0x1a447a8Ec35B8120549C6567fC6FCC0768b318C2',
        swap: '0x943ac2310D9BC703d6AB5e5e76876e212100f894',
        liquidityManager: '0x483FDE31bcE3DCc168E23a870831b50Ce2cCd1F1',
        limitOrderManager: '0xe36caa16D78eF3233848a542D437C1c540Ca8149',
        box: '0xb498C54F8F73969841C2cBce6FD550b82eBbcB63',
      },
    },

    ontology: {
      factory: '0x032b241De86a8660f1Ae0691a4760B426EA246d7',
      swapX2YModule: '0x611575eE1fbd4F7915D0eABCC518eD396fF78F0c',
      swapY2XModule: '0xcA7e21764CD8f7c1Ec40e651E25Da68AeD096037',
      liquidityModule: '0x1CB60033F61e4fc171c963f0d2d3F63Ece24319c',
      limitOrderModule: '0x25C030116Feb2E7BbA054b9de0915E5F51b03e31',
      flashModule: '0x1D377311b342633A970e71a787C50F83858BFC1B',
      periphery: {
        quoterWithoutLimit: '0x93C22Fbeff4448F2fb6e432579b0638838Ff9581',
        quoterWith10000Ticks: '0x9Bf8399c9f5b777cbA2052F83E213ff59e51612B',
        swap: '0xAC9788cfea201950dB91d7db6F28C448CF3A4B29',
        liquidityManager: '0x344ADD21b136B09051fb061881eC7971c92cE7f7',
        limitOrderManager: '0x79D175eF5fBe31b5D84B3ee359fcbBB466153E39',
      },
    },

    mantle: {
      factory: '0x45e5F26451CDB01B0fA1f8582E0aAD9A6F27C218',
      swapX2YModule: '0x88867BF3bB3321d8c7Da71a8eAb70680037068E4',
      swapY2XModule: '0xB8dDAfE7385A962a4515821248368823E93fa61F',
      liquidityModule: '0x77aB297Da4f3667059ef0C32F5bc657f1006cBB0',
      limitOrderModule: '0x6a7CDD0CC87ec02ed85c196e57BaBe1bc0Acd6f2',
      flashModule: '0x4a41EbEa62E7aB70413356D30DF73cA803aaE41c',
      periphery: {
        quoterWithoutLimit: '0x032b241De86a8660f1Ae0691a4760B426EA246d7',
        quoterWith10000Ticks: '0xe6805638db944eA605e774e72c6F0D15Fb6a1347',
        swap: '0x25C030116Feb2E7BbA054b9de0915E5F51b03e31',
        liquidityManager: '0x611575eE1fbd4F7915D0eABCC518eD396fF78F0c',
        limitOrderManager: '0xcA7e21764CD8f7c1Ec40e651E25Da68AeD096037',
        box: '0x3a2932a74e511C9Dc4CaD60e06eE6D3690Ce2492',
      },
    },

    linea: {
      factory: '0x45e5F26451CDB01B0fA1f8582E0aAD9A6F27C218',
      swapX2YModule: '0x88867BF3bB3321d8c7Da71a8eAb70680037068E4',
      swapY2XModule: '0xB8dDAfE7385A962a4515821248368823E93fa61F',
      liquidityModule: '0x77aB297Da4f3667059ef0C32F5bc657f1006cBB0',
      limitOrderModule: '0x6a7CDD0CC87ec02ed85c196e57BaBe1bc0Acd6f2',
      flashModule: '0x4a41EbEa62E7aB70413356D30DF73cA803aaE41c',
      periphery: {
        quoterWithoutLimit: '0xe6805638db944eA605e774e72c6F0D15Fb6a1347',
        quoterWith10000Ticks: '0xe4A0b241D8345d86FB140D40c87C5fbDd685B9dd',
        swap: '0x032b241De86a8660f1Ae0691a4760B426EA246d7',
        liquidityManager: '0x1CB60033F61e4fc171c963f0d2d3F63Ece24319c',
        limitOrderManager: '0x25C030116Feb2E7BbA054b9de0915E5F51b03e31',
        box: '0x19647d5f84308EE780cC5E3Da6E4aEe8e12B0ED4',
      },
    },

    ethereumClassic: {
      factory: '0x79D175eF5fBe31b5D84B3ee359fcbBB466153E39',
      swapX2YModule: '0x19647d5f84308EE780cC5E3Da6E4aEe8e12B0ED4',
      swapY2XModule: '0x77C2C2eCe8F323abB6753b85D6b71C82039BFb17',
      liquidityModule: '0xBf8F8Ef2d2a534773c61682Ea7cF5323a324B188',
      limitOrderModule: '0xF42C48f971bDaA130573039B6c940212EeAb8496',
      flashModule: '0x344ADD21b136B09051fb061881eC7971c92cE7f7',
      periphery: {
        quoterWithoutLimit: '0x12a76434182c8cAF7856CE1410cD8abfC5e2639F',
        quoterWith10000Ticks: '0xBd3bd95529e0784aD973FD14928eEDF3678cfad8',
        swap: '0x9Bf8399c9f5b777cbA2052F83E213ff59e51612B',
        liquidityManager: '0xd7de110Bd452AAB96608ac3750c3730A17993DE0',
        limitOrderManager: '0xAC9788cfea201950dB91d7db6F28C448CF3A4B29',
      },
    },

    base: {
      factory: '0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08',
      swapX2YModule: '0x4d4673745AAC664eFB9758fdd571F40d78a87bfe',
      swapY2XModule: '0x32D02Fc7722E81F6Ac60B87ea8B4b63a52Ad2b55',
      liquidityModule: '0xF4efDB5A1E852f78e807fAE7100B1d38351e38c7',
      limitOrderModule: '0xe96526e92ee57bBD468DA1721987aa988b008768',
      flashModule: '0xbD6abA1Ef82A4cD6e15CB05e95f433ef48dfb5df',
      periphery: {
        quoterWithoutLimit: '0x2db0AFD0045F3518c77eC6591a542e326Befd3D7',
        quoterWith10000Ticks: '0x3EF68D3f7664b2805D4E88381b64868a56f88bC4',
        swap: '0x02F55D53DcE23B4AA962CC68b0f685f26143Bdb2',
        liquidityManager: '0x110dE362cc436D7f54210f96b8C7652C2617887D',
        limitOrderManager: '0x1502d025BfA624469892289D45C0352997251728',
      },
    },

    opbnb: {
      factory: '0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08',
      swapX2YModule: '0x4d4673745AAC664eFB9758fdd571F40d78a87bfe',
      swapY2XModule: '0x32D02Fc7722E81F6Ac60B87ea8B4b63a52Ad2b55',
      liquidityModule: '0xF4efDB5A1E852f78e807fAE7100B1d38351e38c7',
      limitOrderModule: '0xe96526e92ee57bBD468DA1721987aa988b008768',
      flashModule: '0xbD6abA1Ef82A4cD6e15CB05e95f433ef48dfb5df',
      periphery: {
        quoterWithoutLimit: '0x2db0AFD0045F3518c77eC6591a542e326Befd3D7',
        quoterWith10000Ticks: '0x3EF68D3f7664b2805D4E88381b64868a56f88bC4',
        swap: '0x02F55D53DcE23B4AA962CC68b0f685f26143Bdb2',
        liquidityManager: '0x110dE362cc436D7f54210f96b8C7652C2617887D',
        limitOrderManager: '0x1502d025BfA624469892289D45C0352997251728',
      },
    },

    kroma: {
      factory: '0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08',
      swapX2YModule: '0x4d4673745AAC664eFB9758fdd571F40d78a87bfe',
      swapY2XModule: '0x32D02Fc7722E81F6Ac60B87ea8B4b63a52Ad2b55',
      liquidityModule: '0xF4efDB5A1E852f78e807fAE7100B1d38351e38c7',
      limitOrderModule: '0xe96526e92ee57bBD468DA1721987aa988b008768',
      flashModule: '0xbD6abA1Ef82A4cD6e15CB05e95f433ef48dfb5df',
      periphery: {
        quoterWithoutLimit: '0x2db0AFD0045F3518c77eC6591a542e326Befd3D7',
        quoterWith10000Ticks: '0x3EF68D3f7664b2805D4E88381b64868a56f88bC4',
        swap: '0x02F55D53DcE23B4AA962CC68b0f685f26143Bdb2',
        liquidityManager: '0x110dE362cc436D7f54210f96b8C7652C2617887D',
        limitOrderManager: '0x1502d025BfA624469892289D45C0352997251728',
      },
    },
    
    manta: {
      factory: '0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08',
      swapX2YModule: '0x4d4673745AAC664eFB9758fdd571F40d78a87bfe',
      swapY2XModule: '0x32D02Fc7722E81F6Ac60B87ea8B4b63a52Ad2b55',
      liquidityModule: '0xF4efDB5A1E852f78e807fAE7100B1d38351e38c7',
      limitOrderModule: '0xe96526e92ee57bBD468DA1721987aa988b008768',
      flashModule: '0xbD6abA1Ef82A4cD6e15CB05e95f433ef48dfb5df',
      periphery: {
        quoterWithoutLimit: '0x33531bDBFE34fa6Fd5963D0423f7699775AacaaF',
        quoterWith10000Ticks: '0x34bc1b87f60e0a30c0e24FD7Abada70436c71406',
        swap: '0x3EF68D3f7664b2805D4E88381b64868a56f88bC4',
        liquidityManager: '0x19b683A2F45012318d9B2aE1280d68d3eC54D663',
        limitOrderManager: '0x02F55D53DcE23B4AA962CC68b0f685f26143Bdb2',
      },
    },

    scroll: {
      factory: '0x8c7d3063579BdB0b90997e18A770eaE32E1eBb08',
      swapX2YModule: '0x4d4673745AAC664eFB9758fdd571F40d78a87bfe',
      swapY2XModule: '0x32D02Fc7722E81F6Ac60B87ea8B4b63a52Ad2b55',
      liquidityModule: '0xF4efDB5A1E852f78e807fAE7100B1d38351e38c7',
      limitOrderModule: '0xe96526e92ee57bBD468DA1721987aa988b008768',
      flashModule: '0xbD6abA1Ef82A4cD6e15CB05e95f433ef48dfb5df',
      periphery: {
        quoterWithoutLimit: '0x3EF68D3f7664b2805D4E88381b64868a56f88bC4',
        quoterWith10000Ticks: '0x33531bDBFE34fa6Fd5963D0423f7699775AacaaF',
        swap: '0x2db0AFD0045F3518c77eC6591a542e326Befd3D7',
        liquidityManager: '0x1502d025BfA624469892289D45C0352997251728',
        limitOrderManager: '0x19b683A2F45012318d9B2aE1280d68d3eC54D663',
      },
    },

    bscTestnet: {
      factory: "0x7fc0574eAe768B109EF38BC32665e6421c52Ee9d",
      swapX2YModule: "0xf6991b783FAbC33Cc7E735Bafd81ac087e08f564",
      swapY2XModule: "0x6E58130919Bb63AA8B5B3Bd673093C1651b9fE95",
      liquidityModule: "0x1D923fC2804D554beD70a1297170A2C8624E833a",
      limitOrderModule: "0xA00D1B745955Cb4e26eAC1287a5DbDdC6b364cd3",
      flashModule: "0x6b89A2e3a0E6F403A3Fc6159a71172C150Fff2D1",
      periphery: {
        quoterWithoutLimit: "0xa3d7d6746F91B6657cfFe0A7b4031EE6C262008E",
        quoterWith10000Ticks: "0x4bCACcF9A0FC3246449AC8A42A8918F2349Ed543",
        swap: "0x4bD007912911f3Ee4b4555352b556B08601cE7Ce",
        liquidityManager: "0xDE02C26c46AC441951951C97c8462cD85b3A124c",
        limitOrderManager: "0x5C97187B2CEb1494078b70623c1E59edA79983A3",
        box: "0x8fbA4265785c56110B1277d6B23dD43B3797b3A8",
      },
    },

    zksyncTestnet: {
      factory: "0x7FD55801c066AeB0bD848c2BA8AEc821AF700A41",
      swapX2YModule: "0x19ed8bB72F93B87A0605fAcc116019039757e95A",
      swapY2XModule: "0x4A7Df45560899606f1fa5aE7475816ecBbf66A68",
      liquidityModule: "0x38D526f278189Cb6983Cf8bc58BBFAea7D2c3B22",
      limitOrderModule: "0x47798d598891708ceD5Bd425b9bf3C56AfA473F0",
      flashModule: "0x1a3CC65Fe937C7dDd110cB65b281D7075766CA02",
      periphery: {
        quoterWithoutLimit: "0xE93D1d35a63f7C6b51ef46a27434375761a7Db28",
        quoterWith10000Ticks: "0xA8101060508f3A7fB9a98425a7fb765DB14ae224",
        swap: "0x3040EE148D09e5B92956a64CDC78b49f48C0cDdc",
        liquidityManager: "0x25727b360604E1e6B440c3B25aF368F54fc580B6",
        limitOrderManager: "0x430972C4AF4703F7ce7B95C03735ae1504dD0Dd6",
      },
    },

    scrollTestnet: {
      factory: "0x64c2F1306b4ED3183E7B345158fd01c19C0d8c5E",
      swapX2YModule: "0xED9b4E3ED8fe7e820B950F28f939AF848f98e995",
      swapY2XModule: "0x706A11AF5bb5C2a50aB9802503ddbfF69373D1bd",
      liquidityModule: "0x817EC83Fb6906ba0777E89110d5089313385F4A2",
      limitOrderModule: "0xAF931D7AaB9643d1E63Ed2E1fB17911c65e09678",
      flashModule: "0x29b66280F0Ea5F5DfbD7C94D560FC060575360cd",
      periphery: {
        quoterWithoutLimit: "0xa9754f0D9055d14EB0D2d196E4C51d8B2Ee6f4d3",
        quoterWith10000Ticks: "0xF6FFe4f3FdC8BBb7F70FFD48e61f17D1e343dDfD",
        swap: "0x77132b63429718Db2B6ad8D942eE13A198f6Ab49",
        liquidityManager: "0x67A1f4A939b477A6b7c5BF94D97E45dE87E608eF",
        limitOrderManager: "0xC6C7c2edF70A3245ad6051E93809162B9758ce08",
        tapProxy: "0x95c5F14106ab4d1dc0cFC9326225287c18c2d247",
      },
    },

    mantleTestnet: {
      factory: "0xF7713d221418e098a788C4DaDd52F74b55B379E5",
      swapX2YModule: "0xfc49751C99bE41792f17071862eeb248EE3a3eB8",
      swapY2XModule: "0x9b2EB4C79dBe8556389364F884Abd7b51De1121c",
      liquidityModule: "0x44bDE35bc4eB41339E9c2Ec8B2B4B92FB684Da8E",
      limitOrderModule: "0x2A19e0CF8c73280CdDdFd5877AA64A9690AE6d47",
      flashModule: "0x069F50fcF55d96Fd95AE36b8E7DF44Db0dc426de",
      periphery: {
        quoterWithoutLimit: "0x6Cfc083bEFCFa41Dc36e33549F25429725B11A61",
        quoterWith10000Ticks: "0xd06D1eeDbD9c64971DC946F466c56f020CDE6540",
        swap: "0xae3272690D0db0199535EAec1C880283d4baD0cC",
        liquidityManager: "0x879cd319b8aa506F4130acf766fA8E3654eD249B",
        limitOrderManager: "0x4aAD4b81f886b12A29B68f9C8A7949d7d81Fe887",
        box: "0x5617675423Ac3C73081a3e331F5f135A948606D7",
        tapProxy: "0x0953C6771cD8eE5421dE0CE1F11BEC559EBCF9d6",
      },
    },
    
    lineaTestnet: {
      factory: "0x64c2F1306b4ED3183E7B345158fd01c19C0d8c5E",
      swapX2YModule: "0xED9b4E3ED8fe7e820B950F28f939AF848f98e995",
      swapY2XModule: "0x706A11AF5bb5C2a50aB9802503ddbfF69373D1bd",
      liquidityModule: "0x817EC83Fb6906ba0777E89110d5089313385F4A2",
      limitOrderModule: "0xAF931D7AaB9643d1E63Ed2E1fB17911c65e09678",
      flashModule: "0x29b66280F0Ea5F5DfbD7C94D560FC060575360cd",
      periphery: {
        quoterWithoutLimit: "0xF6FFe4f3FdC8BBb7F70FFD48e61f17D1e343dDfD",
        quoterWith10000Ticks: "0x95c5F14106ab4d1dc0cFC9326225287c18c2d247",
        swap: "0xa9754f0D9055d14EB0D2d196E4C51d8B2Ee6f4d3",
        liquidityManager: "0xC6C7c2edF70A3245ad6051E93809162B9758ce08",
        limitOrderManager: "0x1eE5eDC5Fe498a2dD82862746D674DB2a5e7fef6",
        box: "0x4d140E612e476A6ba54EF1306b2bA398a5dEff09",
        tapProxy: "0xEB122DE19FeA9eD039E2d087113db26017f5F91a",
      },
    }
}





// TOKENS
export const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const TOKENS: { [key in Chains]: any } = {

  zksync: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
    usdc:'0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
    dai: undefined,
    wbtc:'0xBBeB516fb02a01611cBBE0453Fe3c580D7281011',
    usdt:'0x59ac51Cfb025adCE007D1EC96A21f7c7e3f32330',
  },

  polygon: {
    matic: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    usdc:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    dai:'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    usdt:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },

  arbitrum: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    usdc:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    dai:'0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    usdt:'0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },

  bsc: {
    bnb: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    weth: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    dai: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    usdt: '0x55d398326f99059fF775485246999027B3197955',
  },

  aurora: {},
  meter: {},
  ontology: {},
  mantle: {},
  linea: {},
  ethereumClassic: {},
  base: {},
  opbnb: {},
  kroma: {},
  manta: {},
  scroll: {},

  bscTestnet: {
    bnb: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    weth: undefined,
    usdc: undefined,
    usdt:'0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    dai: undefined,
  },

  zksyncTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: '0x8C3e3f2983DB650727F3e05B7a7773e4D641537B',
    dai: '0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b',
    usdc: '0x0faF6df7054946141266420b43783387A78d82A9', 
    usdt: '0xfcEd12dEbc831D3a84931c63687C395837D42c2B', 
  },

  scrollTestnet: {},
  mantleTestnet: {},
  lineaTestnet: {}

}





// MISC
export const MAX_TICK = 887272
export const MIN_TICK = -887272
export const MAX_UINT128 = "0xffffffffffffffffffffffffffffffff";

export const DEFAULT_SWAP_OPTION: SwapOptions = {
  tradeType: TradeType.EXACT_INPUT,
  max: false,
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
}

export const DEFAULT_ADD_OPTION: AddOptions = {
  max: false,
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
}

export const DEFAULT_REMOVE_OPTION: RemoveOptions = {
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
  percent: 100,
}





// CHAINS
export const CHAIN_ID: { [ key in Chains ]: number } = {

  'bsc': 56,
  'aurora': 1313161554,
  'arbitrum': 42161,
  'polygon': 137,
  'meter': 82,
  'zksync': 324,
  'ontology': 58,
  'mantle': 5000,
  'linea': 59144,
  'ethereumClassic': 61,
  'base': 8453,
  'opbnb': 204,
  'kroma': 255,
  'manta': 169,
  'scroll': 169,
  'bscTestnet': 97,
  'zksyncTestnet': 280,
  'scrollTestnet': 534351,
  'mantleTestnet': 5001,
  'lineaTestnet': 59140

}

export const CHAIN_ID_TO_NAME: { [ key: number ]: Chains } = {

  56: 'bsc',
  1313161554: 'aurora',
  42161: 'arbitrum',
  137: 'polygon',
  82: 'meter',
  324: 'zksync',
  58: 'ontology',
  5000: 'mantle',
  59144: 'linea',
  61: 'ethereumClassic',
  8453: 'base',
  204: 'opbnb',
  255: 'kroma',
  169: 'manta',
  169.1: 'scroll',
  97: 'bscTestnet',
  280: 'zksyncTestnet',
  534351: 'scrollTestnet',
  5001: 'mantleTestnet',
  59140: 'lineaTestnet',

}