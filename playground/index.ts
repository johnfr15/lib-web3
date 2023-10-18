import dotenv from "dotenv"
import { AddressLike, ethers, Wallet } from "ethers"
import { Account } from "starknet"
import starknet from "starknet"
import UniswapV3 from "../AMM/UniswapV3"
import SushiswapV3 from "../AMM/SushiSwapV3"
import PancakeswapV3 from "../AMM/PancakeswapV3"
import Mute from "../ZkSync/Mute"
import l0kswap from "../Starknet/10kSwap"
import Orbiter from "../Bridge/Orbiter"
import Stargate from "../Bridge/Stargate"
import { resolve_chain } from "../Bridge/Bungee/utils"
import { Chains } from "../Bridge/Bungee/type/types"

dotenv.config()

const route: any[] = [

    // POLYGON
    {
        chain: "polygon",
        protocols: UniswapV3,
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
        protocols: UniswapV3,
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
        protocols: UniswapV3,
        op: 'withdrawLiquidity',
        args: {
            signer: undefined,
            addressA: UniswapV3.Constant.TOKENS["polygon"].matic,                       
            addressB: UniswapV3.Constant.TOKENS["polygon"].usdc,                       
            chain: "polygon",
        }
    },

    








    // BRIDGE POLYGON => BSC
    {
        chain: "polygon",
        action: "bridge",
        protocols: Orbiter,
        op: 'swap',
        args: {
            evmSigner: undefined,
            starkSigner: undefined,
            token: Orbiter.Constant.TOKENS["MAINNET"]["polygon"].usdc,
            fromChain: "polygon", 
            toChain: "bsc",
            
            max: true,
            network: 'MAINNET'
        },
        targetChain: "bsc",
        targetToken: Orbiter.Constant.TOKENS["MAINNET"]["bsc"].usdc,
    },










    // BSC
    {
        chain: "bsc",
        protocols: PancakeswapV3,
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
        protocols: PancakeswapV3,
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
        protocols: PancakeswapV3,
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
        action: "bridge",
        protocols: Stargate,
        op: 'bridge',
        args: {
            signer: undefined,
            tokenFrom: Stargate.Constant.TOKENS["bsc"].usdt,
            tokenTo: Stargate.Constant.TOKENS["avalanche"].usdt,
            fromChain: "bsc", 
            toChain: "avalanche",
            amount: null,
            options: { max: true }
        },
        targetChain: "avalanche",
        targetToken: Stargate.Constant.TOKENS["avalanche"].usdt,
    },










    // AVALANCHE
    {
        chain: "avalanche",
        protocols: SushiswapV3,
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
        protocols: SushiswapV3,
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
        protocols: SushiswapV3,
        op: 'withdrawLiquidity',
        args: {
            signer: undefined,
            addressA: SushiswapV3.Constant.TOKENS["avalanche"].avax,                       
            addressB: SushiswapV3.Constant.TOKENS["avalanche"].usdc,                       
            chain: "avalanche",
        }
    },











    // BRIDGE AVALANCHE => ARBITRUM
    {
        chain: "avalanche",
        action: "bridge",
        protocols: Stargate,
        op: 'bridge',
        args: {
            signer: undefined,
            tokenFrom: Stargate.Constant.TOKENS["avalanche"].usdt,
            tokenTo: Stargate.Constant.TOKENS["arbitrum"].usdc,
            fromChain: "avalanche", 
            toChain: "arbitrum",
            amount: null,
            options: { max: true }
        },
        targetChain: "arbitrum",
        targetToken: Stargate.Constant.TOKENS["arbitrum"].usdc,
    },










    // ARBITRUM
    {
        chain: "arbitrum",
        protocols: UniswapV3,
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
        protocols: UniswapV3,
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
        protocols: UniswapV3,
        op: 'withdrawLiquidity',
        args: {
            signer: undefined,
            addressA: UniswapV3.Constant.TOKENS["arbitrum"].eth,                       
            addressB: UniswapV3.Constant.TOKENS["arbitrum"].usdc,                       
            chain: "arbitrum",
        }
    },









    // BRIDGE ARBITRUM => ZKSYNC
    {
        chain: "arbitrum",
        action: "bridge",
        protocols: Orbiter,
        op: 'swap',
        args: {
            evmSigner: undefined,
            starkSigner: undefined,
            token: Orbiter.Constant.TOKENS["MAINNET"]["arbitrum"].usdc,
            fromChain: "arbitrum", 
            toChain: "zksync",
            
            max: true,
            network: 'MAINNET'
        },
        targetChain: "zksync",
        targetToken: Orbiter.Constant.TOKENS["MAINNET"]["zksync"].usdc,
    },









    // ZKSYNC
    {
        chain: "zksync",
        protocols: Mute,
        op: 'swap',
        args: {
            signer: undefined,
            path: [ Mute.Constant.TOKENS['MAINNET'].eth, Mute.Constant.TOKENS['MAINNET'].usdc  ],
            amountIn: "0.0002",
            network: 'MAINNET'
        }
    },
    {
        chain: "zksync",
        protocols: Mute,
        op: 'addLiquidity',
        args: {
            signer: undefined,
            addressA: Mute.Constant.TOKENS['MAINNET'].eth,                       
            amountA: null,     
            addressB: Mute.Constant.TOKENS['MAINNET'].usdc,                       
            amountB: null,     
            max: true,
            network: 'MAINNET'
        }
    },
    {
        chain: "zksync",
        protocols: Mute,
        op: 'withdrawLiquidity',
        args: {
            signer: undefined,
            addressA: Mute.Constant.TOKENS['MAINNET'].eth,                       
            addressB: Mute.Constant.TOKENS['MAINNET'].usdc,
            percent: 100,
            network: 'MAINNET'                 
        }
    },









    // BRIDGE ZKSYNC => STARKNET
    {
        chain: "zksync",
        action: "bridge",
        protocols: Orbiter,
        op: 'swap',
        args: {
            evmSigner: undefined,
            starkSigner: undefined,
            token: Orbiter.Constant.TOKENS["MAINNET"]["arbitrum"].usdc,
            fromChain: "zksync", 
            toChain: "starknet",
            
            max: true,
            network: 'MAINNET'
        },
        targetChain: "starknet",
        targetToken: Orbiter.Constant.TOKENS["MAINNET"]["starknet"].usdc,
    },









    // STARKNET
    {
        chain: "starknet",
        protocols: l0kswap,
        op: 'swap',
        args: {
            signer: undefined,
            path: [ l0kswap.Constant.TOKENS['MAINNET'].eth, l0kswap.Constant.TOKENS['MAINNET'].usdc  ],
            amountIn: null,
            amountOut: "2",
            network: 'MAINNET'
        }
    },
    {
        chain: "starknet",
        protocols: l0kswap,
        op: 'addLiquidity',
        args: {
            signer: undefined,
            addressA: l0kswap.Constant.TOKENS['MAINNET'].eth,                       
            amountA: null,     
            addressB: l0kswap.Constant.TOKENS['MAINNET'].usdc,                       
            amountB: null,     
            max: true,
            network: 'MAINNET'
        }
    },
    {
        chain: "starknet",
        protocols: l0kswap,
        op: 'withdrawLiquidity',
        args: {
            signer: undefined,
            addressA: l0kswap.Constant.TOKENS['MAINNET'].eth,                       
            addressB: l0kswap.Constant.TOKENS['MAINNET'].usdc,
            percent: 100,
            network: 'MAINNET'                 
        }
    },
]




const main = async() => {

    let evmsigner = new Wallet( process.env.ETH_PRIVATE_KEY!, ethers.getDefaultProvider("mainnet") )
    const starkSigner = new Account( Orbiter.Constant.STARKNET_TESTNET_PROVIDER, process.env.ACCOUNT_ADDRESS!, process.env.PRIVATE_KEY! )



    // UniswapV3.Log.log_balances( evmsigner, "arbitrum" )

    // listen_token( evmsigner, UniswapV3.Constant.TOKENS.arbitrum.usdc, 'arbitrum' )

    // UniswapV3.swap( 
    //     evmsigner, 
    //     [ UniswapV3.Constant.TOKENS.arbitrum.eth, UniswapV3.Constant.TOKENS.arbitrum.usdc ],
    //     '0.000001',
    //     null,
    //     "arbitrum"
    // )

    try {

        await route.forEach( async( task ) => 
        {
            const fn: any = task.protocols[ task.op ]
            const args: any = task.args

            

            // Populate arguments for function
            Object.entries( task.args ).forEach(( [key, value] ) => 
            {
                if ( key === 'signer' || key == "evmSigner" )
                {
                    evmsigner = resolve_chain( evmsigner, task.chain )
                    args[ key ] = evmsigner
                } 
                if ( key === 'signer' && task.chain === 'starknet') args[ key ] = starkSigner
                if ( key == "starkSigner" ) args.starkSigner = starkSigner
            })


            console.log( fn )
            console.log( args )
            console.log( "\n\n" )
            // // Execute task
            // await fn( args )

            if ( task.action === 'bridge' && task.targetChain !== 'starknet')
                await listen_token( evmsigner, task.targetToken, task.targetChain )
        })

        
    } catch ( error ) {
        
        throw( error )

    }
    

}


const listen_token = async(signer: Wallet, tokenAddress: AddressLike, chain: Chains) => {

    signer = resolve_chain( signer, chain )
    const tokenABI = ['event Transfer(address indexed from, address indexed to, uint256 value)', 'function decimals()'];

    const tokenContract = new ethers.Contract( tokenAddress as string, tokenABI, signer );
    const decimals: number = await tokenContract.decimals()

    console.log(`Listening on ${ chain } for token: ${ tokenAddress }...`)
    await tokenContract.once('Transfer', (from, to, value, event) => {

        if ( to === signer.address ) {
          console.log(`Received ${ ethers.formatUnits( value, decimals ) } from ${from} !`);
          // Trigger your custom function here
        }
    });
}

const listen_starknet_token = async( signer: Account, tokenAddress: string ) => {

    const provider = Orbiter.Constant.MAINNET_PROVIDER
    let continuation_token = undefined
    let currBlock = 0

    while (true) 
    {
        const block = await provider.getBlock()

        const events: any = await provider.getEvents({
            from_block: "latest" as any,
            to_block: "latest" as any,
            chunk_size: 10,
        })


        if ( events.continuation_token !== continuation_token)
        {
            for( let event of events.events )
            {
                if ( event.fromAddress === tokenAddress.toLowerCase() )
                    console.log( event )
            }
        }

    
    }
}


main()