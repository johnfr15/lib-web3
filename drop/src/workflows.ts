import * as workflow from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { BotStatistics, DummyWallet, Status, WorkFlowReport, RouteAction, ActionActivityReport } from './_models/interfaces';

const { doAction, doDatabaseMigration } = workflow.proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    maximumAttempts: 1,
  }
});

/** A workflow that simply calls an activity */
export async function routeWorkFlow(
  randomNumbersArray: number[],
  route: RouteAction[]
): Promise<WorkFlowReport | undefined> {
console.log("route: ", route)
  try {

    let nextBlockchain: string;

    await doDatabaseMigration();

    await workflow.sleep('3 second');

    for (const [index, routeAction] of route.entries()) {
      console.log("index: ", index);
      if(index === 0) {
        const actionResult: ActionActivityReport = await doAction(
          randomNumbersArray,
          routeAction,
          true
        );

        // console.log("actionResult: ", actionResult);

      } else if(index < route.length - 3 && routeAction.type === 'bridge') {

          nextBlockchain = route[index + 2].blockchain;
          // make all tokens go to native

          const actionResult: ActionActivityReport = await doAction(
            randomNumbersArray,
            routeAction,
            true,
            nextBlockchain
          );
  
          // console.log("actionResult: ", actionResult);

      } else {

        const actionResult: ActionActivityReport = await doAction(
          randomNumbersArray,
          routeAction,
          false
        );

        // console.log("actionResult: ", actionResult);

      }

      // await workflow.sleep('1 second');

    }

    const report: WorkFlowReport = {
      status: Status.Success
    };
  
    return (report);

  } catch(e) {

    console.log(e);

  }
}