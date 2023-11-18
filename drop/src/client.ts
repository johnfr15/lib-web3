/* eslint-disable @typescript-eslint/no-inferrable-types */

// Temporal
import { Connection, Client } from '@temporalio/client';
import { routeWorkFlow  } from './workflows';
import { nanoid } from 'nanoid';

// Node Js helper modules
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Inout Data - actions, blockchains, token prices and wallet.
import ActionsData from './_data/input/actions_data.json';

// Custom Helper Functions
import { createRandomisedNumbers } from './_functions/helpers/create-randomized-numbers';
import { createRoute } from './_functions/helpers/create-route';

// Models
import { Action, RouteAction, RouteOptions } from './_models/interfaces';

// Declare wallet variables
const publicKey: string = process.env.publicKey || '';
const privateKey: string = process.env.privateKey || '';

//Declare Actions
const actions: Action[] = ActionsData;

// Declare Route
const routeOptions: RouteOptions = {
  maxCycles: 1,
  actionsPerRun: 5
}

/**
 * @name runBot
 * @returns Promise<void>
 */
async function runBot(actions: Action[]): Promise<void> {
  
  try {

    // Generate array of randomly generated numbers.

    const randomNumbers: number[] = await createRandomisedNumbers(`${publicKey} + ${privateKey.slice(0,6)}`, 2000);

    // Generate Route of actions to follow
    const route: RouteAction[] = await createRoute(actions, routeOptions);
  
    // Connect to the default Server location
    const connection = await Connection.connect({ address: 'localhost:7233' });
    // In production, pass options to configure TLS and other settings:
    // {
    //   address: 'foo.bar.tmprl.cloud',
    //   tls: {}
    // }
  
    // Create client.
    const client = new Client({
      connection,
      // namespace: 'airdrops' @todo - come back and fix namespace issue.
    });
  
    const handle = await client.workflow.start(routeWorkFlow, {
      taskQueue: 'airdrop',
      // type inference works! args: [name: string]
      args: [
        randomNumbers,
        route
      ],
      // in practice, use a meaningful business ID, like customerId or transactionId
      workflowId: 'workflow-' + nanoid()
    });
    console.log(`Started workflow ${handle.workflowId}`);
  
    // optional: wait for client result
    const result = await handle.result();
    // console.log("result: ", result);
    
  } catch(e) {
    console.log(e)
  }
}

runBot(actions).catch((err) => {
  console.error(err);
  process.exit(1);
});