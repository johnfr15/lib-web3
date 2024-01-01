import { Contract } from "ethers";
import { Liquidity } from "../../types/add";
import { DecreaseLiquidity } from "../../types/remove";
import { RemoveOptions } from "../../types";




export const get_amounts = async( position: Liquidity, deadline: number, NftManager: Contract ): Promise<{amountX: bigint, amountY: bigint}> => {

    try {

        const args: DecreaseLiquidity = {
            lid: position.tokenId,
            liquidDelta: position.liquidity,
            amountXMin: BigInt( 0 ),
            amountYMin: BigInt( 0 ),
            deadline: deadline,
        }

        const amounts = await NftManager.decLiquidity.staticCall( ...Object.values( args ) )

        return { amountX: amounts[0], amountY: amounts[1] }

    } catch (error) {
     
        throw( error )

    }
}

export const check_remove_inputs = ( options: RemoveOptions ) => {

    if ( options.slipage! < 0 || options.slipage! > 100 )
        throw new Error("Slipage need to be a number between 0 and 100");
    if ( options.percent! <= 0 || options.percent! > 100 )
        throw new Error("Percent need to be set between 0 to 100")
}