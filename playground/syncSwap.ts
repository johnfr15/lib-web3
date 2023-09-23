import { Wallet } from "ethers"
import SyncSwap from "../ZkSync/SyncSwap"
import { log_balances } from "../ZkSync/SyncSwap/log"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, ZERO_ADDRESS, TOKENS } = SyncSwap.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, TESTNET_PROVIDER )

        console.log("account: ", signer.address)
        await log_balances( signer, network )
        console.log("")

        // console.log( await get_balance(TOKENS[ network ].dai, signer))
        
        await SyncSwap.swap(
            signer,
            [ TOKENS[ network ].dai, ZERO_ADDRESS ],
            "80939812127.654448566476392533",
            network
        )

        // await SyncSwap.addLiquidity( 
        //     signer,
        //     TOKENS[ network ].eth,
        //     null,
        //     TOKENS[ network ].dai,
        //     null,
        //     true,
        //     network
        // )

        // await SyncSwap.withdrawLiquidity( 
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