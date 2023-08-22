import { parse_args } from "./utils"
const axios = require("axios")


/****************************************
            Aavegotchi
*****************************************/
const url = "https://subgraph.satsuma-prod.com/tWYl5n5y04oz/aavegotchi/aavegotchi-core-matic/api"

const d_args = {skip: 0, orderBy: "id", orderDirection: "asc", where: {gotchiId_lt: 5}}


// Fetch all nfts currently on sales
export const aavegotchis = async (args = d_args) => {

    const result = await axios({
        url: url,
        method: 'post',
        data: {
            query: `
                query 
                {
                    aavegotchis(${parse_args(args)}) {
                        gotchiId
                        owner {id}
                        originalOwner {id}
                        portal{
                          gotchiId
                          buyer {id}
                          hauntId
                          status
                          boughtAt
                          openedAt
                          claimedAt
                          timesTraded
                          historicalPrices
                          activeListing
                        }
                        hauntId
                        name
                        randomNumber
                        status
                        modifiedNumericTraits
                        withSetsNumericTraits
                        equippedWearables
                        equippedSetID
                        equippedSetName
                        possibleSets
                        collateral
                        escrow
                        stakedAmount
                        minimumStake
                        kinship
                        lastInteracted
                        experience
                        toNextLevel
                        usedSkillPoints
                        level
                        baseRarityScore
                        modifiedRarityScore
                        withSetsRarityScore
                        locked
                        historicalPrices
                           activeListing
                            lending
                      }
                }
            `
        }
    })
    return result.data.data
}

