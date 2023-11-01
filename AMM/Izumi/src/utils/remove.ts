import { Contract } from "ethers";
import { Liquidity } from "../../types/add";
import { DecreaseLiquidity } from "../../types/remove";




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