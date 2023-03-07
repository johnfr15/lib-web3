// import { ethers } from "ethers"
// const axios = require("axios")

// /****************************************
//             Aavegotchi
// *****************************************/
// //Query:https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic

// // Fetch all nfts currently on sales
// export const getNftOnSale = async () => {
//     const result = await axios({
//         url: 'https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic',
//         method: 'post',
//         data: {
//             query: `
//                 query {
//                     sales(where: {status: "1"}, orderBy: saleId, orderDirection: desc) 
//                     {
//                         id
//                         saleId
//                         nftId
//                         status
//                         price
//                         seller
//                         collection
//                     }
//                 }
//             `
//         }
//     })
//     return result.data.data.sales
// }

// // Fetch only the nfts put on sale by the user
// export const onSaleOwned = async (address) => {
    
//     let result 
//     try {
//     result = await axios({
//         url: 'https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic',
//         method: 'post',
//         data: {
//             query: `
//                 query {
//                     sales(where: {seller: "${address}", status: 1}, orderBy: saleId, orderDirection: asc) 
//                     {
//                         id
//                         saleId
//                         nftId
//                         status
//                         price
//                         seller
//                         collection
//                     }
//                 }
//             `
//         }
//     })
//     result = result.data.data.sales
//     } catch (error) {
//         result = []
//     }
//     return result
// }

// /****************************************
//                 SRO.sol
// *****************************************/
// //Query: https://api.thegraph.com/subgraphs/name/johnfr14/sro


// // fetch all the nfts created so far
// export const nfts = async () => {
//     const result = await axios({
//         url: 'https://api.thegraph.com/subgraphs/name/johnfr14/sro',
//         method: 'post',
//         data: {
//         query: `
//             query {
//                 nfts {
//                     id
//                     nftId
//                     title
//                     description
//                     timeStamp
//                     author {id}
//                     owner {id}
//                     royalties
//                     likeCount
//                     liked (where: {isLiked: true}){
//                         userAddress
//                     }
//                     url
//                   }
//             }
//         `
//         }
//     })
//     return result.data.data.nfts
// }

// // Fetch only the nfts created by the user
// export const created = async (address) => {
//     let result 
//     try {
//     result = await axios({
//         url: 'https://api.thegraph.com/subgraphs/name/johnfr14/sro',
//         method: 'post',
//         data: {
//             query: `
//                 query {
//                     user (id: "${address.toLowerCase()}"){
//                         created {
//                           id
//                           nftId
//                           title
//                           description
//                           timeStamp
//                           author {id}
//                           owner {id}
//                           royalties
//                           likeCount
//                           liked (where: {isLiked: true}) {
//                             userAddress
//                           }
//                           url
//                         }
//                     }
//                 }
//             `
//         }
//     })
//     } catch (error) {
//         result = []
//     }
//     return result.data.data.user.created
// }

// // Fetch only the owned created by the user
// export const owned = async (address) => {
//     let result 
//     try {
//     result = await axios({
//         url: 'https://api.thegraph.com/subgraphs/name/johnfr14/sro',
//         method: 'post',
//         data: {
//             query: `
//                 query {
//                     user (id: "${address.toLowerCase()}"){
//                         owned {
//                           id
//                           nftId
//                           title
//                           description
//                           timeStamp
//                           author {id}
//                           owner {id}
//                           royalties
//                           likeCount
//                           liked (where: {isLiked: true}) {
//                             userAddress
//                           }
//                           url
//                         }
//                     }
//                 }
//             `
//         }
//     })
//     } catch (error) {
//         result = []
//     }
//     return result.data.data.user.owned
// }

// // Fetch the nft by his id
// export const getNftById = async (nftId) => {
//     let result = null
//     let sale = null
//     try {
//     result = await axios({
//         url: 'https://api.thegraph.com/subgraphs/name/johnfr14/sro',
//         method: 'post',
//         data: {
//             query: `
//                 query {
//                     nft (id: "${nftId}") {
//                         id
//                         nftId
//                         title
//                         description
//                         timeStamp
//                         author {id}
//                         owner {id}
//                         royalties
//                         likeCount
//                         liked (where: {isLiked: true}){userAddress}
//                         url    
//                       }
//                 }
//             `
//         }
//     })

//     sale = await axios({
//         url: 'https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic',
//         method: 'post',
//         data: {
//             query: `
//                 query {
//                     sales (where: {nftId: "${result.data.data.nft.nftId}", status: "1"}){
//                         id
//                         saleId
//                         nftId
//                         status
//                         price
//                         seller {id}
//                         collection
//                       }
//                 }
//             `
//         }
//     })

//     if (sale.data.data.sales.length > 0) {
//         sale = sale.data.data.sales[0]
//         sale.price = ethers.utils.formatEther(sale.price)
//     } else {
//         sale = defaultCardData.sale
//     }

//     } catch (error) {
//         result = {}
//     }
//     return {...result.data.data.nft, sale: sale }
// }