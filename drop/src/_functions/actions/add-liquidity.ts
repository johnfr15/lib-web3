import { Db, MongoClient } from "mongodb";
import { AddOptions, RouteAction, Signer } from "../../_models/interfaces";
import { updateBotStatistics } from "../helpers/update_bot_statistics";
// import { AddOptions } from "../../_models";
// import Chains from "../../_data/input/blockchains_data.json";
// import DummyWalletData from '../../_models/blockchains';


export async function addLiquidity(
    signer: Signer,                        
    addressA: string,                       
    amountA: string | null,     
    addressB: string,                       
    amountB: string | null,     
    chain: string,
    routeAction: RouteAction,
    mongoClient: MongoClient,
    db: Db,
    options?: AddOptions
): Promise<any> {
    
    try {

        console.log(routeAction);
        // await updateBotStatistics(routeAction, db, '0.0000001', '0.0001');
        // console.log("Plug in Jonathan's adding liquidity functions here or change these into prechecks and postcheck helper functions...");

    } catch(e) {
        console.log(e);
    } finally {

        if(mongoClient){
            await mongoClient.close()
        }

    }


}