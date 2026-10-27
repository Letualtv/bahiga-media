// Genera el valor de PANEL_PASS_HASH a partir de la contraseña (no se guarda en ningún sitio).
// Uso: node scripts/hash.mjs   (pide la contraseña sin mostrarla)
import { scryptSync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';
const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl._writeToOutput = (s) => { if (!s.includes('Contraseña')) return; rl.output.write(s); };
rl.question('Contraseña: ', (p) => {
  rl.close();
  if (!p || p.length < 10) { console.error('\nUsa al menos 10 caracteres.'); process.exit(1); }
  const sal = randomBytes(16).toString('hex');
  console.log(`\nscrypt$${sal}$${scryptSync(p, sal, 64).toString('hex')}`);
});
