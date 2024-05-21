// Learn how to collect user info..

const { log } = require("console");

// 1. Deposit some money
// 2. Determine num of lines to bet on..
// 3. Collect bet amount
// 4  Spin the slot machine.
// 5. Check if the user won?
// 6. give the money to the winner.
// 7. Play again!


// Now lets build function one by one for each of them!



// we are gonna use the prompt sync library for the input for this function
const prompt = require("prompt-sync")();


// defining number of rows and columns our slot machine would be having..
// All in all, these are global variables:

const ROWS = 3;
const COLUMNS = 3;

// creating an object
const SYMBOLS_COUNT = {
    
    // key value pairs
    "A" : 2,
    "B" : 4,
    "C" : 6,
    "D" : 8,
}
const SYMBOLS_VALUES = {
    
    // key value pairs
    // multiplier and the amount recieved by player if win:
    // for eg: 2*5 = 10 , here both a values are multiplied, sames goes for others.
    "A" : 5,
    "B" : 4,
    "C" : 3,
    "D" : 2,
}



// 1. Function for Deposit some money:
// arrow function
const deposit = () => {
    
    while(true)
        {
            const depositAmount = prompt("Enter deposit amt: ");
            
            // parseFloat function is taking string and convert it into its floating point value
            // for instance: 17.2 will b 17.2 but hello adi would NAN not a number.
            
            const numberDepositAmount = parseFloat(depositAmount); 
            
            // validating the amount and prompting until users gives the proper input
            if (isNaN(numberDepositAmount) || numberDepositAmount <= 0 )
                {
                console.log("Invalid Deposit amount, pls try again!");
                }

                else{
                    return numberDepositAmount;
                }
            } 
        };
        
        
// 2. Determine num of lines to bet on..
    const getNumberOfLines = () => 
        {
            while(true)
                {
                const lines = prompt("Enter the number of lines to bet on(1-3): ");
                    const numberOfLines = parseFloat(lines); 
                    
                    // validating the lines and prompting until users gives the proper input
                    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3)
                        {
                        console.log("Invalid Number of lines!");
                        }
                
                    else{
                            return numberOfLines;
                        }
        } 
        
    };
    
    
    // 3. Collect bet amount
    const getBet = (balance, lines) =>
        {
            while(true)
                {
                    const bet = prompt("Enter the bet per line: ");
                    const numberOfBets = parseFloat(bet); 
                    
                    // validating the lines and prompting until users gives the proper input
                    if (isNaN(numberOfBets) || numberOfBets <= 0 || numberOfBets > balance / lines)
                        {
                            console.log("Invalid Bet, tey again!");
                        }
                        
                        else{
                    return numberOfBets;
                }
            } 
            
        };
        
        
        
        // 4  Spin the slot machine.
        // now its time to spin the slot machine, so we are building this function
        const spin = () => {
                // possible symbols while we generating individual columns, 
                // so generating array that contains all the possible symbols we might have.
                // I am gonna use const cuz, I am not gonna change this array again
                const symbols = [];
                // using a loop,
                for(const [symbol, count] of Object.entries(SYMBOLS_COUNT))
                    {
                        for(let i = 0; i < count; i++ )
                            {
                                symbols.push(symbol);
                            }
                    }
                    
        
        // these are the columns, 
        // nested array use case
        const reels = [];

        // nested for loop for creating columns and rows
        for (let i=0; i < COLUMNS; i++)
            {
                // for reason to do this is simple, for every single column, we are gonna add one in the reels, and once added we can push the symbols in it
                reels.push([]);
                // copying all the symbols into this array, randomly select the symbol,
                // then add that into reels array (140 line), then remove it so to continue to select.
                // for example: if I already use 2 A's, then I would remove that so I won't be using it again.
                
                
                /*
                quick recap 
                [A,B,C] SO THE INDEX OF ARRAY WOULD BE 0,1,2
                [0,1,2], SO I AM GONNA RANDOMLY SELECT ONE OF THE INDEX AND CHOSE THE ELEMENT, THE REMOVE THE ELEMENT FROM THE ARRAY
                THEN INSERT IN TO MY REELS.

                AND IN ORDER TO SELECT RANDOMLY FOR THE SYMBOLS TO INSERT IT, I WILL BE USING THE "RANDOM FUNCTION" 
                */


                const reelSymbols = [...symbols];
                for(let j=0; j < ROWS; j++)

                    {
                        // here we are using math library of js, in that we taking the one number which is lowest but closest to the random number with the 
                        // multiplication of reelSymbol array length 
                        const randomIndex = Math.floor(Math.random() * reelSymbols.length);
                        const selectedSymbol = reelSymbols[randomIndex];
                        
                        // pushing into the interior array the selected symbol.
                        reels[i].push(selectedSymbol);

                        // removing the symbol so that I should not select it again.
                        reelSymbols.splice(randomIndex, 1); // 1 means we want to remove only 1 element that's why and random index is the position we are removing at.
                    }
            }
            return reels;
            };
            
    // before going ahead off determining the winner, we can have to transpose the row
                
        
            // our reels look like this [ [ 'B', 'D', 'A' ], [ 'B', 'D', 'C' ], [ 'A', 'C', 'D' ] ]
            /* now these are in rows, but we want to that in columns
                so it would be like 
                [B,B,A] 
                [D,D,C] 
                [A,C,D]
                so this is transformation of matrix
                for that we are making the function which transposing the array.
            */
    
        const transpose = (reels) => 
            {
                const rows = [];

                for(let i=0; i<ROWS; i++)
                    {
                        rows.push([]);
                    for(let j=0; j<COLUMNS; j++)
                        {
                            rows[i].push(reels[j][i]);
                        }
                    }
                return rows;
            };


    const printRows = (rows) => 
        {
            for(const row of rows)
                {
                    let rowString = ""; //"A | B | C"

                    for (const[i, symbol] of row.entries())
                        {
                            rowString += symbol;

                            if( i!= row.length - 1) {
                                rowString += " | ";
                            }
                        }
                    console.log(rowString);
                }
        };

    // 5. Check if the user won?
    // now once the rows are transpose, we can now focus on either the user won or not?

    // the line params is crucial becuz, we can check if the user bet on line 1,2,3 it will check accordingly.
    const getWinnings = (rows, bet, lines) =>
        {
            let winnings = 0;

            // now we are gonna loop the line to determine the winner.
            for (let row =0; row < lines; row++)
                {
                    const symbols = rows[row]; // to check if all the symbols are same or not, if yes bingo they won if not they lose.
                    
                    // if we find if one of the symbol is not same we will make the bool false, else it will remain true
                    let allSame = true;

                    for(const symbol of symbols)
                        {
                            if(symbol != symbols[0])
                                {
                                    allSame = false;
                                    break; 
                                }
                                // if this comes to break, that means we did not win.
                        }

                        // if the user is winning then the amount winning is determine by the following equation
                        if(allSame)
                            {
                                winnings += bet * SYMBOLS_VALUES[symbols[0]]
                            }
                }
                return winnings;
        };

const game = () => {
    let balance = deposit();
    while(true)
        {
            console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = (rows,bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if(balance <= 0)
            {
                console.log("You ran out of money!");
                break;
            }
            const playAgain = prompt("Do you want to play again (y/n)?");

            if (playAgain != "y") break;
        }
};

game();