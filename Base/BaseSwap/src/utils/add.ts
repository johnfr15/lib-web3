import { Token } from "../../types";
import { AddOptions } from "../../types";
import { Contract, Wallet } from "ethers";
import { is_position, parse_position } from ".";
import { CONTRACTS, NFT_MANAGER_ABI } from "../../config/constants";

export const get_token_id = async( 
    tokenA: Token, 
    tokenB: Token, 
    signer: Wallet, 
): Promise<number | undefined> => {
    
    try {
        
        const NftManager = new Contract( CONTRACTS.NFT_MANAGER, NFT_MANAGER_ABI, signer )
        const balance = await NftManager.balanceOf( signer.address )

        for( let i = 0; i < balance; i++ )
        {
            const id = await NftManager.tokenOfOwnerByIndex( signer.address, i )
            let position = await NftManager.positions( id )
            position = parse_position( position, id )

            if ( is_position( position, tokenA, tokenB ) )
                return id
        }

        return undefined
        
    } catch (error) {
        
        throw( error )

    }
}

export const check_add_inputs = ( amountA: string | null, amountB: string | null, options: AddOptions ) => {

    if ( options!.slipage! < 0.01 || options!.slipage! > 100 )
        throw("Slipage need to be a number between 2 and 100");
    if ( amountA === null && amountB === null && options!.max === false && options.percent === undefined )
        throw("Need to provide at least a value for 'amountA' or 'amountB' or set max or percent");
    if ( options.percent && (options.percent! <= 0 || options.percent! > 100) )
        throw("Percent need to be set between 0 to 100")
}