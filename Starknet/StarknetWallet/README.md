# jonathan
Jonathan's code

# Starknet wallet     
  
## url
- Docs: https://www.starknetjs.com/docs/guides/create_account/
  

## Calling StarknetWallet

To use it just import the directory named *jediSwap*  
```javascript
import StarknetWallet from "/StarknetWallet"
```

In this module you will be able to interact with all functionnalities of the AMM
You will then be able to interact with the mains functions

```javascript
StarknetWallet.pre_compute( OZContractClassHash )
StarknetWallet.fund( new_account.address, '0.001', starkSigner, network )
StarknetWallet.deploy_wallet( id, TESTNET_PROVIDER )
```

### Pre compute address
```javascript
const pre_compute = async( classHash: string ): Promise<number>;
```

> [!NOTE]
> This function will precompute our future address and store all the details of this generation to /StarknetWallet/accounts.json
> for further steps.

`classHash`: Hash of a ( OZ / Argent ) account type 
  
<br /> 
<br /> 

### Deploy wallet
  
```javascript
const deploy_wallet = async( id: number, provider: Provider ): Promise<void>;
```

> [!NOTE]
> Will deploy the contract of this address which will allow us to interact with smart contract

  
`id`: Id of the generated wallet in ./accounts.json
  
`provider`: A Starknet provider
  
 
## Author
 
Tondelier Jonathan