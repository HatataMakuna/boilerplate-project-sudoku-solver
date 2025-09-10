const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
    suiteSetup(() => {
        solver = new Solver();
    });

    suite('Puzzle String Validation', () => {
        // #1
        test('Logic handles a valid puzzle string of 81 characters', () => {
            const result = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
            assert.isTrue(result);
        });

        // #2
        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
            const result = solver.validate('*&@&^*$#&^*&$#$(*&@#(*$@&#$&(@^$*@(*(*@^*!*&&!');
            assert.deepEqual(result, { error: 'Invalid characters in puzzle' });
        });

        // #3
        test('Logic handles a puzzle string that is not 81 characters in length', () => {
            const result = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16..926914.37.');
            assert.deepEqual(result, { error: 'Expected puzzle to be 81 characters long' });
        });
    });

    suite('Placement Validation', () => {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

        // #4
        test('Logic handles a valid row placement', () => {
            const result = solver.checkRowPlacement(puzzleString, 0, 2, '3');
            assert.isTrue(result);
        });

        // #5
        test('Logic handles an invalid row placement', () => {
            const result = solver.checkRowPlacement(puzzleString, 0, 2, '5');
            assert.isFalse(result);
        });

        // #6
        test('Logic handles a valid column placement', () => {
            const result = solver.checkColPlacement(puzzleString, 0, 1, '3');
            assert.isTrue(result);
        });

        // #7
        test('Logic handles an invalid column placement', () => {
            const result = solver.checkColPlacement(puzzleString, 0, 1, '2');
            assert.isFalse(result);
        });

        // #8
        test('Logic handles a valid region (3x3 grid) placement', () => {
            const result = solver.checkRegionPlacement(puzzleString, 0, 1, '3');
            assert.isTrue(result);
        });

        // #9
        test('Logic handles an invalid region (3x3 grid) placement', () => {
            const result = solver.checkRegionPlacement(puzzleString, 0, 1, '6');
            assert.isFalse(result);
        });
    });

    suite('Puzzle Solving', () => {
        // #10
        test('Valid puzzle strings pass the solver', () => {
            const result = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
            assert.equal(result.length, 81);
        });

        // #11
        test('Invalid puzzle strings fail the solver', () => {
            const result = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3.X');
            assert.deepEqual(result, { error: 'Invalid characters in puzzle' });
        });

        // #12
        test('Solver returns the expected solution for an incomplete puzzle', () => {
            const result = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
            assert.equal(result, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
        });
    });
});
