import { Contract, Wallet } from "ethers";
import { Token, Chains, State } from "../../types";
import { CONTRACTS, LIQUIDITY_MANAGER_ABI } from "../../config/constants";




export const get_amounts = async( tokenId: number, liquidity: bigint, deadline: number, NftManager: Contract ): Promise<{amount0: bigint, amount1: bigint}> => {

    try {
        const args = {
            tokenId: tokenId,
            liquidity: liquidity,
            amount0Min: 0,
            amount1Min: 0,
            deadline: deadline,
        }

        const amounts = await NftManager.decreaseLiquidity.staticCall( args )

        return { amount0: amounts[0], amount1: amounts[1] }

    } catch (error) {
     
        throw( error )

    }
}