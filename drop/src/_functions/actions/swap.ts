import { DummyWallet, RouteAction, Signer, SwapOptions } from "../../_models/interfaces";
import { MongoClient } from 'mongodb';
import { TrxSchema } from "../../_models/schemas/trx";
import { updateBotStatistics } from "../helpers/update_bot_statistics";

export async function swap(
    signer: Signer,
    path: [string, string],
    amountIn: string | null,
    amountOut: string | null,
    chain: string,
    protocol: string,
    db: any,
    routeAction: RouteAction,
    options?: SwapOptions
): Promise<any> {

    try {

        console.log(routeAction);
        // console.log("Plug in Jonathan's swapping functions here or change these into prechecks and postcheck helper functions...");

        // console.log(`signer: ${signer}\n path: ${path}\n amountIn: ${amountIn}\n amountOut: ${amountOut}\n chain: ${chain}\n protocol: ${protocol}`);
        // console.log(`options: ${options}`);

        // Access the database

        // Perform MongoDB operations (read and write) here.
        const collectionNameTrxs = 'trxs';
        const collection = db.collection(collectionNameTrxs);
        await collection.insertOne({ 
            actionType: 'swap',
            amountIn: '1',
            amountOut: '1',
            blockchain: 'arbitrum',
            botId: 'bot ID',
            gasSpent: '0.001',
            hashId: 'hash ID',
            protocol: 'uniswap',
            status: 'success',
            timestamp: new Date(),
            tokenIn: 'eth',
            tokenOut: 'usdc',
            valueIn: '1',
            valueOut: '1',
            walletId: 'wallet ID'
        });

        // const result = await collection.find({}).toArray();
        // console.log("result:", result);

        await updateBotStatistics(routeAction, db, '0.0000001', '0.0001');


    } catch(e) {
        console.log(e);
    }

    return 'trx details?'
    
}