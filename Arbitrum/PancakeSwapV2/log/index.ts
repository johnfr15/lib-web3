import { ERC20_ABI, TOKENS } from "../config/constants"
import { Wallet, ethers, Contract } from "ethers"


export const log_balances = async(signer: Wallet, network: 'TESTNET' | 'MAINNET') => {

    const Dai  = new Contract(TOKENS[ network ].dai, ERC20_ABI, signer)
    const Usdc = new Contract(TOKENS[ network ].usdc, ERC20_ABI, signer)
    const Usdt = new Contract(TOKENS[ network ].usdt, ERC20_ABI, signer)
    const Weth = new Contract(TOKENS[ network ].weth, ERC20_ABI, signer)


    const ethBalance   = await signer.provider!.getBalance( signer.address ) 
    const daiBalance   = await Dai.balanceOf( signer.address ) 
    const usdcBalance  = await Usdc.balanceOf( signer.address ) 
    const usdtBalance  = await Usdt.balanceOf( signer.address ) 
    const wethBalance  = await Weth.balanceOf( signer.address ) 

    console.log("\n")
    console.log( "Balance ETH:   ", ethers.formatEther( ethBalance ) )
    console.log( "Balance DAI:   ", ethers.formatEther( daiBalance ) )
    console.log( "Balance USDC:  ", ethers.formatUnits( usdcBalance, 6) )
    console.log( "Balance USDT:  ", ethers.formatUnits( usdtBalance, 6) )
    console.log( "Balance WETH:  ", ethers.formatEther( wethBalance) )
    console.log("\n")
}