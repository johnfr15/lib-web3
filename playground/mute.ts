import { ethers, Wallet } from "ethers"
import Mute from "../ZkSync/Mute"

import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS } = Mute.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const signer = new Wallet( process.env.PRIVATE_KEY!, TESTNET_PROVIDER )

        console.log("zk account: ", signer.address)
        console.log("")



        // await Mute.swap(
        //     starkSigner,
        //     [ TOKENS[ network ].eth, TOKENS[ network ].dai ],
        //     "0.0000001",
        //     null,
        //     network
        // )

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