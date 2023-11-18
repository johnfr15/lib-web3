// import Decimal from 'decimal.js';

// const x = '0';
// const y = '0.0000001';
// const z = '0.0000000000001';
// const xDecimal = new Decimal(x);
// const yDecimal = new Decimal(y);
// const zDecimal = new Decimal(z);
// const yLength = y.length;
// console.log(yLength);

// const mult = xDecimal.plus(yDecimal).plus(zDecimal).mul(2).toFixed(18);
// console.log(mult);

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

// import BlockchainData from './src/_data/input/blockchains_data.json';
// import TokenPriceData from './src/_data/input/token_price_data.json';

// import { Blockchain, RouteAction, TokenPrices } from './src/_models/interfaces'

// const blockchainsData: Blockchain[] = BlockchainData;
// const tokenPriceData: TokenPrices = TokenPriceData;

// const routeAction: RouteAction = {
//     blockchain:  "ethereum",
//     protocol: "uniswap",
//     type: "mint"
// }

// const selectedBlockchain = blockchainsData.filter(blockchain => blockchain.name === routeAction.blockchain)[0].gasToken;
// const tokenUsdPrice = tokenPriceData[selectedBlockchain];
// console.log("selectedBlockchain: ", selectedBlockchain)
// console.log("tokenUsdPrice: ", tokenUsdPrice)

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
import { MongoClient, Db } from "mongodb";
import Decimal from 'decimal.js';
import TokenPriceData from './src/_data/input/token_price_data.json';


async function getData(){
    let mongoClient;
    try {
        const url = 'mongodb://localhost:27017'; // MongoDB connection URL
        const dbName = 'dropbot'; // Database name
        mongoClient = new MongoClient(url);
        await mongoClient.connect();
        const db: Db = mongoClient.db(dbName);
        
        const currentBlockchain = "avalanche";
        
        const collectionName = 'dummywallet';
        const dummyWalletCollection: any = db.collection(collectionName);
        const dummyWalletObj: any = await dummyWalletCollection.findOne({});
        const balances: any = dummyWalletObj?.balances;
        const avalancheTokensWithBalances: any = balances.filter((balance: any) => balance.blockchain === currentBlockchain && balance.gasToken === false && balance.value !== "0");
        console.log("avalancheBalances: ", avalancheTokensWithBalances);
        let totalToSendToNative = "0";
        for(const balance of avalancheTokensWithBalances) {
            
            totalToSendToNative = new Decimal(totalToSendToNative).plus(new Decimal(balance.amount)).toFixed(18);
            const updateNativeAmount = "balances.$.amount";
            const updateNativeValue = "balances.$.value";

            await dummyWalletCollection.updateOne(
                { "balances.blockchain": "avalanche", "balances.gasToken": false },
                { $set: { "balances.$[elem].amount": totalToSendToNative, "balances.$[elem].value": totalToSendToNative } },
                { arrayFilters: [{ "elem.blockchain": "avalanche", "elem.gasToken": false }], multi: true }
            )
              

            // make this deduct form the current balances and add to the native balance then rename this function to rebalancer function.
        }
    } catch(e){
        console.log(e);
    } finally {
        if(mongoClient){
            await mongoClient.close()
        }
    }

}

getData();