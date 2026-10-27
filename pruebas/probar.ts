import { writeFileSync } from 'node:fs';
import { diagnosticar } from './diagnostico.ts';
const webs = ['pulidoinmobiliaria.es', 'aovehaza.com', 'reparonovo.com', 'bahiga.es'];
const out: Record<string, unknown> = {};
const errores: string[] = []; console.error = (...a: unknown[]) => errores.push(a.map(String).join(' '));
for (const w of webs) {
  const t = Date.now();
  try { out[w] = { ...(await diagnosticar(w)), segundos: (Date.now() - t) / 1000 }; }
  catch (e) { out[w] = { error: (e as Error).message, segundos: (Date.now() - t) / 1000 }; }
}
out._errores = errores;
writeFileSync('pruebas/resultado.json', JSON.stringify(out, null, 1));
