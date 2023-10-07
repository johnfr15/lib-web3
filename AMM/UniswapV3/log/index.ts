import { ERC20_ABI, TOKENS } from "../config/constants"
import { Wallet, ethers, Contract } from "ethers"
import { Chains } from "../types"


export const log_balances = async(signer: Wallet, chain: Chains) => {

    const Dai  = new Contract(TOKENS[ chain ].dai, ERC20_ABI, signer)
    const Usdc = new Contract(TOKENS[ chain ].usdc, ERC20_ABI, signer)
    const Usdt = new Contract(TOKENS[ chain ].usdt, ERC20_ABI, signer)
    const Weth = new Contract(TOKENS[ chain ].weth9, ERC20_ABI, signer)

    const nativeBalance = await signer.provider!.getBalance( signer.address ) 
    const daiBalance    = await Dai.balanceOf( signer.address ) 
    const usdcBalance   = await Usdc.balanceOf( signer.address ) 
    const usdtBalance   = await Usdt.balanceOf( signer.address ) 
    const wethBalance   = await Weth.balanceOf( signer.address ) 

    console.log("\n")
    console.log( "Balance NATIVE: ", ethers.formatUnits( nativeBalance ) )
    console.log( "Balance DAI:    ", ethers.formatUnits( daiBalance ) )
    console.log( "Balance USDC:   ", ethers.formatUnits( usdcBalance, 6) )
    console.log( "Balance USDT:   ", ethers.formatUnits( usdtBalance, 6) )
    console.log( "Balance WETH:   ", ethers.formatUnits( wethBalance, 18) )
    console.log("\n")
}