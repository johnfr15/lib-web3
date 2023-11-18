// import { topUpGasToken } from '../_functions/helpers/top-up-gas-token'
// import { ActionActivityReport, BotStatistics, Counters, DummyWallet, RouteAction, Signer, Status } from "../_models/interfaces";
// import TokenPriceData from '../_data/input/token_price_data.json';
// import { addLiquidity, borrow, bridge, lend, mint, swap, withdrawLiquidity } from "../_functions/actions";
// import { SwapOptions } from "../_models/interfaces";
// import { MongoClient } from "mongodb";

// // Data imported
// import BotStatisticsData from '../_data/input/bot_statistics.json';
// import DummyWalletData from '../_data/input/dummy_wallet_data.json';

// // Data assigned
// const botStatisticsData = BotStatisticsData;
// const dummyWalletData = DummyWalletData;

// // Collections
// const collectionNameBotStatistics = 'botstatistics';
// const collectionNameDummyWallet = 'dummywallet';
// const collectionNameTrxs = 'trxs';

// export async function doActionOld(
//   randomNumbersArray: number[],
//   routeAction: RouteAction
//   ): Promise<any> {

//     let mongoClient;
//     let db;

//     try {
      
//       // Database connection
//       const url = 'mongodb://localhost:27017'; // MongoDB connection URL
//       const dbName = 'dropbot'; // Database name
//       mongoClient = new MongoClient(url);
//       await mongoClient.connect();
//       db = mongoClient.db(dbName);

  
//       if(db) {
//         const botStatisticCollection = db.collection(collectionNameBotStatistics);
//         const dummyWalletCollection = db.collection(collectionNameDummyWallet);
//         const trxsCollection = db.collection(collectionNameTrxs);
//       }
       
//       if(mongoClient) {
//         await mongoClient.close();
//       }
    


//       // await collectionTrxs.insertOne({ 
//       //   actionType: 'swap',
//       //   amountIn: '1',
//       //   amountOut: '1',
//       //   blockchain: 'arbitrum',
//       //   botId: 'bot ID',
//       //   gasSpent: '0.001',
//       //   hashId: 'hash ID',
//       //   protocol: 'uniswap',
//       //   status: 'success',
//       //   timestamp: new Date(),
//       //   tokenIn: 'eth',
//       //   tokenOut: 'usdc',
//       //   valueIn: '1',
//       //   valueOut: '1',
//       //   walletId: 'wallet ID'
//       // });

//       // const tokenPriceData: any = TokenPriceData;

//       const trxCounter: Counters = {
//         borrowCount: 0,
//         lendCount: 0,
//         liquidityCount: 0,
//         nftCount: 0,
//         swapCount: 0,
//       };

//       if(routeAction.type === 'add liquidity') {
//         console.log('call the addLiquidity function');
//       } else if(routeAction.type === 'borrow') {
//         console.log('call the borrow function');
//       } else if(routeAction.type === 'bridge') {
//         console.log('call the bridge function');
//       } else if(routeAction.type === 'lend') {
//         console.log('call the lend function');
//       } else if(routeAction.type === 'mint') {
//         console.log('call the mint function');
//       } else if(routeAction.type === 'swap') {






//         console.log('call the swap function');

//         const tokenA = 'eth';
//         const tokenB = 'usdc';

//         const swapAmountPercentageMin = 10;
//         const swapAmountPercentageMax = 100;
//         const minimumWalletBalanceAllowed = 50;
        
//         const gasFee = 0.001;

//         // const signer: Signer = dummyWallet.signer;
//         const path: [string, string] =[tokenA, tokenB];
//         const amountIn = '1';
//         const amountOut = '1';
//         const chain: string = routeAction.blockchain;
//         const protocol: string = routeAction.protocol;

//         // @ todo - perform all checks and helper functions here.

//         const trx = await swap(
//           signer,
//           path,
//           amountIn,
//           amountOut,
//           chain,
//           protocol,
//           db
//         )

//         // Bot Statistics 
//         // GAS USED

//         // TRXCOUNT

//           // BLOCKCHAIN

//           // PROTOCOL

//           // ACTION TYPE	

//         // TRXVOLUME

//         //	BLOCKCHAIN

//         // PROTOCOL

//         // ACTION TYPE	

//         const activityReport: ActionActivityReport = {
//           dummyWallet,
//           routeAction,
//           status: Status.Success,
//           trxCounter,
//           trxDetails: {
//               amountIn: 0,
//               amountOut: 0,
//               tokenA: 'eth',
//               tokenB: 'usdc'
//           },
//           trxHash: '0x...'
//         }

//       } else if(routeAction.type === 'withdraw liquidity') {
//         console.log('call the withdrawLiquidity function');
//       }


//     } catch(e) {
//       console.log(e);
//     } finally {
//       if(mongoClient) {
//         await mongoClient.close();
//       }
//     }

// }



// //   // Print dummyWallet balances before action
// //   // const balanceTokenA: number = tempUpdatedDummyWallet.balances[actionBlockchain][tokenA].amount;
// //   // const balanceTokenA: number = tempUpdatedDummyWallet.balances.find(b => b.name === actionBlockchain).tokens.find(t => t.name === tokenA).amount;
// //   const balanceTokenA = 0;
// //   // const balanceTokenA: number = tempUpdatedDummyWallet.balances
// //   //   .filter(blockchain => blockchain.name === actionBlockchain)[0].tokens
// //   //   .filter(token => token.name === tokenA)[0].amount;

// //   // console.log("balanceTokenA: ", balanceTokenA);
  

// //   // const balanceTokenB: number = tempUpdatedDummyWallet.balances
// //   //   .filter(blockchain => blockchain.name === actionBlockchain)[0].tokens
// //   //   .filter(token => token.name === tokenB)[0].amount;

// //     const balanceTokenB = 0;

// // // console.log("balanceTokenA: ", balanceTokenA);
// // // console.log("balanceTokenB: ", balanceTokenB);

// //   console.log("------------------------------------------------------------");
// //   console.log(`Description: ${routeAction.type} using ${routeAction.protocol} on ${routeAction.blockchain}`);
// //   console.log("\n");
  
// //   // // call the function supplied
// //   if(actionType === 'swap') {
// //     console.log('routeAction.type === swap');
// //     console.log(`Starting ${tokenA} balance: `, balanceTokenA);
// //     console.log(`Starting ${tokenB} balance: `, balanceTokenB);
// //     // if(totalWalletUsdBalance < minimumWalletBalanceAllowed) {
// //     if(balanceTokenA >= balanceTokenB) {

// //       if(51 < minimumWalletBalanceAllowed) {
// //         console.log('insufficient funds for the swap, please top up gas tokens.');
// //         await topUpGasToken(actionBlockchain);
// //       }
// //       // swap eth for usdc
// //       // console.log(`${tokenA} >= ${tokenB}`);
// //       const tempRandomNumber: number = randomNumbersArray.splice(0, 1)[0];
// //       const percentageAmountToSwap  = ((tempRandomNumber * (swapAmountPercentageMax- swapAmountPercentageMin)) + (swapAmountPercentageMin/100))/100;
// //       // console.log("Percentage amount to swap: ", percentageAmountToSwap);
// //       const amountTokenA = balanceTokenA * percentageAmountToSwap;
// //       // const amountTokenB = amountTokenA * (tokenPriceData[tokenB]);
// //       const amountTokenB = amountTokenA * (tokenPriceData[tokenA]);
      
// //       console.log("tokenPriceData[tokenA]: ", tokenPriceData[tokenA])
// //       console.log("amountTokenA: ", amountTokenA)
// //       console.log("amountTokenB: ", amountTokenB)
// //       const newbalanceTokenA = balanceTokenA - amountTokenA;
// //       const newbalanceTokenB = balanceTokenB + (amountTokenA * (tokenPriceData[tokenA]));

// //       console.log(`Swapping ${amountTokenA} ${tokenA} to ${amountTokenB} ${tokenB}`);

// //       // Update balances on tempUpdatedDummyWallet
// //       // tempUpdatedDummyWallet.balances.filter(blockchain => blockchain.name === actionBlockchain)[0].tokens.filter(token => token.name === tokenA)[0].amount = newbalanceTokenA * tokenPriceData[tokenA];
// //       // tempUpdatedDummyWallet.balances.filter(blockchain => blockchain.name === actionBlockchain)[0].tokens.filter(token => token.name === tokenB)[0].value = newbalanceTokenB * tokenPriceData[tokenB];

//       // counters = {
//       //   borrowCount: 0,
//       //   lendCount: 0,
//       //   liquidityCount: 0,
//       //   nftCount: 0,
//       //   swapCount: 1
//       // }

// //       activityReport = {
// //         action,
// //         status: Status.Success,
// //         trxDetails: {
// //             fromAmount: amountTokenA * (tokenPriceData[tokenA]),
// //             toAmount: amountTokenA * (tokenPriceData[tokenA]),
// //             tokenA,
// //             tokenB
// //         },
// //         trxHash: '0x...',
// //         updatedDummyWallet: tempUpdatedDummyWallet,
// //         counters
// //       }

// //     } else if(balanceTokenA < balanceTokenB) {

// //       if(51 < minimumWalletBalanceAllowed) {
// //         console.log('insufficient funds for the swap, please top up gas tokens.');
// //         await topUpGasToken(actionBlockchain);
// //       }
// //       // swap usdc for eth
// //       // console.log(`${tokenA} < ${tokenB}`);
// //       const tempRandomNumber: number = randomNumbersArray.splice(0, 1)[0];
// //       const percentageAmountToSwap  = ((tempRandomNumber * (swapAmountPercentageMax- swapAmountPercentageMin)) + 0.1)/100;
// //       // console.log("percentageAmountToSwap: ", percentageAmountToSwap);
// //       const amountTokenB = balanceTokenB * percentageAmountToSwap;
// //       const amountTokenA = amountTokenB / (tokenPriceData[tokenA]);
// //       const newbalanceTokenA = balanceTokenA + (amountTokenB / (tokenPriceData[tokenA]));
// //       const newbalanceTokenB = balanceTokenB - amountTokenB;

// //       console.log('\n');
// //       console.log(`Swapping ${amountTokenB} ${tokenB} to ${amountTokenA} ${tokenA}`);
// //       console.log('\n');

// //       // tempUpdatedDummyWallet.balances.filter(blockchain => blockchain.name === actionBlockchain)[0].tokens.filter(token => token.name === tokenA)[0].amount = newbalanceTokenA * tokenPriceData[tokenA];
// //       // tempUpdatedDummyWallet.balances.filter(blockchain => blockchain.name === actionBlockchain)[0].tokens.filter(token => token.name === tokenB)[0].value = newbalanceTokenB * tokenPriceData[tokenB];

// //       counters = {
// //         borrowCount: 0,
// //         lendCount: 0,
// //         liquidityCount: 0,
// //         nftCount: 0,
// //         swapCount: 1
// //       }
// //       // @todo - change to action.counters[actionType]++ and remove Count from names e.g. lendCount to lend.

// //       activityReport = {
// //         action,
// //         status: Status.Success,
// //         trxDetails: {
// //             fromAmount: amountTokenB * (tokenPriceData[tokenB]),
// //             toAmount: amountTokenB * (tokenPriceData[tokenB]),
// //             tokenA,
// //             tokenB
// //         },
// //         trxHash: '0x...', // @todo put trxHash inside trxDetails
// //         updatedDummyWallet: tempUpdatedDummyWallet,
// //         counters // dont need anymore as will be ++1 in the workflow from action.actionType
// //       }
// //     }
// //     // console.log(`Updated ${tokenA} Balance: ${activityReport.updatedDummyWallet.balances.filter(blockchain => blockchain.name === actionBlockchain)[0].tokens.filter(token => token.name === tokenA)[0].amount}`);
// //     // console.log(`Updated ${tokenB} Balance: ${activityReport.updatedDummyWallet.balances.filter(blockchain => blockchain.name === actionBlockchain)[0].tokens.filter(token => token.name === tokenB)[0].amount}`);
// //     console.log('\n');

// //   } else if(actionType === 'add liquidity') {
// //     console.log('action.type === liquidity');
// //     activityReport = {
// //       action,
// //       status: Status.Success,
// //       trxDetails: {
// //           fromAmount: 1,
// //           toAmount: 0,
// //           tokenA,
// //           tokenB
// //       },
// //       trxHash: '0x...',
// //       updatedDummyWallet: tempUpdatedDummyWallet,
// //       counters:{
// //         borrowCount: 0,
// //         lendCount: 0,
// //         liquidityCount: 1,
// //         nftCount: 0,
// //         swapCount: 0
// //       }
// //     }
// //   } else if(actionType === 'borrow') {

// //     console.log('action.type === borrow');

// //     counters ={
// //       borrowCount: 1,
// //       lendCount: 0,
// //       liquidityCount: 0,
// //       nftCount: 0,
// //       swapCount: 0
// //     }

// //     activityReport = {
// //       action,
// //       status: Status.Success,
// //       trxDetails: {
// //           fromAmount: 1,
// //           toAmount: 0,
// //           tokenA,
// //           tokenB
// //       },
// //       trxHash: '0x...',
// //       updatedDummyWallet: tempUpdatedDummyWallet,
// //       counters
// //     }
// //   } else if(actionType === 'lend') {
// //     console.log('action.type === lend');
// //     activityReport = {
// //       action,
// //       status: Status.Success,
// //       trxDetails: {
// //           fromAmount: 1,
// //           toAmount: 0,
// //           tokenA,
// //           tokenB
// //       },
// //       trxHash: '0x...',
// //       updatedDummyWallet: tempUpdatedDummyWallet,
// //       counters:{
// //         borrowCount: 0,
// //         lendCount: 1,
// //         liquidityCount: 0,
// //         nftCount: 0,
// //         swapCount: 0
// //       }
// //     }
// //   } else if(actionType === 'mint') {
// //     console.log('action.type === mint');
// //     console.log('\n');
// //     console.log(`Minted NFT on ${action.protocol}`);
// //     console.log('\n');

// //     // const newbalanceTokenA = tempUpdatedDummyWallet.balances.filter(blockchain => blockchain.name === actionBlockchain)[0].tokens.filter(token => token.name === tokenA)[0].amount - gasFee;
    
// //     // @todo - change the gas part to native
// //     // tempUpdatedDummyWallet.balances.filter(blockchain => blockchain.name === actionBlockchain)[0].tokens.filter(token => token.name === tokenA)[0].amount = newbalanceTokenA;
    
// //     activityReport = {
// //       action,
// //       status: Status.Success,
// //       trxDetails: {
// //           fromAmount: 1,
// //           toAmount: 0,
// //           tokenA,
// //           tokenB
// //       },
// //       trxHash: '0x...',
// //       updatedDummyWallet: tempUpdatedDummyWallet,
// //       counters:{
// //         borrowCount: 0,
// //         lendCount: 0,
// //         liquidityCount: 0,
// //         nftCount: 1,
// //         swapCount: 0
// //       }

// //     }

// //   } else {
// //     // console.log('action.type === unregonised action type')
// //   }
  

// // return activityReport;