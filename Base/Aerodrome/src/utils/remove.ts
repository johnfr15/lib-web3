import { Contract } from "ethers";
import { Pool } from "../../types";
import { DEFAULT_FACTORY } from "../../config/constants";

export const get_amounts = async( pool: Pool, liquidity: bigint, Router: Contract ): Promise<[ bigint, bigint ]> => {

    const { tokenX, tokenY, stable } = pool

    const amounts: [ bigint, bigint ] = await Router.quoteRemoveLiquidity(
        tokenY.address,
        tokenX.address,
        stable,
        DEFAULT_FACTORY,
        liquidity
    )

    return amounts
}