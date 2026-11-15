import test from 'node:test';
import assert from 'node:assert/strict';

import { readStoredJson, writeStoredJson } from '../localState.mjs';

function memoryStorage(initial = {}) {
    const values = new Map(Object.entries(initial));
    return {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        value: key => values.get(key),
    };
}

test('reads valid JSON state', () => {
    const storage = memoryStorage({ progress: '{"known":4}' });
    assert.deepEqual(readStoredJson('progress', {}, storage), { known: 4 });
});

test('falls back when saved JSON is malformed or storage is blocked', () => {
    assert.deepEqual(readStoredJson('progress', { safe: true }, memoryStorage({ progress: '{bad' })), { safe: true });
    const blocked = { getItem: () => { throw new Error('blocked'); } };
    assert.deepEqual(readStoredJson('progress', { safe: true }, blocked), { safe: true });
});

test('writes JSON and reports unavailable storage without throwing', () => {
    const storage = memoryStorage();
    assert.equal(writeStoredJson('progress', { known: 4 }, storage), true);
    assert.equal(storage.value('progress'), '{"known":4}');
    assert.equal(writeStoredJson('progress', {}, null), false);
});
