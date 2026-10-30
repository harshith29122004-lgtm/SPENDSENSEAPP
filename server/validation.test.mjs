import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTransactions } from './validation.mjs';

const valid = {
  amount: 125.5,
  category: 'Food',
  date: '2026-10-30',
  type: 'expense',
  note: 'Lunch',
};

test('accepts a valid transaction list', () => {
  assert.deepEqual(validateTransactions([valid]), { ok: true });
});

test('rejects an empty or oversized transaction list', () => {
  assert.equal(validateTransactions([]).ok, false);
  assert.equal(validateTransactions(Array(501).fill(valid)).ok, false);
});

test('rejects invalid amounts', () => {
  assert.equal(validateTransactions([{ ...valid, amount: -1 }]).ok, false);
  assert.equal(validateTransactions([{ ...valid, amount: '125' }]).ok, false);
});

test('rejects unsupported types and categories', () => {
  assert.equal(validateTransactions([{ ...valid, type: 'transfer' }]).ok, false);
  assert.equal(validateTransactions([{ ...valid, category: 'Unknown' }]).ok, false);
});

test('rejects excessively long notes', () => {
  assert.equal(validateTransactions([{ ...valid, note: 'x'.repeat(301) }]).ok, false);
});