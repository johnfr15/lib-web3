import { MongoClient, Db } from "mongodb";
import Decimal from 'decimal.js';

// Data imported
import DummyWalletData from '../_data/input/dummy_wallet_data.json';
import BlockchainData from '../_data/input/blockchains_data.json';
import TokenPriceData from '../_data/input/token_price_data.json';

// Models
import { Blockchain, DummyWallet, RouteAction, Status, TokenPrices } from "../_models/interfaces";

// Helper Functions
import { updateBotStatistics } from "../_functions/helpers/update_bot_statistics";
import { addLiquidity, borrow, bridge, lend, mint, obfuscate, swap } from "../_functions/actions";

// Data assigned
const dummyWalletData: DummyWallet = DummyWalletData;
const blockchainsData: Blockchain[] = BlockchainData;
const tokenPriceData: TokenPrices = TokenPriceData;

// Collections
const collectionNameDummyWallet = 'dummywallet';
const collectionNameTrxs = 'trxs';

// Remove BotStatistics, DummyWallet and Trxs and then insert fresh data for BotStatistics and DummyWallet. 
export async function doAction(
    randomNumbersArray: number[],
    routeAction: RouteAction,
    firstRouteAction: boolean,
    nextBlockchain?: string
): Promise<any> {

    let mongoClient;

    try {
        // console.log('doAction started...');

        const url = 'mongodb://localhost:27017'; // MongoDB connection URL
        const dbName = 'dropbot'; // Database name
        mongoClient = new MongoClient(url);
        await mongoClient.connect();
        const db: Db = mongoClient.db(dbName);

        // Add funds to wallet for first blockchain
        if(firstRouteAction) {

            const startingValue = "500";
            const blockchainsGasToken = blockchainsData.filter(blockchain => blockchain.name === routeAction.blockchain)[0].gasToken;
            const tokenUsdPrice = tokenPriceData[blockchainsGasToken];
            const startingAmount = new Decimal(startingValue).div(new Decimal(tokenUsdPrice)).toFixed(18);
            // const startingAmount = new Decimal(startingValue).div(new Decimal("2"));
            const collectionNameDummyWallet = 'dummywallet';
            const dummywalletCollection = db.collection(collectionNameDummyWallet);
            const fundWalletsStartingBlockchainAmount = "balances.$.amount";
            const fundWalletsStartingBlockchainValue = "balances.$.value";
            await dummywalletCollection.updateOne(
                { "balances": { $elemMatch: { "blockchain": routeAction.blockchain, "gasToken": true }}},
                { $set: { [fundWalletsStartingBlockchainAmount]: startingAmount, [fundWalletsStartingBlockchainValue]: startingValue } }
            )

        }

        if(routeAction.type === 'add liquidity') {

            await addLiquidity(
                dummyWalletData.signer,
                'addressA',
                '0.1',
                'addressB',
                '0.1',
                routeAction.blockchain,
                routeAction,
                mongoClient,
                db
            )

        } else if(routeAction.type === 'borrow') {

            await borrow(
                routeAction,
                mongoClient,
                db
            )

        } else if(routeAction.type === 'bridge') {

            await bridge(
                routeAction,
                nextBlockchain,
                mongoClient,
                db
            )

        } else if(routeAction.type === 'obfuscate') {  

            await obfuscate(
                routeAction,
                mongoClient,
                db
            )

        } else if(routeAction.type === 'lend') {

            await lend(
                routeAction,
                mongoClient,
                db
            )

        } else if(routeAction.type === 'mint') {

            await mint(
                dummyWalletData.signer,
                '0.001',
                routeAction.blockchain,
                mongoClient,
                db,
                routeAction
            )

        } else if(routeAction.type === 'swap') {

            const tokenA = 'eth';
            const tokenB = 'usdc';

            await swap(
                dummyWalletData.signer,
                [tokenA, tokenB],
                '0.0001',
                '0.1',
                routeAction.blockchain,
                routeAction.protocol,
                db,
                routeAction
            ) 

        }

        return {
            status: Status.Success
        }
    
    } catch(e){
        
        console.log("error in doDatabaseMigration!");
        console.log(e);
    
    } finally {

        if(mongoClient){
            await mongoClient.close()
        }
    }

}