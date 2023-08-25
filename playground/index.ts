import { Account } from "starknet"
import MySwap from "../MySwap"
import dotenv from "dotenv"

dotenv.config()

const main = async() => {
    
    const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS
    const PRIVATE_KEY = process.env.PRIVATE_KEY
    const { TESTNET_PROVIDER, TOKEN, TICKER } = MySwap.Constant
    const network = "testnet" // testnet | mainnet
  
    try {
        // Set up
        const signer = new Account(TESTNET_PROVIDER, ACCOUNT_ADDRESS!, PRIVATE_KEY!);
        const { balance } = await MySwap.Utils.get_balance(signer.address, signer, TOKEN.eth[network])
        console.log("Account: ", signer.address)
        console.log("Balance: ", balance, TICKER[TOKEN.eth[network]])
  

        // Swap
        // await MySwap.swap( signer, [TOKEN.eth[network], TOKEN.dai[network]], "0.000000000000000001" ) 
  
        //Add liquidity
        // await MySwap.add_liquidity(
        //     signer, 
        //     TOKEN.eth[network],
        //     "0.000001", 
        //     TOKEN.wsteth[network],
        //     null,
        // )
  
        // Remove liquidity
        // await MySwap.withdraw_liquidity(signer, TOKEN.wsteth[network], TOKEN.eth[network])
  
    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
  }
  
  main()