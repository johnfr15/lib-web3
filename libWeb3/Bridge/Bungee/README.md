# Bungee  
![Bungee](https://multitx.bungee.exchange/bungee-logo.svg)  
  
**Bridge**: *DONE* ✅  
  
**urls**
- mainnet:          https://www.bungee.exchange/
- documentation:    https://docs.socket.tech/socket-overview/what-is-socket
- dev docs:         https://docs.socket.tech/socket-liquidity-layer/how-socketll-works
  
**Bridge** *arbitrum* / *polygon* / *optimism* / *ethereum* / *avalanche* / *bsc* / *base* / *aurora* / *fantom* / *gnosis* / *zksync* / *zkevm*  
  
**Tokens** ***ANY***
<br />
<br />


## Calling Bungee Functions
<br />

To use it just import the directory named *Bungee*  
```javascript
import Bungee from "./Bridge/Bungee"

Bungee.bridge(     
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
In this module you will be able to interact with all functionnalities of the *Bungee* Bridge on all its supported network (see `/Bungee/config/chainPath.json`)  
    
<br />
  
> [!NOTE]
> For each chains (see `/Bungee/config/chains.ts`) a default public ***RPC*** has been set up but feel free to put your own ones.  
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
        max?: boolean
        slipage?: number
        sort?: 'output' | 'gas' | 'time'
        uniqueRoutesPerBridge?: boolean
        securityBridges?: 1 | 2 | 3 | 4 | 5
    },
): Promise<void>
```

## Bridge
The swap function need an object of at least 6 parameters and 3 optionnals  

`signer`: The signer of an EVM (ethereum virtual machine) account that will sign the transaction on the evm chain  
  
`tokenFrom`: The token's address, this token will be bridge to the target chain make sure that the token address match with its chain *fromChain*  

`tokenTo`: The token's address, this token will be received from the origin chain make sure that the token address match with its chain *toChain*  
  
`fromChain`: Name of the source chain  
  
`toChain`: Name of the target chain   
  
`amount`: The amount of `tokenFrom` to be bridge   
  
`max (optional)`: If activated it will send the total balance of `tokenFrom` param from the `fromChain` chain. (DEFAULT => *false*)
  
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)  (DEFAULT => *0.5*)  
  
`sort (optional)`: Which kind of transactions we would priotirize (DEFAULT => *output*) 
  
`uniqueRoutesPerBridge (optional)`: If we plan to bundle everything in a single transaction (DEFAULT => *true*) 
  
`securityBridges (optional)`: It is the minimum security score (defined by https://l2beat.com/bridges/risk) of a brige we allow to use (DEFAULT => *3*) 
  

## Author
 
Tondelier Jonathan