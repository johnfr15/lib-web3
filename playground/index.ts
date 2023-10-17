import dotenv from "dotenv"
import { ethers, Wallet } from "ethers"
import { Account } from "starknet"
import UniswapV3 from "../AMM/UniswapV3"
import SushiswapV3 from "../AMM/SushiSwapV3"
import PancakeswapV3 from "../AMM/PancakeswapV3"
import Orbiter from "../Bridge/Orbiter"
import Stargate from "../Bridge/Stargate"

dotenv.config()

const route: any[] = [

    // POLYGON
    {
        chain: "polygon",
        protocoles: UniswapV3,
        op: 'swap',
        args: {
            signer: undefined,
            path: [ UniswapV3.Constant.TOKENS["polygon"].matic, UniswapV3.Constant.TOKENS["polygon"].usdc  ],
            amountIn: "4",
            amountOut: null,
            chain: "polygon",
        }
    },
    {
        chain: "polygon",
        protocoles: UniswapV3,
        op: 'addLiquidity',
        args: {
            signer: undefined,
            addressA: UniswapV3.Constant.TOKENS["polygon"].matic,                       
            amountA: null,     
            addressB: UniswapV3.Constant.TOKENS["polygon"].usdc,                       
            amountB: null,     
            chain: "polygon",
            options: { max: true } 
        }
    },
    {
        chain: "polygon",
        protocoles: UniswapV3,
        op: 'withdrawLiquidity',
        args: {
            signer: undefined,
            addressA: UniswapV3.Constant.TOKENS["polygon"].matic,                       
            addressB: UniswapV3.Constant.TOKENS["polygon"].usdc,                       
            chain: "polygon",
        }
    },

    // BRIDGE POLYGON => ARBITRUM
    {
        chain: "polygon",
        protocoles: Orbiter,
        op: 'swap',
        args: {
            evmSigner: undefined,
            starkSigner: undefined,
            token: Orbiter.Constant.TOKENS["MAINNET"]["polygon"].usdc,
            fromChain: "polygon", 
            toChain: "arbitrum",
            
            amount: "1",
        }
    },

    // ARBITRUM
    {
        chain: "arbitrum",
        protocoles: UniswapV3,
        op: 'swap',
        args: {
            signer: undefined,
            path: [ UniswapV3.Constant.TOKENS["arbitrum"].eth, UniswapV3.Constant.TOKENS["arbitrum"].usdc  ],
            amountIn: null,
            amountOut: "2",
            chain: "arbitrum",
        }
    },
    {
        chain: "arbitrum",
        protocoles: UniswapV3,
        op: 'addLiquidity',
        args: {
            signer: undefined,
            addressA: UniswapV3.Constant.TOKENS["arbitrum"].eth,                       
            amountA: null,     
            addressB: UniswapV3.Constant.TOKENS["arbitrum"].usdc,                       
            amountB: null,     
            chain: "arbitrum",
            options: { max: true } 
        }
    },
    {
        chain: "arbitrum",
        protocoles: UniswapV3,
        op: 'withdrawLiquidity',
        args: {
            signer: undefined,
            addressA: UniswapV3.Constant.TOKENS["arbitrum"].eth,                       
            addressB: UniswapV3.Constant.TOKENS["arbitrum"].usdc,                       
            chain: "arbitrum",
        }
    },


    // BRIDGE ARBITRUM => BSC
    {
        chain: "arbitrum",
        protocoles: Orbiter,
        op: 'swap',
        args: {
            evmSigner: undefined,
            starkSigner: undefined,
            token: Orbiter.Constant.TOKENS["MAINNET"]["arbitrum"].usdc,
            fromChain: "arbitrum", 
            toChain: "bsc",
            
            amount: "1",
        }
    },

    // BSC
    {
        chain: "bsc",
        protocoles: PancakeswapV3,
        op: 'swap',
        args: {
            signer: undefined,
            path: [ PancakeswapV3.Constant.TOKENS["bsc"].bnb, PancakeswapV3.Constant.TOKENS["bsc"].usdt  ],
            amountIn: null,
            amountOut: "2",
            chain: "bsc",
        }
    },
    {
        chain: "bsc",
        protocoles: PancakeswapV3,
        op: 'addLiquidity',
        args: {
            signer: undefined,
            addressA: PancakeswapV3.Constant.TOKENS["bsc"].bnb,                       
            amountA: null,     
            addressB: PancakeswapV3.Constant.TOKENS["bsc"].usdc,                       
            amountB: null,     
            chain: "bsc",
            options: { max: true } 
        }
    },
    {
        chain: "bsc",
        protocoles: PancakeswapV3,
        op: 'withdrawLiquidity',
        args: {
            signer: undefined,
            addressA: PancakeswapV3.Constant.TOKENS["bsc"].bnb,                       
            addressB: PancakeswapV3.Constant.TOKENS["bsc"].usdc,                       
            chain: "bsc",
        }
    },


    // BRIDGE BSC => AVALANCHE
    {
        chain: "bsc",
        protocoles: Stargate,
        op: 'bridge',
        args: {
            signer: undefined,
            tokenFrom: Stargate.Constant.TOKENS["bsc"].usdt,
            tokenTo: Stargate.Constant.TOKENS["avalanche"].usdt,
            fromChain: "bsc", 
            toChain: "avalanche",
            amount: "1",
        }
    },

    // AVALANCHE
    {
        chain: "avalanche",
        protocoles: SushiswapV3,
        op: 'swap',
        args: {
            signer: undefined,
            path: [ SushiswapV3.Constant.TOKENS["avalanche"].avax, SushiswapV3.Constant.TOKENS["avalanche"].usdc  ],
            amountIn: null,
            amountOut: "2",
            chain: "avalanche",
        }
    },
    {
        chain: "avalanche",
        protocoles: SushiswapV3,
        op: 'addLiquidity',
        args: {
            signer: undefined,
            addressA: SushiswapV3.Constant.TOKENS["avalanche"].avax,                       
            amountA: null,     
            addressB: SushiswapV3.Constant.TOKENS["avalanche"].usdc,                       
            amountB: null,     
            chain: "avalanche",
            options: { max: true } 
        }
    },
    {
        chain: "avalanche",
        protocoles: SushiswapV3,
        op: 'withdrawLiquidity',
        args: {
            signer: undefined,
            addressA: SushiswapV3.Constant.TOKENS["avalanche"].avax,                       
            addressB: SushiswapV3.Constant.TOKENS["avalanche"].usdc,                       
            chain: "avalanche",
        }
    },
]




const main = async() => {

    const evmsigner = new Wallet( process.env.TEST_ETH_PRIVATE_KEY!, ethers.getDefaultProvider("mainnet") )
    const starkSigner = new Account( Orbiter.Constant.MAINNET_PROVIDER, process.env.TEST_STARK_PUBLIC_KEY!, process.env.TEST_STARK_PRIVATE_KEY! )

    try {

        await route.forEach( async( task ) => {

            const fn: any = task.protocoles[ task.op ]
            const args: any = task.args

            // Populate arguments for function
            Object.entries( task.args ).forEach(( [key, value] ) => 
            {
                if ( key === 'signer' || key == "evmSigner" ) args[ key ] = evmsigner
                if ( key == "starkSigner" ) args.starkSigner = starkSigner
            })


            console.log( fn )
            console.log( args )
            console.log( "\n\n" )
            // // Execute task
            // await fn( args )
        })
        
    } catch ( error ) {
        
        throw( error )

    }
}

main()