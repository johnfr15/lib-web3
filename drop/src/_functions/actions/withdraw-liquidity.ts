import { Db, MongoClient } from "mongodb";
import { RemoveOptions, RouteAction } from "../../_models/interfaces";
import { Wallet } from 'ethers';
export async function withdrawLiquidity(
    signer: Wallet, 
    tokenA: string, 
    tokenB: string, 
    chain: string,
    routeAction: RouteAction,
    mongoClient: MongoClient,
    db: Db,
    options?: RemoveOptions
): Promise<any> {

    try {

        console.log(routeAction);
        // await updateBotStatistics(routeAction, db, '0.0000001', '0.0001');

    } catch(e) {

        console.log(e);
        
    } finally {
        
        if(mongoClient){
            await mongoClient.close()
        }

    }

}