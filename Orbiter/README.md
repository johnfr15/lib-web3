# jonathan
Jonathan's code

# Orbiter  
**Swap**: *In progress*    
  
**urls**
- mainnet:          https://www.orbiter.finance/
- testnet:          https://rinkeby.orbiter.finance/  
- documentation:    https://docs.orbiter.finance/ 
  
**Bridge** *Starknet* / *Polygon* / *Arbitrum*  

## Calling Orbiter Functions

To use it just import the directory named *Orbiter*  
```javascript
import Orbiter from "/Orbiter"
```

In this module you will be able to interact with all functionnalities of the *Orbiter* Bridge 
on all its supported network (see `/Orbiter/config/makerListMainnet`)

```javascript
Orbiter.swap({
    evmSigner,
    starkSigner,
    TOKEN_FROM_ADDRESS,
    fromChain, 
    toChain,
    amount,
})
```

## Swap
The swap function need at least 6 parameters and 2 optionnal  

`param1`: The signer of an EVM (ethereum virtual machine) acount that will sign the transaction on the evm networks  
`param2`: The signer of an Starknet acount that will sign the transaction on the starknet network    
`param3`: The token address, this token will be bridge to the target network  
`param4`: Name of the source network  
`param5`: Name of the target network   
`param6 (optional)`: The amount to be bridge it is worth noting that makers have 'minimum' amount to be send otherwise it will revert the function (see `/Orbital/config/makerListMainnet` to know the details).   
`param7 (optional)`: if activated it will check for the highest amount possible from token, take note that some "Makers" may have cap if your balance is above that cap this will revert the function (default is false).  
`param8 (optional)`: The network wether on mainnet or testnet (default is testnet)

## Author
 
Tondelier Jonathan