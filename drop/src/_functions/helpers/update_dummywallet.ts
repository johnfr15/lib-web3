import { Db } from "mongodb";
import { RouteAction } from "../../_models/interfaces";

export async function updateDummyWallet(
    routeAction: RouteAction, 
    db: Db
): Promise<void> {
    // const filter = { "balances.blockchain": "avalanche", "balances.symbol": "avax" };
    // const filter = { "balances.blockchain": routeAction.blockchain, "balances.symbol": "avax" };
    // const update = { $inc: { "balances.$.value": -10, "balances.$.amount": -1 } };
    // await dummyWalletCollection.updateOne(filter, update);
}