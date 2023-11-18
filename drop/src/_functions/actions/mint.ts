import { Db, MongoClient } from "mongodb";
import { MintOptions, RouteAction, Signer } from "../../_models/interfaces";
import { updateBotStatistics } from "../helpers/update_bot_statistics";

export async function mint(
    signer: Signer,
    amountIn: string | null,
    chain: string,
    mongoClient: MongoClient,
    db: Db,
    routeAction: RouteAction,
    options?: MintOptions
): Promise<any> {

    try {
        console.log(routeAction);

        // Check if we have enough gas to mint
        // If gas do mint
        // else top up wallet
        // Pay 0.0001 Native for the Mint
        // Pay 0.0000001 for the gas fees.

        await updateBotStatistics(routeAction, db, '0.0000001', '0.0001');

    } catch(e) {
        console.log(e);
    } finally {

        if(mongoClient){
            await mongoClient.close()
        }

    }


    
}