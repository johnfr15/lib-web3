import { ethers } from "ethers"
const axios = require("axios")

/****************************************
            Gotchiverse
*****************************************/
//Query:https://api.thegraph.com/subgraphs/name/aavegotchi/gotchiverse-matic

// Fetch all nfts currently on sales
export const getParcels = async (first = 10) => {
    const result = await axios({
        url: 'https://api.thegraph.com/subgraphs/name/aavegotchi/gotchiverse-matic',
        method: 'post',
        data: {
            query: `
                query 
                {
                    gotchis(where: {id_in: ["4430", "20695"]}) 
                    {
                        id
                        lastChanneledAlchemica
                    }

                    parcels(first: ${first}) 
                    {
                        equippedInstallations {
                          name
                          level
                          harvestRate
                        }
                        lastChanneledAlchemica
                        coordinateX
                        coordinateY
                        tokenId
                        size
                        parcelId
                        owner
                        lastClaimedAlchemica
                        accessRights {
                          accessRight
                          actionRight
                        }
                    }
                }
            `
        }
    })
    return result.data.data
}
