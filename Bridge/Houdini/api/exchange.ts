import axios from "axios"
import { HOUDINI_URL, PARTNER_ID, SECRET } from "../config/constants"
import { ExchangeOrder, Order } from "../types"

const ENDPOINT = '/exchange'

export const create_order = async( data: ExchangeOrder ): Promise<Order> => {

    const url = HOUDINI_URL + ENDPOINT
    const headers = {
        'Authorization': `${ PARTNER_ID }:${ SECRET }`,
        'Content-Type': 'application/json'
    }

    try {
        
        console.log("Creating order...")

        const res = await axios.post( url, data, { headers } )
        const order: Order = res.data

        console.log("\nOrder created !")
        console.log("Order id: ", order.houdiniId )

        return order

    } catch ( error: any ) {

        throw( error )

    }
}