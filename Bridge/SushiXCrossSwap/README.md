# SushiXCrossSwap  
![SushiXCrossSwap](https://traderfrancophone.fr/wp-content/uploads/2021/07/image_2021-07-30_232125.png)  
  
**Bridge**: *DONE* ✅  
  
**urls**
- mainnet:          https://www.sushi.com/swap/cross-chain
- documentation:    https://docs.sushi.com/
- Github:           https://github.com/sushiswap
- blog:             https://www.sushi.com/blog/sushi-xswap-a-crosschain-dex
  
**Bridge** *arbitrum* / *polygon* / *ethereum* / *optimism* / *bsc* / *base* / *avalanche*
  
**Tokens** ***ANY***
<br />
<br />


## Calling SushiXCrossSwap Functions
<br />

To use it just import the directory named *SushiXCrossSwap*  
```javascript
import SushiXCrossSwap from "./Bridge/SushiXCrossSwap"

SushiXCrossSwap.bridge(     
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
In this module you will be able to interact with all functionnalities of the *SushiXCrossSwap* Bridge on all its supported network (see `/SushiXCrossSwap/config/chainPath.json`)  
    
<br />
  
> [!NOTE]
> For each chains (see `/SushiXCrossSwap/config/chains.ts`) a default public ***RPC*** has been set up but feel free to put your own ones.  
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

## Bridge
The swap function need an object of at least 6 parameters and 3 optionnals  

`signer`: The signer of an EVM (ethereum virtual machine) account that will sign the transaction on the evm chain  
  
`tokenFrom`: The token's address, this token will be bridge to the target chain make sure that the token address match with its chain *fromChain*  

`tokenTo`: The token's address, this token will be received from the origin chain make sure that the token address match with its chain *toChain*  
  
`fromChain`: Name of the source chain  
  
`toChain`: Name of the target chain   
  
`amount`: The amount of `tokenFrom` to be bridge   
  
`max (optional)`: if activated it will send the total balance of `token` param from the `fromChain` chain.  
  
`slipage (optional)`: The slipage tolerance will protect us from price movement during the validation of the block. It is set by default to 0.5% of slipage tolerance. What is slipage ?

## Author
 
Tondelier Jonathan