# Izumi  
![Izumi](https://izumi.finance/assets/home/homepiece1Dark.gif)  

**Swap**: ✅  
**Add liquidity**: ✅  
**Remove liquidity**: ✅  

*bsc* / *aurora* / *arbitrum* / *polygon* / *meter* / *zksync* / *ontology* / *mantle* / *linea* / *ethereumClassic* / *base* / *opbnb* / *kroma* / *manta* / *scroll* / *bscTestnet* / *zksyncTestnet* / *scrollTestnet* / *mantleTestnet* / *lineaTestnet*
  
## url
- Mainnet: https://izumi.finance/home
- Docs: https://docs.izumi.finance/
- Docs-devs: https://developer.izumi.finance/
- Github: https://github.com/IzumiFinance/
- Core-contract: https://github.com/izumiFinance/iZiSwap-core
- Periphery-contract: https://github.com/izumiFinance/iZiSwap-periphery

<br />
<br />  

## Chains supported
| Chain                                  | Mainnet | Testnet |
| -------------------------------------- | ------- | ------- |
| ![BSC](assets/bnbChain.png)<br>BSC     |   ✅    |   ✅     |
| ![AUR](assets/aurora.jpeg)<br>AURORA   |   ✅    |   ❌     |
| ![ARB](assets/arbitrum.png)<br>ARBIT   |   ✅    |   ❌     |
| ![MATIC](assets/polygon.png)<br>MATIC  |   ✅    |   ❌     |
| ![METER](assets/mtr.png)<br>METER      |   ✅    |   ❌     |
| ![SYNC](assets/zkSync.png)<br>SYNC     |   ✅    |   ✅     |
| ![ONT](assets/ont.png)<br>ONTO         |   ✅    |   ❌     |
| ![MANTLE](assets/mantle.png)<br>MANTLE |   ✅    |   ✅     |
| ![LINEA](assets/linea.png)<br>LINEA    |   ✅    |   ✅     |
| ![BASE](assets/base.png)<br>BASE       |   ✅    |   ❌     |
| ![OPBNB](assets/opbnb.png)<br>OPBNB    |   ✅    |   ❌     |
| ![KROM](assets/kroma.png)<br>KROM      |   ✅    |   ❌     |
| ![MANTA](assets/manta.png)<br>MANTA    |   ✅    |   ❌     |
| ![SCRO](assets/scroll.png)<br>SCROLL   |   ✅    |   ✅     |



<br />
<br />

## Tokens
Basic tokens are supported on each chains but if one of yours is missing you can add it to ***./config/tokens/your-chain.json***  
<br />
<br />
  
## Calling Izumi Functions

To use it just import the directory named *Izumi*  
```javascript
import Izumi from "/AMM/Izumi"
```

In this module you will be able to interact with all functionnalities of the Izumi AMM
You will then be able to interact with the mains functions on all supported chains

```javascript
Izumi.swap( signer, [ TOKEN_FROM_ADDRESS, TOKEN_TO_ADDRESS ], "23", "polygon" )
Izumi.addLiquidity( signer, TOKEN_A_ADDRESS, null, TOKEN_B_ADDRESS, null, "arbitrum", { max: true } )
Izumi.withdrawLiquidity( signer, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, "optimism", { percent: 50 } )
```

### Swap  
```javascript
export const swap = async(
    signer: Wallet,
    path: [string, string],
    amount: string | null,
    chain: Chains,
    options?: {
        tradeType?: TradeType | undefined;
        percent?: number | undefined;
        max?: boolean | undefined;
        slipage?: number | undefined;
        deadline?: number | undefined;
        fee?: Fees | undefined;
    }
): Promise<void>;
```
**note:** If `percent` option param is set it will be prioritised to `amount`  
**note:** If `percent` and `max` options params is set, `max` will be prioritised to `amount` and `percent`  

  
`signer`: The signer Wallet that will sign the transaction.  
  
`path`: An array containing the address of the 2 tokens involved the first index is the address of token that will enter the pool **(in token)** and the second index is the address of the token getting out of the pool (out token)  
  
`amount`: The amount of exact token to be swapped for the other one (default is **(in token)**) 
  
`chain`: The chain's name to operate the swap  
  
`tradeType (optional)`: This parameter will define which token we want to be `EXACT`. ***0*** => **EXACT INPUT**, ***1*** => **EXACT OUTPUT** (default is 0)
  
`percent (optional)`: The percentage amount we want to swap (default is undefined)
  
`max (optional)`: if activated it will check for the highest amount possible from tokenA and tokenB (default is false)
  
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)  (default is 0.5)
  
`deadline (optional)`: The deadline for the tx to be valided in unix time. (default is 20 minutes)
  
`fee (optional)`: You can manually specify which fee the pool will operate but mostly pools are 
- LOW = 400 (0.04%)
- MEDIUM = 2000 (0.2%)
- BIG = 10000 (1%)  

(Default will fetch for the best liquidity)
  
### Add liquidity  
  
```javascript
export const addLiquidity = async(
    signer: Wallet,                        
    addressA: string,                       
    amountA: string | null,     
    addressB: string,                       
    amountB: string | null,     
    chain: Chains,
    options?: {
        percent?: number
        max?: boolean
        slipage?: number
        deadline?: number
        fee?: Fees
        tokenId?: number
    }
): Promise<void>
```
If **percent** parameter is activated whatever amount is in *param 3* or/and *param 5* the function won't care and will fetch the 'percent' amount of tokens we can add in the pool wether its tokenA or tokenB the least quantity we own.  
If **max** parameter is activated whatever amount is in *param 3* or/and *param 5* or if `percent` param is activated the function won't care and will fetch the max amount of tokens we can add in the pool wether its tokenA or tokenB the least quantity we own.  
If **amountA** is set to ***null*** => **amountB** will be used to fetch the quote of **amountA**  
If both **amountA** & **amountB** is set to a number => **amountA** will be used to fetch the quote of **amountB**  
If both **amountA** & **amountB** is set to ***null*** => **max** param will be used   
If the three **amountA** & **amountB** & **max** is set to ***null*** => throw error  
  
`signer`: The signer acount that will sign the transaction  
  
`addressA`: Address of **tokenA**  
  
`amountA`: Amount of first token. if set to null will check for amountB or max  
  
`addressB`: Address of **tokenB**  
  
`amountB`: Amount of second token. if set to null will check for amountA or max  
  
`chain`: The chain's name to operate the swap  
  
`percent (optional)`: The percentage amount of our least balance we want to add (default is undefined) 
  
`max (optional)`: if activated it will check for the highest amount possible from tokenA and tokenB  
  
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)  
  
`deadline (optional)`: The deadline for the tx to be valided in unix time.  
  
`fee (optional)`: The applied fee for the pool addressA/addressB  
  
`tokenId (optional)`: The id of the pool being used (this will faster the function and reduce the calls made to the provider)
  
### Remove liquidity  
  
```javascript
export const withdrawLiquidity = async(
    signer: Wallet, 
    tokenA: string, 
    tokenB: string, 
    chain: Chains,
    options?: {
        percent?: number
        slipage?: number
        deadline?: number
        fee?: Fees
        tokenId?: number
    }
): Promise<void>
```
  
`signer`: The signer acount that will sign the transaction  
  
`tokenA`: Address of **tokenA**  
  
`tokenB`: Address of **tokenB** 

`chain`: The chain's name to operate the swap  
  
`percent (optional)`: The percentage amount we want to withdraw by (default is 100%)   
  
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)  
  
`deadline (optional)`: The deadline for the tx to be valided in unix time.  
  
`fee (optional)`: The applied fee for the pool tokenA/tokenB   
  
`tokenId (optional)`: The id of the pool being used (this will faster the function and reduce the calls made to the provider)
  
  
## Author
 
Tondelier Jonathan