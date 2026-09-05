import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('the page uses one same-origin organic mark for both browser icons', async () => {
  const [page, app, mark] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('src/App.jsx', root), 'utf8'),
    readFile(new URL('public/gmgu-mark.svg', root), 'utf8')
  ]);

  assert.match(page, /<link rel="icon" type="image\/svg\+xml" href="\/gmgu-mark\.svg" \/>/);
  assert.match(page, /<link rel="apple-touch-icon" href="\/gmgu-mark\.svg" \/>/);
  assert.doesNotMatch(page, /<link\b[^>]*rel="(?:icon|apple-touch-icon)"[^>]*href="https?:\/\//i);
  assert.doesNotMatch(page + app, /qslzgTU/i);

  assert.match(mark, /<svg\b/i);
  assert.match(mark, /<path\b/i);
  assert.doesNotMatch(mark, /<(?:circle|ellipse|image)\b/i);
  assert.doesNotMatch(mark, /\b(?:href|src)=["']https?:/i);
});
