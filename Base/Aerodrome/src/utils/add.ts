import { AddOptions, Balance } from "../../types";



export const get_amounts = ( balanceX: Balance, balanceY: Balance, options: AddOptions ) => {

    if ( options.max )
        return { amountX: balanceX.bigint, amountY: balanceY.bigint }

    const amountX = balanceX.bigint * BigInt( options.percent! * 100 ) / BigInt( 100 * 100 )
    const amountY = balanceY.bigint * BigInt( options.percent! * 100 ) / BigInt( 100 * 100 )

    return { amountX, amountY }
}