import { Db, MongoClient } from "mongodb";
import { RouteAction } from "../../_models/interfaces";

export async function obfuscate(
    routeAction: RouteAction,
    mongoClient: MongoClient,
    db: Db
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