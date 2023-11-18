// Models
import { Action, ActionTypeWeight, RouteAction, RouteOptions } from '../../_models/interfaces';
import ActionTypeWeighting from '../../_data/input/action_type_weights.json'

// Create a Route - Preplanned deterministically randomised trx outline for each wallet.
export async function createRoute(
  actions: Action[],
  options: RouteOptions
): Promise<RouteAction[]> {
  
  try {

    const route: RouteAction[] = [];
    
    for (let i = 0; i < options.maxCycles; i++) {

      const cycle: RouteAction[] = await createCycle(actions, options, i);
      route.push(...cycle);

    }
    return route;
  
  } catch(e){
    console.log(e);
    throw e;
  }

}

// Create a Cycle - A cycle is a wallet running once through firstly the legacy actions and secondly the airdrop actions for all of the different airdrop blockchains.
async function createCycle(
  actions: Action[],
  options: RouteOptions,
  index: number
): Promise<RouteAction[]> {
    // @todo - pepper the airdrop route with some random TransactionDescription.

  try {

    const cycle: RouteAction[] = [];

    if(index === 0) {
      const run = await createLegacyRun(actions, options);
      cycle.push(...run);
      return cycle;
    }

    const run = await createAirdropRun(actions, options);
    const lastBlockchainUsedInRun = run[run.length - 1].blockchain;
    
    run.push({ blockchain: lastBlockchainUsedInRun, protocol: 'houdini', type: 'recycle'});
    cycle.push(...run);
    return cycle;

  } catch(e) {
    console.log(e);
    throw e;
  }

}

// Create an legacy run - A full run of actions on a single non-airdrop blockchain.
async function createLegacyRun( // @todo - make these one function that takes in all
  actions: Action[], 
  options: RouteOptions
): Promise<RouteAction[]> {
  
  try  {

    const legacyRun: RouteAction[] = [];

    const legacyActions = actions.filter(legacyAction => legacyAction.type === 'legacy');
    const legacyActionsStartingLength = legacyActions.length;

    for(let i = 0; i < legacyActionsStartingLength; i++) { // you can't use splice in this for loop

      const randomIndex = Math.floor(Math.random() * legacyActions.length);
      const selectedBlockchain = legacyActions.splice(randomIndex, 1)[0]; //@todo splice is emptying the array after 3 goesI think the splice is cutting everything out before the 10 actions have been selected. maybe edit this section to fix? once fixed, this bit is completed then do same for legacy then routes completed ready to test.
      const selectedBlockchainsProtocols = selectedBlockchain.protocols;

      for(let i = 0; i < options.actionsPerRun; i++) {

        const selectedProtocol = selectedBlockchainsProtocols[Math.floor(Math.random() * selectedBlockchain.protocols.length)];
        
        const selectedProtocolActions = selectedProtocol.actions;
        const selectedProtocolActionsLength = selectedProtocolActions.length;
        
        const actionTypeWeightings: ActionTypeWeight[] = ActionTypeWeighting;
        
        const filteredActionTypeWeights = actionTypeWeightings.filter((weighting) => selectedProtocolActions.includes(weighting.type));
        
        const normalizingcoefficient = 1 / (
          actionTypeWeightings.filter(
            weighting => selectedProtocolActions.includes(weighting.type)
          ).reduce((acc, weighting) => acc + weighting.value, 0));

        const normalizedWeightings = filteredActionTypeWeights.map(weighting => Object.assign(weighting, weighting.value = parseFloat((weighting.value * normalizingcoefficient).toFixed(2))))

        normalizedWeightings.sort((a, b) => a.value - b.value);

        const cumulativeWeights = [];
        let cumulativeWeight = 0;
        
        for (const weight of normalizedWeightings) {
          cumulativeWeight += weight.value;
          cumulativeWeights.push({type: weight.type, value: cumulativeWeight});
        }

        const randomTypeValue = Math.random();
        let selectedType;

          for (const item of cumulativeWeights) {
            if (randomTypeValue <= item.value) {
              selectedType = item.type;
              break;
            }
          }

        const actionData: RouteAction = {
          blockchain:  selectedBlockchain.blockchain,
          protocol: selectedProtocol.name,
          type: selectedType || 'swap'
        };

        legacyRun.push(actionData)

      }

      const lastBlockchainUsedInLegacyRun = legacyRun[legacyRun.length - 1].blockchain;

      legacyRun.push({
        blockchain:  lastBlockchainUsedInLegacyRun,
        protocol: 'orbiter',
        type: 'bridge'
      })
    }

    return legacyRun;

  } catch(e) {
    console.log(e);
    throw e;
  }

}

// Create a airdropRun A full run of actions on a single airdrop blockchain.
async function createAirdropRun(
  actions: Action[],
  options: RouteOptions
): Promise<RouteAction[]> {
  try {

    const runs: RouteAction[] = [];

    const airdropActions = actions.filter(action => action.type === 'airdrop');
    const airdropActionsStartingLength = airdropActions.length;
    
    for(let i = 0; i < airdropActionsStartingLength; i++) {

      const randomIndex = Math.floor(Math.random() * airdropActions.length);
      const selectedBlockchain = airdropActions.splice(randomIndex, 1)[0]; //@todo splice is emptying the array after 3 goesI think the splice is cutting everything out before the 10 actions have been selected. maybe edit this section to fix? once fixed, this bit is completed then do same for legacy then routes completed ready to test.
      const selectedBlockchainsProtocols = selectedBlockchain.protocols;

      for(let i = 0; i < options.actionsPerRun; i++) {

        const selectedProtocol = selectedBlockchainsProtocols[Math.floor(Math.random() * selectedBlockchain.protocols.length)];
        const selectedProtocolActions = selectedProtocol.actions;
        const selectedProtocolActionsLength = selectedProtocolActions.length;
        
        const actionTypeWeightings: ActionTypeWeight[] = ActionTypeWeighting;
        const filteredActionTypeWeights = actionTypeWeightings.filter(weighting => selectedProtocolActions.includes(weighting.type));
        const normalizingcoefficient = 1 / filteredActionTypeWeights.reduce((acc, weighting) => acc + weighting.value, 0);
        const normalizedWeightings = filteredActionTypeWeights.map(weighting => Object.assign(weighting, weighting.value = parseFloat((weighting.value * normalizingcoefficient).toFixed(2))))
        normalizedWeightings.sort((a, b) => a.value - b.value);

//------------------------

        const cumulativeWeights = [];
        let cumulativeWeight = 0;
        
        for (const weight of normalizedWeightings) {
          cumulativeWeight += weight.value;
          cumulativeWeights.push({type: weight.type, value: cumulativeWeight});
        }

        const randomTypeValue = Math.random();

        let selectedType;

        for (const item of normalizedWeightings) {
          if (randomTypeValue <= item.value) {
            selectedType = item.type;
            break;
          }
        }

        const actionData: RouteAction = {
          blockchain:  selectedBlockchain.blockchain,
          protocol: selectedProtocol.name,
          type: selectedType || 'swap'
        };

        runs.push(actionData)

      }

      const lastBlockchainUsedInRuns = runs[runs.length - 1].blockchain;

      runs.push({
        blockchain:  lastBlockchainUsedInRuns,
        protocol: 'orbiter',
        type: 'bridge'
      })
    }

    // add obfuscate in here?

    return runs;

  } catch(e) {
    console.log(e);
    throw e;
  }

}