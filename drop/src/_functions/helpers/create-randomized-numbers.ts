import seedRandom from 'seedrandom';

/**
 * @name rng    // Generate an array of randomised numbers to pass to the bot derived from wallet's public key and part of the private key.
 * @param seed          // Derived from wallet's public key and part of the private key.
 * @param amount        // Amount of randomized numbers to generate.
 * @param weighting?    // @todo - Any weighting for certain ranges to be more prominant.
 * @returns randomizedNumberArray // Returns an array of 'amount' number of randomised numbers.
 */
export async function createRandomisedNumbers(seed: string, amount: number): Promise<number[]> {
    
    try {

        const rng = seedRandom(seed);
        const randomNumbers: number[] = [];
        
        for (let i = 0; i < amount; i++) {
            randomNumbers.push(rng());
        }
        
        return randomNumbers;

    } catch(e) {

        console.log(e);
        return [];

    }
    
}
