# MySwap  
![jediSwap](https://www.myswap.xyz/static/media/logo_desktop.2afccbcc1b476e7fe722458981fd5ea9.svg)

**Swap**: ✅  
**Add liquidity**: ✅ 
**Remove liquidity**: ✅ 
    
<br>
<br>

## url
- Mainnet: https://cl.myswap.xyz/
  
**AMM** *Swap* / *Add liquidity* / *remove liquidity*  
    
<br>
<br>

## Calling MySwap Functions

To use it just import the directory named *MySwap*  
```javascript
import MySwap from "/MySwap"
```

In this module you will be able to interact with all functionnalities of the AMM
You will then be able to interact with the mains functions

```javascript
MySwap.swap(signer, [TOKEN_FROM_ADDRESS, TOKEN_TO_ADDRESS], "23")
MySwap.add_liquidity(signer, TOKEN_A_ADDRESS, null, TOKEN_B_ADDRESS, null, 1)
MySwap.withdraw_liquidity(signer, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS)
```
    
<br>
<br>

## Swap
The swap function need at least 3 parameters and 3 optionnal  

`param1`: The signer acount that will sign the transaction   
  
`param2`: An array containing the address of the 2 tokens involved the first index is the address of token that will enter the pool **(in token)** and the second index is the address of the token getting out of the pool (out token)  
  
`param3`: The amount of token (in token) to be swapped for the other one **(out token)**   
  
`param4 (optional)`: The network we want to use the AMM it is set by default to **testnet**  
  
`param5 (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. But will also protect us if it detect a *price impact* above its tolerance, it set by default to **995** with means a **0.5%** slipage   
  
`param6 (optional)`: The price of the 2 token depend of the weight they have in the pool but if you prefere you can use an oracle to fetch the real price.   

    
<br>
<br>

## add_liquidity
The add_liquidiy function need at least 5 parameters and 3 optionnal  
If **max** parameter is activated whatever amount is in *param 3* or/and *param 4* the function won't care and will fetch the max amount of tokens we can add in the pool wether its tokenA or tokenB the least quantity  

`param1`: The signer acount that will sign the transaction  
  
`param2`: Address of **tokenA**  
  
`param3`: Amount of first token. if set to null will check for amountB or max  
  
`param4`: Address of **tokenB**  
  
`param5`: Amount of second token. if set to null will check for amountA or max  
  
`param6 (optional)`: if activated it will check for the highest amount possible from tokenA and tokenB  
  
`param7 (optional)`: The network we want to use the AMM it is set by default to **testnet**  
  
`param8 (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. But will also protect us if it detect a *price impact* above its tolerance, it set by default to **995** with means a **0.5%** slipage   
    
<br>
<br>

## withdraw_liquidity
The withdraw_liquidity function need at least 3 parameters and 3 optionnal   
  
`param1`: The signer acount that will sign the transaction   
  
`param2`: Address of **tokenA**  
  
`param3`: Address of **tokenB**  
  
`param4 (optional)`: The percentage amount we want to withdraw by default it is set to 100%  
  
`param5 (optional)`: The network we want to use the AMM it is set by default to **testnet**   
  
`param6 (optional)`: The slipage tolerance will protect us from *price movement* during the validation of the block. But will also protect us if it detect a *price impact* above its tolerance, it set by default to **980** with means a **2%** slipage   
  
## Author
 
Tondelier Jonathan