# jonathan
Jonathan's code

# Stargate  
![Stargate](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi2m_v63Hhte_X_8cyAWKE6iHMTaOGiBxLeqRGsc6_&s)  
  
**Bridge**: *DONE* ✅  
  
**urls**
- mainnet:          https://stargate.finance/
- documentation:    https://stargateprotocol.gitbook.io/stargate/v/user-docs/
- developer docs:   https://stargateprotocol.gitbook.io/stargate/
  
**Bridge** *arbitrum* / *polygon* / *ethereum* / *optimism* / *metis* / *bsc* / *arbitrum* / *polygon_zkevm* / *base* / *linea* / *kava*  
  
**Tokens** *ETH* / *USDC* / *DAI* / *USDT*
<br />
<br />

## ![ETH](assets/ethereum.png) Ethereum bridge
| Chain    | ![DAI](assets/dai.png) | ![ETH](assets/eth.png) | ![USDC](assets/usdc.png) | ![USDT](assets/usdt.png) |
|----------|------------------------|------------------------|--------------------------|--------------------------|
| starknet |           ✅           |           ✅            |            ✅            |             ✅           |
| arbitrum |           ✅           |           ✅            |            ✅            |             ✅           |
| polygon  |           ✅           |           ✅            |            ✅            |             ✅           |
| zksync2  |           ❌           |           ✅            |            ✅            |             ❌           |
| optimism |           ✅           |           ✅            |            ✅            |             ✅           |
<br />
<br />

## ![ARB](assets/arbitrum.png) Arbitrum bridge
| Chain    | ![DAI](assets/dai.png) | ![ETH](assets/eth.png) | ![USDC](assets/usdc.png) | ![USDT](assets/usdt.png) |
|----------|------------------------|------------------------|--------------------------|--------------------------|
| ethereum |           ✅           |           ✅            |            ✅            |             ✅           |
| polygon  |           ✅           |           ✅            |            ✅            |             ✅           |
| zksync2  |           ❌           |           ✅            |            ✅            |             ❌           |
| optimism |           ✅           |           ✅            |            ✅            |             ✅           |
<br />
<br />

## ![MATIC](assets/polygon.png) Polygon bridge
| Chain    | ![DAI](assets/dai.png) | ![ETH](assets/eth.png) | ![USDC](assets/usdc.png) | ![USDT](assets/usdt.png) |
|----------|------------------------|------------------------|--------------------------|--------------------------|
| ethereum |           ✅           |           ✅            |            ✅            |             ✅           |
| arbitrum |           ✅           |           ✅            |            ✅            |             ✅           |
| zksync2  |           ❌           |           ✅            |            ✅            |             ❌           |
| optimism |           ✅           |           ✅            |            ✅            |             ✅           |
<br />
<br />

## ![OP](assets/optimism.png) Optimism bridge
| Chain    | ![DAI](assets/dai.png) | ![ETH](assets/eth.png) | ![USDC](assets/usdc.png) | ![USDT](assets/usdt.png) |
|----------|------------------------|------------------------|--------------------------|--------------------------|
| ethereum |           ✅           |           ✅            |            ✅            |             ✅           |
| arbitrum |           ✅           |           ✅            |            ✅            |             ✅           |
| zksync2  |           ❌           |           ✅            |            ✅            |             ❌           |
| polygon  |           ✅           |           ✅            |            ✅            |             ✅           |
<br />
<br />

## ![ZK](assets/zkSync.png) zkSync2 bridge
| Chain    | ![DAI](assets/dai.png) | ![ETH](assets/eth.png) | ![USDC](assets/usdc.png) | ![USDT](assets/usdt.png) |
|----------|------------------------|------------------------|--------------------------|--------------------------|
| ethereum |           ❌           |           ✅            |            ✅            |             ❌           |
| arbitrum |           ❌           |           ✅            |            ✅            |             ❌           |
| optimism |           ❌           |           ✅            |            ✅            |             ❌           |
| polygon  |           ❌           |           ✅            |            ✅            |             ❌           |
<br />
<br />
<br />
<br />

## Calling Stargate Functions
<br />

To use it just import the directory named *Stargate*  
```javascript
import Stargate from "/Stargate"

Stargate.bridge(     
    signer,
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    "polygon",
    "avalanche",
    '1' 
)
```
<br />
<br />
In this module you will be able to interact with all functionnalities of the *Stargate* Bridge on all its supported network (see `/Stargate/config/chainPath.json`)  
    
<br />
  
> [!NOTE]
> For each chains (see `/Stargate/config/chains.ts`) a default public ***RPC*** has been set up but feel free to put your own ones.  
<br />

```javascript
export const bridge = async(
    signer: Wallet,
    tokenFrom: string,
    tokenTo: string,
    fromChain: Chains, 
    toChain: Chains,
    amount: string | null,
    options?: {
        max?: boolean,
        slipage?: number
    },
): Promise<void>
```

## Swap
The swap function need an object of at least 6 parameters and 3 optionnals  

`signer`: The signer of an EVM (ethereum virtual machine) account that will sign the transaction on the evm chain  
  
`tokenFrom`: The token's address, this token will be bridge to the target chain make sure that the token address match with its chain *fromChain*  

`tokenTo`: The token's address, this token will be received from the origin chain make sure that the token address match with its chain *toChain*  
  
`fromChain`: Name of the source chain  
  
`toChain`: Name of the target chain   
  
`amount (optional)`: The amount to be bridge it is worth noting that makers have 'minimum' amount to be send otherwise it will revert the function (see `/Orbital/config/makerListMainnet` to know the details). If you use the `max` params to true, no need to specify an amount.  
  
`max (optional)`: if activated it will send the total balance of `token` param from the `fromChain` chain. It is worth noting that makers have a 'maximum' amount ceiling, if your balance is above the function will throw an error.
  

## Author
 
Tondelier Jonathan