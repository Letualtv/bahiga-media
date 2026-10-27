import { leer } from './github';
import type { Pub } from './util';

export async function cola(): Promise<Pub[]> {
  const { datos } = await leer<{ publicaciones: Pub[] }>('publicador/cola.json');
  return (datos.publicaciones || []).filter((p) => !p.ensayo);
}
export const informe = async () => (await leer<any>('publicador/informe.json', { defecto: {} })).datos;
export const historial = async () => (await leer<any[]>('publicador/informe-historial.json', { defecto: [] })).datos;
export const competencia = async () => (await leer<any>('publicador/competencia.json', { defecto: { cuentas: {} } })).datos;
export const cuentasVigiladas = async () => (await leer<{ cuentas: string[] }>('publicador/competencia-cuentas.json', { defecto: { cuentas: [] } })).datos.cuentas;
export const ideas = async () => (await leer<{ ideas: any[] }>('ideas/ideas.json', { defecto: { ideas: [] } })).datos.ideas;
export const comentarios = async () => (await leer<any>('publicador/comentarios-estado.json', { defecto: null })).datos;

export function metricas28(inf: any) {
  return Object.fromEntries((inf?.instagram_cuenta_28d?.data || []).map((m: any) => [m.name, m.total_value?.value]));
}
