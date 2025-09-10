class SudokuSolver {
  validate(puzzleString) {
    // Check for valid characters and length
    const validChars = /^[1-9.]+$/;
    if (!validChars.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    // Check for length of 81
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    const end = start + 9;
    const rowValues = puzzleString.slice(start, end);
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[i * 9 + column] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzleString[(regionRow + i) * 9 + (regionCol + j)] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const isValid = this.validate(puzzleString);
    if (isValid && isValid.error) {
      return isValid;
    }
    const board = puzzleString.split('').map(char => (char === '.' ? '0' : char));

    const solveRecursive = (index) => {
      if (index === 81) {
        return true;
      }
      if (board[index] !== '0') {
        return solveRecursive(index + 1);
      }
      const row = Math.floor(index / 9);
      const col = index % 9;
      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (this.checkRowPlacement(board.join(''), row, col, value) &&
            this.checkColPlacement(board.join(''), row, col, value) &&
            this.checkRegionPlacement(board.join(''), row, col, value)) {
          board[index] = value;
          if (solveRecursive(index + 1)) {
            return true;
          }
        }
      }
      board[index] = '0';
      return false;
    };
    if (!solveRecursive(0)) {
      return { error: 'Puzzle cannot be solved' };
    }
    return board.join('');
  }
}

module.exports = SudokuSolver;

