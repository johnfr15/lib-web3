import { Wallet, ethers } from "ethers"
import dotenv from "dotenv"
import PancakeSwapV3 from "../AMM/PancakeswapV3"
import { Chains } from "../AMM/PancakeswapV3/types"

dotenv.config()


const main = async() => {
    
    const { TOKENS, CHAIN_ID } = PancakeSwapV3.Constant
    const { resolve_provider } = PancakeSwapV3.Utils
    const { log_balances } = PancakeSwapV3.Log

    
    try {

        // Set up
        const chain: Chains = "ethereumTestnet" // Testnet | Mainnet
        const provider = resolve_provider( CHAIN_ID[ chain ] )

        const signer = new Wallet( process.env.ETH_PRIVATE_KEY!, provider )

        // console.log("account: ", signer.address)
        // await log_balances( signer, chain )
        // console.log("")

        
        // await PancakeSwapV3.swap(
        //     signer,
        //     [ TOKENS[ chain ].eth, TOKENS[ chain ].usdc ],
        //     "0.00000000000001",
        //     null,
        //     chain
        // )

        await PancakeSwapV3.addLiquidity( 
            signer,
            TOKENS[ chain ].eth,
            null,
            TOKENS[ chain ].usdc,
            "0.001",
            chain,
        )

        await PancakeSwapV3.withdrawLiquidity( 
            signer,
            TOKENS[ chain ].eth,
            TOKENS[ chain ].usdc,
            chain,
        )


    } catch (error: any) {
  
        console.log(error)
        return (1)
  
    }
}
  
main()



// Example of encoding a struct 

// const addr = ethers.Typed.address('0xd4e42e41FCa01464d36a44ACAb98D2aA1447e8f4')
// const str = ethers.Typed.string('Hello World')
// const obj = {
//     address: '0xd4e42e41FCa01464d36a44ACAb98D2aA1447e8f4',
//     message: ethers.toUtf8Bytes( 'Hello World' )
// }


// const encoded = ethers.AbiCoder.defaultAbiCoder().encode( [ "tuple(address,bytes)" ], [ Object.values( obj ) ]  )
// console.log( encoded )
