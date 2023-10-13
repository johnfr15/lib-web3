# Houdini  
![Houdini](assets/houdini.png)  
  
**Bridge**: *DONE* ✅  
  
**urls**
- mainnet:          https://houdiniswap.com/
- documentation:    https://houdiniswap.com/How-it-works
- api docs:         https://api-partner.houdiniswap.com/#/
  
**Bridge** *arbitrum* / *polygon* / *ethereum* / *optimism* / *bsc* / *Bitcoin* / *Monero* / *Cardano* / *Avalanche* / *Cosmos*  
  
<br />
<br />

## API
  
**Endpoints**  
| Methods |  endpoint  | Description                                                    | Parameters
|:-------:|:----------:|:---------------------------------------------------------------|---------------------------
| GET     | /status    | Get the status of order id                                     | { id: string }
| GET     | /tokens    | Get list of available tokens for exchange                      | 
| POST    | /exchange  | Create an exchange order                                       | { amount: number, from: string, to: string, receiverTag: string, addressTo: string, anonymous: boolean, fixed: boolean, direction: string, ip: string, userAgent: string, timezone: string }
| GET     | /quote     | Perform a quote and returns the best price for the swap pair   | { amount: number, from: string, to: string,   nonymouq: boolean }
<br />
<br />
<br />
<br />
  
## Calling Houdini Functions  
<br />

To use it just import the directory named *Houdini*  
```javascript
import Houdini from "./Bidge/Houdini"

Houdini.bridge(     
    signer,
    "1",
    "ETHBASE",
    "ETH",
    "BASE Base",
    "Ethereum Mainnet",
    { anonymous: true }
)
```
<br />
<br />

> [!NOTE]
> For each chains (see `/Houdini/config/chains.ts`) a default public ***RPC*** has been set up but feel free to put your own ones.  
<br />

```javascript
export const bridge = async(
    signer: Wallet,
    amount: string,
    tokenFrom: TokenId,
    tokenTo: TokenId,
    fromNetwork: Network, 
    toNetwork: Network,
    options?: {
        receiveAddress?: string
        slipage?: number
        anonymous?: boolean
        ip?: string
        userAgent?: string
    },
): Promise<void>
```

## Bridge
The bridge function need an object of at least 6 parameters and 3 optionnals  

`signer`: The signer of an EVM (ethereum virtual machine) account that will sign the transaction on the evm chain  
  
`amount`: The amount to be bridge it is worth noting that there is a minimum amount ( roughly 10$ amount of token in general ).  
  
`tokenFrom`: The token's *houdini* id, this token will be bridge to the target chain.  

`tokenTo`: The token's *houdini* id, this token will be received on the target chain 
  
`fromNetwork`: Name of the source chain  
  
`toNetwork`: Name of the target chain   
  
`(optional) receiveAddress`: The wallet that will receive the funds on the target network  
  
`(optional) slipage`: Protection against price movement or to high price impact default is 0.5%  
  
`(optional) anonymous`: If set to true houdini will perform extra swaps on Monero (increase fees by 1%)  
  
`(optional) ip`: Ip address  
  
`(optional) userAgent`: The application agent that send request to houdini  
  

## Author
 
Tondelier Jonathan