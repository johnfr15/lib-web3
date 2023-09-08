# jonathan
Jonathan's code

# Orbiter  
![Orbiter](https://avatars.githubusercontent.com/u/102346948?s=200&v=4)  
  
**Swap**: *DONE* ✅  
  
**urls**
- mainnet:          https://www.orbiter.finance/
- testnet:          https://rinkeby.orbiter.finance/  
- documentation:    https://docs.orbiter.finance/ 
  
**Bridge** *starknet* / *arbitrum* / *polygon* / *ethereum* / *zksync* / *optimism* / *metis* / *boba* / *zksync2* / *bsc* / *arbitrum_nova* / *polygon_zkevm* / *base* / *linea* / *mantle*  
  
**Tokens** *ETH* / *USDC* / *DAI* / *USDT*
  

## Calling Orbiter Functions
<br />

To use it just import the directory named *Orbiter*  
```javascript
import Orbiter from "/Orbiter"

Orbiter.swap( swap_params )
```
<br />
<br />
In this module you will be able to interact with all functionnalities of the *Orbiter* Bridge 
on all its supported network (see `/Orbiter/config/maker-1.ts`)  
<br />

> [!NOTE]
> For each chains (see `/Orbiter/config/chains.ts`) a default public ***RPC*** has been set up but feel free to put your own ones.  
<br />

```javascript
export const swap = async( swap_params: {
    evmSigner: Wallet,
    starkSigner: Account,
    token: string,
    fromChain: Chains, 
    toChain: Chains,
    
    amount?: string,
    max?: boolean,
    network?: 'TESTNET' | 'MAINNET' 
}): Promise<void>
```

## Swap
The swap function need an object of at least 6 parameters and 3 optionnals  

`evmSigner`: The signer of an EVM (ethereum virtual machine) account that will sign the transaction on the evm networks  
  
`starkSigner`: The signer of an Starknet acount that will sign the transaction on the starknet network  
  
`token`: The token address, this token will be bridge to the target network make sure that the token address match with its network *fromChain* 
  
`fromChain`: Name of the source network  
  
`toChain`: Name of the target network   
  
`amount (optional)`: The amount to be bridge it is worth noting that makers have 'minimum' amount to be send otherwise it will revert the function (see `/Orbital/config/makerListMainnet` to know the details). If you use the `max` params to true, no need to specify an amount.  
  
`max (optional)`: if activated it will send the total balance of `token` param from the `fromChain` chain. It is worth noting that makers have a 'maximum' amount ceiling, if your balance is above the function will throw an error.
  
`network (optional)`: The network wether on mainnet or testnet (default is testnet)

## Author
 
Tondelier Jonathan