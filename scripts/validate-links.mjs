import { readFile } from 'node:fs/promises';

const generated = JSON.parse(await readFile('platform/src/content/generated-course.json', 'utf8'));
const requiredSource = await readFile('platform/src/content/required-chapters.ts', 'utf8');
const urls = [...new Set([
  ...generated.chapters.flatMap(chapter => chapter.resources.map(resource => resource.url)),
  ...[...requiredSource.matchAll(/'https:\/\/[^']+'/g)].map(match => match[0].slice(1, -1))
])].sort();

async function request(url, method, timeout = 15_000) {
  return fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(timeout),
    headers: {
      'user-agent': 'java4br-link-audit/1.0',
      ...(method === 'GET' ? { range: 'bytes=0-1023' } : {})
    }
  });
}

async function check(url) {
  let lastError = 'erro desconhecido';
  for (const timeout of [15_000, 30_000]) {
    try {
      let response = await request(url, 'HEAD', timeout);
      if ([400, 405, 501].includes(response.status)) response = await request(url, 'GET', timeout);
      const reachable = response.status < 400 || [401, 403, 429].includes(response.status);
      return { url, status: response.status, reachable };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return { url, status: lastError, reachable: false };
}

const results = [];
const queue = [...urls];
await Promise.all(Array.from({ length: 6 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    if (url) results.push(await check(url));
  }
}));

const failures = results.filter(result => !result.reachable);
for (const result of results.sort((a, b) => a.url.localeCompare(b.url))) {
  console.log(`${String(result.status).padEnd(4)} ${result.url}`);
}
if (failures.length) {
  throw new Error(`${failures.length} de ${urls.length} links não responderam: ${failures.map(result => result.url).join(', ')}`);
}
console.log(`OK: ${urls.length} recursos externos responderam sem links quebrados.`);
