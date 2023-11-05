import { Balance } from "../../types";
import { AddOptions } from "../../types/add";



export const get_amounts = ( balanceX: Balance, balanceY: Balance, options: AddOptions ) => {

    if ( options.max )
        return { amountX: balanceX.bigint, amountY: balanceY.bigint }

    const amountX = balanceX.bigint * BigInt( options.percent! * 100 ) / BigInt( 100 * 100 )
    const amountY = balanceY.bigint * BigInt( options.percent! * 100 ) / BigInt( 100 * 100 )

    return { amountX, amountY }
}

export const check_add_inputs = ( amountA: string | null, amountB: string | null, options: AddOptions ) => {

    if ( options!.slipage! < 0.01 || options!.slipage! > 100 )
        throw("Slipage need to be a number between 2 and 100");
    if ( amountA === null && amountB === null && options!.max === false && options.percent === undefined )
        throw("Need to provide at least a value for 'amountA' or 'amountB' or set max or percent");
    if ( options.percent && (options.percent! <= 0 || options.percent! > 100) )
        throw("Percent need to be set between 0 to 100")
}