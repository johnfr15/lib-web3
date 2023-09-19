import { ethers, Wallet } from "ethers"
import Mute from "../ZkSync/Mute"

import dotenv from "dotenv"
import { log_balances } from "../ZkSync/Mute/log"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = Mute.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, TESTNET_PROVIDER )

        console.log("account: ", signer.address)
        await log_balances( signer, network )
        console.log("")


        await Mute.swap(
            signer,
            [ "0x0", "0x0faF6df7054946141266420b43783387A78d82A9"],
            "0.0001",
            network
        )

        // Mute.addLiquidity( 
        //     starkSigner,
        //     TOKENS[ network ].eth,
        //     null,
        //     TOKENS[ network ].dai,
        //     "0.01",
        //     false,
        //     network
        // )

        // Mute.withdrawLiquidity( 
        //     starkSigner,
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