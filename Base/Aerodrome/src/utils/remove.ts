import { Contract } from "ethers";
import { Pool } from "../../types";
import { RemoveOptions } from "../../types";
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

export const check_remove_inputs = ( options: RemoveOptions ) => {

    if ( options.slipage! < 0 || options.slipage! > 100 )
        throw new Error("Slipage need to be a number between 0 and 100");
    if ( options.percent! <= 0 || options.percent! > 100 )
        throw new Error("Percent need to be set between 0 to 100")
}