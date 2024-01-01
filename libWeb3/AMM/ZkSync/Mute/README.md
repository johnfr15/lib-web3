# Mute  
![Mute](https://mute.io/web/logo_mute.png)  
  
**Swap**: ✅    
**Add liquidity**: ✅    
**Remove liquidity**: ✅    
      
<br>
<br>

## url
- Mainnet: https://app.Muteswap.xyz/
- Docs: https://docs.Muteswap.xyz/
- Github: https://github.com/muteio
  
**AMM** *Swap* / *Add liquidity* / *remove liquidity*  
    
<br>
<br>

## Calling Mute Functions

To use it just import the directory named *Mute*  
```javascript
import Mute from "/Mute"
```

In this module you will be able to interact with all functionnalities of the AMM
You will then be able to interact with the mains functions

```javascript
Mute.swap(signer, [TOKEN_FROM_ADDRESS, TOKEN_TO_ADDRESS], "23")
Mute.addLiquidity(signer, TOKEN_A_ADDRESS, null, TOKEN_B_ADDRESS, null, 1)
Mute.removeLiquidity(signer, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS)
```
    
<br>
<br>

### Swap  
```javascript
export const swap = async(
    signer: Wallet,
    path: [string, string],
    amountIn: string,
    network: 'TESTNET' | 'MAINNET' = 'TESTNET',
    slipage: number = 0.5, // this represent 0.5% of allowed slipage (default)
    priceImpact: number = 2, // this represent 2% of allowed price impact (default)
    deadline?: number,
): Promise<void>;
```
The swap function need at least 3 parameters and 6 optionnal  

**note:** amountIn is for *exact input*, where amountOut is for *exact output* we must specify at least one of both.  
          if amountOut *exact output* is used amountIn should be set to ***null***.  
  
`signer`: The signer Wallet that will sign the transaction.  
  
`path`: An array containing the address of the 2 tokens involved the first index is the address of token that will enter the pool **(in token)** and the second index is the address of the token getting out of the pool (out token)  
  
`amountIn`: The amount of exact token (in token) to be swapped for the other one **(out token)**  
  
`network (optional)`: The network we want to use the AMM it is set by default to **testnet**  
  
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)  
  
`priceImpact (optional)`: The maximum impact tolerance accepted by our swap. [What is price impact ?](https://support.uniswap.org/hc/en-us/articles/8671539602317-What-is-Price-Impact-#:~:text=Price%20Impact%20is%20the%20change,size%20of%20the%20liquidity%20pool.)  
  
`deadline (optional)`: The deadline for the swap in minutes.  
      
<br>
<br>

### Add liquidity  
  
```javascript
export const addLiquidity = async(
    signer: Wallet,                        
    addressA: string,                       
    amountA: string | null,     
    addressB: string,                       
    amountB: string | null,     
    max: boolean = false,                         
    network: 'TESTNET' | 'MAINNET' = 'TESTNET',            
    slipage: number = 0.5, // this represent 0.5% of allowed slipage (default)
    deadline: number | null = null,
): Promise<void>
```
The addLiquidiy function need at least 5 parameters and 3 optionnal  
If **max** parameter is activated whatever amount is in *param 3* or/and *param 5* the function won't care and will fetch the max amount of tokens we can add in the pool wether its tokenA or tokenB the least quantity we own.  
If **amountA** is set to ***null*** => **amountB** will be used to fetch the quote of **amountA**  
If both **amountA** & **amountB** is set to a number => **amountA** will be used to fetch the quote of **amountB**  
If both **amountA** & **amountB** is set to ***null*** => **max** param will be used   
If the three **amountA** & **amountB** & **max** is set to ***null*** => throw error  
  
`signer`: The signer acount that will sign the transaction  
  
`addressA`: Address of **tokenA**  
  
`amountA`: Amount of first token. if set to null will check for amountB or max  
  
`addressB`: Address of **tokenB**  
  
`amountB`: Amount of second token. if set to null will check for amountA or max  
  
`max (optional)`: if activated it will check for the highest amount possible from tokenA and tokenB  
  
`network (optional)`: The network we want to use the AMM it is set by default to **testnet**  
  
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)  
  
`deadline (optional)`: The deadline for the swap in minutes.  
      
<br>
<br>

### Remove liquidity  
  
```javascript
export const removeLiquidity = async(
    signer: Wallet, 
    tokenA: string, 
    tokenB: string, 
    percent: number = 100, 
    network: 'TESTNET' | 'MAINNET' = 'TESTNET', 
    slipage: number = 0.5, // this represent 0.5% of allowed slipage (default)
    deadline: number | null = null,
): Promise<void>
```
The removeLiquidity function need at least 3 parameters and 4 optionnal;   
  
`signer`: The signer acount that will sign the transaction  
  
`tokenA`: Address of **tokenA**  
  
`tokenB`: Address of **tokenB**  
  
`percent (optional)`: The percentage amount we want to withdraw by default it is set to 100%  
  
`network (optional)`: The network we want to use the AMM it is set by default to **TESTNET**  
   
`slipage (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. It is set by default to **0.5%** of slipage tolerance. [What is slipage ?](https://support.uniswap.org/hc/en-us/articles/8643879653261-What-is-Price-Slippage-)   
  
`deadline (optional)`: The deadline for the swap in minutes.  
        
<br>
<br>

## Author
 
Tondelier Jonathan