'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluate } = require('../domain');

test('domain workflow accepts a grounded reviewable case', () => {
  const evaluation = evaluate({
  experiment: { id: 'e1', version: 'v2', modelVersion: 'm3', modelSha256: 'b'.repeat(64),
    parameters: [{ name: 'temperature', unit: 'K', value: 300, min: 0, max: 1000 }],
    resourceCaps: { cpuSeconds: 60, memoryMb: 1024 } },
  dataset: { version: 'd1', sha256: 'c'.repeat(64) },
  runs: [{ id: 'r1', seed: 42, engineVersion: 'eng1', simulated: true, resources: { cpuSeconds: 10, memoryMb: 128 },
    artifactSha256: 'd'.repeat(64), inputSha256: 'e'.repeat(64), userCode: false }],
  referenceCases: [{ id: 'ref1', actual: 1.001, expected: 1, tolerance: 0.01 }],
  comparisons: [{ left: 'r1' }],
  validation: { unitSystemVersion: 'si-1', numericalMethodVersion: 'rk4-1',
    sensitivityCases: [{ parameter: 'temperature', delta: 1, response: 0.01 }],
    errorCases: [{ expectedError: 'range', actualError: 'range' }] },
  report: { version: 'rep1', sha256: 'f'.repeat(64), runIds: ['r1'] }
});
  assert.deepEqual(evaluation.errors, []);
  assert.equal(evaluation.result.decision, 'reviewable');
  assert.ok(Array.isArray(evaluation.assumptions));
  assert.equal(typeof evaluation.uncertainty, 'object');
});

test('domain workflow fails closed on incomplete or unsafe input', () => {
  const evaluation = evaluate({ experiment: {}, dataset: {}, runs: [{ id: 'r', seed: 1, simulated: false, userCode: true, resources: {} }], referenceCases: [] });
  assert.ok(evaluation.errors.length > 0);
  assert.notEqual(evaluation.result.decision, 'reviewable');
});
