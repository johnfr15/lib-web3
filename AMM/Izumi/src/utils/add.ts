import { Contract, Wallet } from "ethers";
import { Token, Chains } from "../../types";
import { CONTRACTS, LIQUIDITY_MANAGER_ABI } from "../../config/constants";

export const get_token_id = async( 
    tokenA: Token, 
    tokenB: Token, 
    chain: Chains, 
    signer: Wallet, 
): Promise<number | undefined> => {
    
    try {
        
        const NftManager = new Contract( CONTRACTS[ chain ].periphery.liquidityManager, LIQUIDITY_MANAGER_ABI, signer )
        const balance = await NftManager.balanceOf( signer.address )

        for( let i = 0; i < balance; i++ )
        {
            const id = await NftManager.tokenOfOwnerByIndex( signer.address, i )
            let position = await NftManager.positions( id )
        }

        return undefined
        
    } catch (error) {
        
        throw( error )

    }
}