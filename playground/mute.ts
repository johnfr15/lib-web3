import { ethers, Wallet, Contract } from "ethers"
import Mute from "../ZkSync/Mute"
import { log_balances } from "../ZkSync/Mute/log"
import dotenv from "dotenv"

dotenv.config()


const main = async() => {
    
    const { TESTNET_PROVIDER, MAINNET_PROVIDER, TOKENS, MUTE_ROUTER_ABI, ZERO_ADDRESS } = Mute.Constant
    
    try {
        // Set up
        const network: 'TESTNET' | 'MAINNET' = "TESTNET" // Testnet | Mainnet
        const USDC_TESTNET =  "0x0faF6df7054946141266420b43783387A78d82A9"
        const DAI_TESTNET =  "0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b"
        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, TESTNET_PROVIDER )


        console.log("account: ", signer.address)
        await log_balances( signer, network )
        console.log("")



        // await Mute.swap(
        //     signer,
        //     [ ZERO_ADDRESS, DAI_TESTNET ],
        //     "0.00001",
        //     network
        // )

    //    await  Mute.addLiquidity( 
    //         signer,
    //         TOKENS[ network ].eth,
    //         null,
    //         TOKENS[ network ].dai,
    //         "0.01",
    //         true,
    //         network
    //     )

        // Mute.withdrawLiquidity( 
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