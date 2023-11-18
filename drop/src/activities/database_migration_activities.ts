import { MongoClient } from "mongodb";

// Data imported
import BotStatisticsData from '../_data/input/bot_statistics.json';
import DummyWalletData from '../_data/input/dummy_wallet_data.json';

// Remove BotStatistics, DummyWallet and Trxs and then insert fresh data for BotStatistics and DummyWallet. 
export async function doDatabaseMigration(): Promise<any> {

    let mongoClient;

    try {
        console.log('doDatabaseMigration action started...');

        // Data assigned
        const botStatisticsData = BotStatisticsData;
        const dummyWalletData = DummyWalletData;

        // Collections
        const collectionNameBotStatistics = 'botstatistics';
        const collectionNameDummyWallet = 'dummywallet';
        const collectionNameTrxs = 'trxs';

        const url = 'mongodb://localhost:27017'; // MongoDB connection URL
        const dbName = 'dropbot'; // Database name
        mongoClient = new MongoClient(url);
        await mongoClient.connect();
        const db = mongoClient.db(dbName);

        // Check if botStatistics, dummyWallet and trxs collections exist and delete these collections.
        const collectionsToDrop = [collectionNameBotStatistics, collectionNameDummyWallet, collectionNameTrxs];
        
        for (const collectionName of collectionsToDrop) {
            const collectionExists = await db
                .listCollections({ name: collectionName })
                .hasNext();
        
            if (collectionExists) {
                // The collection exists; you can now drop it.
                await db.collection(collectionName).drop();
                console.log(`Collection '${collectionName}' dropped.`);
            } else {
                console.log(`Collection '${collectionName}' does not exist.`);
            }
        }
  
        // Insert fresh data for the botStatistics, dummyWallet and trxs collections.
    
        const botStatisticCollection = db.collection(collectionNameBotStatistics);
        const dummyWalletCollection = db.collection(collectionNameDummyWallet);
    
        await botStatisticCollection.insertOne(botStatisticsData);
        await dummyWalletCollection.insertOne(dummyWalletData);
    
        console.log(`${collectionNameBotStatistics} data inserted successfully.`);
        console.log(`${collectionNameDummyWallet} data inserted successfully.`);

        console.log('doDatabaseMigration action finished...');
    
    } catch(e){
        doDatabaseMigration
        console.log("error in doDatabaseMigration!");
        console.log(e);
    
    } finally {

        if(mongoClient){
            await mongoClient.close()
        }
    }

}

