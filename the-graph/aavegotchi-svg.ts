import { parse_args } from "./utils"
const axios = require("axios")


/****************************************
            Aavegotchi SVG
*****************************************/
const url = "https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-svg"

const d_args = {orderBy: "id", orderDirection: "asc", where: {id_lt: 5}}


// Fetch all nfts currently on sales
export const svg = async (args = d_args) => {

    const result = await axios({
        url: url,
        method: 'post',
        data: {
            query: `
                query 
                {
                    aavegotchis(${parse_args(args)})
                    {
                        id
                        svg
                        left
                        right
                        back
                    }
                }
            `
        }
    })
    return result.data.data
}

