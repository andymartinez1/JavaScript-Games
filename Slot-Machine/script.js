const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
  '⭐': 3,
  '🍇': 4,
  '🍉': 5,
  '🍊': 6,
  '🍒': 8,
};

const SYMBOL_VALUES = {
  '⭐': 10,
  '🍇': 5,
  '🍉': 4,
  '🍊': 3,
  '🍒': 2,
};

// User deposits a money amount
function deposit() {
  while (true) {
    const depositAmount = prompt('Enter deposit amount: ');
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log('Invalid deposit amount. Please try again');
    } else {
      return numberDepositAmount;
    }
  }
}

// User enters how many lines they want to bet on
function getNumberOfLines() {
  while (true) {
    const lines = prompt('Enter number of lines to bet on (1-3): ');
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log('Invalid number of lines. Please try again');
    } else {
      return numberOfLines;
    }
  }
}

// User enters their bet amount
function getBet(balance, lines) {
  while (true) {
    const bet = prompt('Enter bet amount: ');
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log('Invalid bet amount. Please try again');
    } else {
      return numberBet;
    }
  }
}

// Generate possible symbols
function spin() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) symbols.push(symbol);
  }

  // Randomly generate reels from symbols
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
}

// Transpose columns into rows
function transpose(reels) {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) rows[i].push(reels[j][i]);
  }
  return rows;
}

// Print rows with formatting
function printRows(rows) {
  for (const row of rows) {
    let rowString = '';
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) rowString += ' | ';
    }
    console.log(rowString);
  }
}

// Generate winnings from bets
function getWinnings(rows, bet, lines) {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
}

// Continually play game if user wants to and has funds to
function game() {
  let balance = deposit();
  while (true) {
    console.log('You have a balance of $' + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log('You won, $' + winnings.toString());
    if (balance <= 0) {
      console.log('No available balance. Exiting game');
      break;
    }
    const playAgain = prompt('Do you want to play again (y/n)');
    if (playAgain != 'y') break;
  }
}

game();
