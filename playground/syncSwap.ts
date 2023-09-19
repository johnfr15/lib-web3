import { ethers, Wallet } from "ethers"
import SyncSwap from "../ZkSync/SyncSwap"
import { log_balances } from "../ZkSync/SyncSwap/log"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = SyncSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, TESTNET_PROVIDER )

        console.log("account: ", signer.address)
        await log_balances( signer, network )
        console.log("")


        // await SyncSwap.swap(
        //     signer,
        //     [ "0x0", "0x0faF6df7054946141266420b43783387A78d82A9"],
        //     "0.0001",
        //     network
        // )

        // SyncSwap.addLiquidity( 
        //     signer,
        //     TOKENS[ network ].eth,
        //     null,
        //     TOKENS[ network ].dai,
        //     "0.01",
        //     false,
        //     network
        // )

        // SyncSwap.withdrawLiquidity( 
        //     signer,
        //     TOKENS[ network ].eth,
        //     TOKENS[ network ].dai,
        //     100,
        //     network
        // )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()