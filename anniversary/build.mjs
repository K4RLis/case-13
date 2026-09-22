// Собирает anniversary/index.html: страница с паролем + зашифрованный сайт.
// Фото и текст шифруются паролем (AES-GCM, ключ из PBKDF2), поэтому в публичном
// репозитории без пароля их не видно.
//
//   node anniversary/build.mjs "пароль"
//
// Фото берутся из anniversary/photos/1.jpg … 5.jpg (папка в .gitignore).
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const ITER = 250000;

// Должно совпадать с normalize() на странице входа.
const normalize = s => s.trim().toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, '');

const pwd = normalize(process.argv[2] || '');
if (!pwd) { console.error('Использование: node anniversary/build.mjs "пароль"'); process.exit(1); }

let html = readFileSync(join(dir, 'src/content.html'), 'utf8');
html = html.replace(/\{\{PHOTO_(\d+)\}\}/g, (_, n) =>
  'data:image/jpeg;base64,' + readFileSync(join(dir, 'photos', `${n}.jpg`)).toString('base64'));

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(pwd), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
  km, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(html)));
const payload = Buffer.concat([salt, iv, ct]).toString('base64');

const page = readFileSync(join(dir, 'src/lock.html'), 'utf8')
  .replace('{{ITER}}', String(ITER))
  .replace('{{PAYLOAD}}', payload);
writeFileSync(join(dir, 'index.html'), page);
console.log(`anniversary/index.html готов (${(page.length / 1048576).toFixed(1)} МБ)`);
