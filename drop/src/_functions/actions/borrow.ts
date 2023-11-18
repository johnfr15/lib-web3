import { Db, MongoClient } from "mongodb";
import { RouteAction } from "../../_models/interfaces";
import { updateBotStatistics } from "../helpers/update_bot_statistics";

export async function borrow(
    routeAction: RouteAction,
    mongoClient: MongoClient,
    db: Db
): Promise<any> {

    try {

        console.log(routeAction);
        // await updateBotStatistics(routeAction, db, '0.0000001', '0.0001');
        // console.log("Plug in Jonathan's borrowing functions here or change these into prechecks and postcheck helper functions...");
    
    } catch(e) {
        console.log(e);
    } finally {
        
        if(mongoClient){
            await mongoClient.close()
        }

    }
    
}