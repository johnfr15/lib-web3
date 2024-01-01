import { Balance, Pool } from "../../types";
import { RemoveOptions } from "../../types/remove";

export const get_amounts = async( pool: Pool, liquidityBalance: Balance, options: RemoveOptions ): Promise<[ bigint, bigint, bigint ]> => {

    const { reserveX, reserveY, Pool } = pool

    const total_liquidity: bigint = await Pool.totalSupply()
    const liquidity: bigint = liquidityBalance.bigint * BigInt( options.percent! * 100 ) / BigInt( 100 * 100 )

    const amountX = reserveX * liquidity / total_liquidity
    const amountY = reserveY * liquidity / total_liquidity

    return [ amountX, amountY, liquidity ]
}

export const check_remove_inputs = ( options: RemoveOptions ) => {

    if ( options.slipage! < 0 || options.slipage! > 100 )
        throw new Error("Slipage need to be a number between 0 and 100");
    if ( options.percent! <= 0 || options.percent! > 100 )
        throw new Error("Percent need to be set between 0 to 100")
}