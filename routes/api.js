'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
  .post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    // Check for missing fields
    if (!puzzle || !coordinate || !value) {
      return res.status(400).json({ error: 'Required field(s) missing' });
    }

    // Validate puzzle characters and length
    const validChars = /^[1-9.]+$/;
    if (!validChars.test(puzzle)) {
      return res.status(400).json({ error: 'Invalid characters in puzzle' });
    }
    if (puzzle.length !== 81) {
      return res.status(400).json({ error: 'Expected puzzle to be 81 characters long' });
    }

    // Validate coordinate and value
    if (coordinate.length !== 2) {
      return res.status(400).json({ error: 'Invalid coordinate' });
    }
    const rowChar = coordinate[0];
    const colChar = coordinate[1];
    const rows = 'ABCDEFGHI';
    const cols = '123456789';
    const row = rows.indexOf(rowChar.toUpperCase());
    const col = cols.indexOf(colChar);

    if (row === -1 || col === -1) {
      return res.status(400).json({ error: 'Invalid coordinate' });
    }
    if (!/^[1-9]$/.test(value)) {
      return res.status(400).json({ error: 'Invalid value' });
    }

    const currentCellValue = puzzle[row * 9 + col];
    // If the value is already present, check for conflicts
    if (currentCellValue === value) {
      let puzzleArr = puzzle.split('');
      puzzleArr[row * 9 + col] = '.';
      let puzzleWithoutCell = puzzleArr.join('');

      // Check for conflicts as if the cell was empty
      let conflicts = [];
      if (!solver.checkRowPlacement(puzzleWithoutCell, row, col, value)) conflicts.push('row');
      if (!solver.checkColPlacement(puzzleWithoutCell, row, col, value)) conflicts.push('column');
      if (!solver.checkRegionPlacement(puzzleWithoutCell, row, col, value)) conflicts.push('region');
      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }
      return res.json({ valid: true });
    }

    // Check for conflicts
    const conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
    if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
    if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');
    if (conflicts.length > 0) {
      return res.json({ valid: false, conflict: conflicts });
    }

    // No conflicts, placement is valid
    return res.json({ valid: true });
  });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.status(400).json({ error: 'Required field missing' });
      }

      let result = solver.solve(puzzle);

      // If result has an error object, return it along with 400 status
      if (result && result.error) {
        return res.status(400).json(result);
      }

      return res.json({ solution: result });
    });
};
