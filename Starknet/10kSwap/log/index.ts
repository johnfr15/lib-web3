import { Account, Contract } from "starknet"
import { ERC20_ABI, TOKENS } from "../constant"
import { Uint256_to_string } from "../utils"


export const log_balances = async(signer: Account, network: 'TESTNET' | 'MAINNET') => {

    const Dai = new Contract(ERC20_ABI, TOKENS[ network ].dai, signer)
    const Eth = new Contract(ERC20_ABI, TOKENS[ network ].eth, signer)
    const Usdc = new Contract(ERC20_ABI, TOKENS[ network ].usdc, signer)
    const Usdt = new Contract(ERC20_ABI, TOKENS[ network ].usdt, signer)

    const { balance: daiBalance }  = await Dai.balanceOf( signer.address ) 
    const { balance: ethBalance }  = await Eth.balanceOf( signer.address ) 
    const { balance: usdcBalance } = await Usdc.balanceOf( signer.address ) 
    const { balance: usdtBalance } = await Usdt.balanceOf( signer.address ) 

    console.log( "Balance DAI:  ", Uint256_to_string( daiBalance ) )
    console.log( "Balance ETH:  ", Uint256_to_string( ethBalance ) )
    console.log( "Balance USDC: ", Uint256_to_string( usdcBalance, 6) )
    console.log( "Balance USDT: ", Uint256_to_string( usdtBalance, 6) )
    console.log("\n")
}