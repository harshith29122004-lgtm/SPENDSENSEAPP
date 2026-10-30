const ALLOWED_TYPES = new Set(['income', 'expense']);
const ALLOWED_CATEGORIES = new Set([
  'Food', 'Travel', 'Shopping', 'Rent', 'Health', 'Salary', 'Freelance', 'Other',
]);

export function validateTransactions(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 500) {
    return { ok: false, error: 'Provide between 1 and 500 transactions.' };
  }

  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return { ok: false, error: 'Each transaction must be an object.' };
    }
    if (!Number.isFinite(item.amount) || item.amount < 0 || item.amount > 1_000_000_000) {
      return { ok: false, error: 'Each transaction must have a valid non-negative amount.' };
    }
    if (!ALLOWED_TYPES.has(item.type) || !ALLOWED_CATEGORIES.has(item.category)) {
      return { ok: false, error: 'A transaction contains an unsupported type or category.' };
    }
    if (typeof item.date !== 'string' || item.date.length > 40) {
      return { ok: false, error: 'Each transaction must include a valid date.' };
    }
    if (typeof item.note === 'string' && item.note.length > 300) {
      return { ok: false, error: 'Transaction notes must be 300 characters or fewer.' };
    }
  }

  return { ok: true };
}