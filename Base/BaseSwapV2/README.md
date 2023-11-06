# BaseSwapV2    
![BaseSwapV2](https://BaseSwap.fi/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fnewlogo.4884563a.png&w=640&q=75)  

**Swap**: ✅  
**Add liquidity**: ✅  
**Remove liquidity**: ✅  

## url
- Mainnet: https://BaseSwapV2.fi/
- Docs: https://docs.BaseSwapV2.fi/BaseSwapV2/
- Github: 

<br />
<br />  

## Calling BaseSwapV2 Functions

To use it just import the directory named *BaseSwapV2*  
```javascript
import BaseSwapV2 from "/AMM/BaseSwapV2"
```

In this module you will be able to interact with all functionnalities of the BaseSwapV2 AMM
You will then be able to interact with the mains functions on all supported chains

```javascript
BaseSwapV2.swap( signer, [ TOKEN_FROM_ADDRESS, TOKEN_TO_ADDRESS ], "23" )
BaseSwapV2.addLiquidity( signer, TOKEN_A_ADDRESS, null, TOKEN_B_ADDRESS, null, { max: true } )
BaseSwapV2.withdrawLiquidity( signer, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS, { percent: 50 } )
```

### Swap  
```javascript
export const swap = async(
    signer: Wallet,
    path: [string, string],
    amount: string | null,
    options?: {
        tradeType?: TradeType
        percent?: number | undefined;
        max?: boolean | undefined;
        slipage?: number | undefined;
        deadline?: number | undefined;
    }
): Promise<void>;
```
**note:** If `percent` option param is set it will be prioritised to `amount`  
**note:** If `percent` and `max` options params is set, `max` will be prioritised to `amount` and `percent`  

  
`signer`: The signer Wallet that will sign the transaction.  
  
`path`: An array containing the address of the 2 tokens involved the first index is the address of token that will enter the pool **(in token)** and the second index is the address of the token getting out of the pool (out token)  
  
`amount`: The amount of exact token to be swapped for the other one (default is **(in token)**) 
  
`tradeType (optional)`: EXACT IN => 0, EXACT OUTPUT => 1 (default is EXACT IN)
  
`percent (optional)`: The percentage amount we want to swap (default is undefined)
  
`max (optional)`: if activated it will check for the highest amount possible from tokenA and tokenB (default is false)
  
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)  (default is 0.5)
  
`deadline (optional)`: The deadline for the tx to be valided in unix time. (default is 20 minutes)
  
  
### Add liquidity  
  
```javascript
export const addLiquidity = async(
    signer: Wallet,                        
    addressA: string,                       
    amountA: string | null,     
    addressB: string,                       
    amountB: string | null,     
    options?: {
        percent?: number
        max?: boolean
        slipage?: number
        deadline?: number
    }
): Promise<void>
```
**NOTE**: If `percent` parameter is activated whatever amount is in *param 3* or/and *param 5* the function won't care and will fetch the 'percent' amount of tokens we can add in the pool wether its tokenA or tokenB the least quantity we own.  
  
**NOTE**: If `max` parameter is activated whatever amount is in *param 3* or/and *param 5* or if `percent` param is activated the function won't care and will fetch the max amount of tokens we can add in the pool wether its tokenA or tokenB the least quantity we own.  
  
**NOTE**: If `amountA` is set to *null* => `amountB` will be used to fetch the quote of `amountA`  
  
**NOTE**: If both `amountA` & `amountB` is set to a number => `amountA` will be used to fetch the quote of `amountB`  
  
**NOTE**: If both `amountA` & `amountB` is set to ***null*** => `max` param will be used   
  
**NOTE**: If the three `amountA` & `amountB` & `max` is set to ***null*** => throw error  
  
  
`signer`: The signer acount that will sign the transaction  
  
`addressA`: Address of **tokenA**  
  
`amountA`: Amount of first token. if set to null will check for amountB or max  
  
`addressB`: Address of **tokenB**  
  
`amountB`: Amount of second token. if set to null will check for amountA or max  
  
`percent (optional)`: The percentage amount of our least balance we want to add (default is undefined) 
  
`max (optional)`: if activated it will check for the highest amount possible from tokenA and tokenB  
  
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)  
  
`deadline (optional)`: The deadline for the tx to be valided in unix time.  

  
### Remove liquidity  
  
```javascript
export const withdrawLiquidity = async(
    signer: Wallet, 
    tokenA: string, 
    tokenB: string, 
    options?: {
        stable?: boolean
        percent?: number
        slipage?: number
        deadline?: number
    }
): Promise<void>
```
  
`signer`: The signer acount that will sign the transaction  
  
`tokenA`: Address of **tokenA**  
  
`tokenB`: Address of **tokenB** 

`stable (optional)`: Fetch stable or unstable pool  
  
`percent (optional)`: The percentage amount we want to withdraw by (default is 100%)   
  
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)  
  
`deadline (optional)`: The deadline for the tx to be valided in unix time.  
  
  
## Author
 
Tondelier Jonathan