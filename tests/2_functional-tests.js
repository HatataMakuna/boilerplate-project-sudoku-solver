const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {
        // #1
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
                    done();
                });
        });

        // #2
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '' })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });

        // #3
        test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3.X' })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        // #4
        test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16..926914.37.' })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        // #5
        test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
                .end((err, res) => {
                    console.log(res.body);
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });

    suite('POST /api/check', () => {
        // #6
        test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isTrue(res.body.valid);
                    done();
                });
        });

        // #7
        test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '8' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row']);
                    done();
                });
        });

        // #8
        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '1' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row', 'region']);
                    done();
                });
        });

        // #9
        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '2' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.isFalse(res.body.valid);
                    assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
                    done();
                });
        });

        // #10
        test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2' })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });

        // #11
        test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16...926914.37.X', coordinate: 'A2', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });

        // #12
        test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16..926914.37.', coordinate: 'A2', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });

        // #13
        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'Z9', value: '3' })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });

        // #14
        test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A2', value: '10' })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
    });
});

