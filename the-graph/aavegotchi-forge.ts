import { ethers } from "ethers"
const axios = require("axios")

/****************************************
            Gotchiverse
*****************************************/
//Query: https://api.thegraph.com/subgraphs/name/sudeepb02/aavegotchi-forge-subgraph


// Fetch all nfts currently on sales
export const undefined = async (first = 10) => {
    const result = await axios({
        url: 'https://api.thegraph.com/subgraphs/name/sudeepb02/aavegotchi-forge-subgraph',
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
