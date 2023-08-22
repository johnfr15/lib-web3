import { ethers } from "ethers"
const axios = require("axios")

/****************************************
            Baazaar
*****************************************/
const url = "https://subgraph.satsuma-prod.com/tWYl5n5y04oz/aavegotchi/aavegotchi-core-matic/api"


// Fetch all nfts currently on sales
export const getParcels = async (first = 10) => {
    const result = await axios({
        url: url,
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