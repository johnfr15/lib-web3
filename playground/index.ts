import { Account, Contract } from "starknet"
import * as starknet from "starknet"
import MySwap from "../MySwap"
import dotenv from "dotenv"
import { MYSWAP_ABI, TESTNET_MYSWAP } from "../MySwap/constant"

dotenv.config()

const main = async() => {
    
    const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS
    const PRIVATE_KEY = process.env.PRIVATE_KEY
    const { TESTNET_PROVIDER, TOKEN, TICKER } = MySwap.Constant
    const network = "testnet" // testnet | mainnet
  
    try {
        // Set up
        const signer = new Account(TESTNET_PROVIDER, ACCOUNT_ADDRESS!, PRIVATE_KEY!);
        const contract = new Contract(MYSWAP_ABI, TESTNET_MYSWAP, signer)
        const { balance } = await MySwap.Utils.get_balance(signer.address, signer, TOKEN.eth[network])
        console.log("Account: ", signer.address)
        console.log("Balance: ", balance, TICKER[TOKEN.eth[network]])

        await MySwap.swap(signer, [TOKEN.eth[network], TOKEN.dai[network]], "0.000001")
        // await MySwap.add_liquidity(
        //     signer, 
        //     TOKEN.eth[network],
        //     null, 
        //     TOKEN.usdc[network],
        //     null,
        //     1
        // )
        // await MySwap.withdraw_liquidity(signer, TOKEN.usdc[network], TOKEN.eth[network])

    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
  }
  
  main()