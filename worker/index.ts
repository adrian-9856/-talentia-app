/** TALENTIA serves pages; participant data stays in the local demo adapter. */
import handler from "vinext/server/app-router-entry";
import { pilotSubmissionsSchema } from "../db/schema.ts";
import { parsePilotSubmission, transformPilotSubmission } from "../src/domain/pilot.ts";

type Statement = {
  bind(...values: unknown[]): Statement;
  run(): Promise<unknown>;
  all<T>(): Promise<{ results: T[] }>;
};
type Database = { prepare(query: string): Statement };
type Env = { DB: Database; ASSETS?: { fetch(request: Request): Promise<Response> | Response } };
type PilotRow = { id: string; input_json: string; result_json: string; created_at: string; updated_at: string };

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

async function pilotApi(request: Request, env: Env) {
  await env.DB.prepare(pilotSubmissionsSchema).run();
  if (request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT id, input_json, result_json, created_at, updated_at FROM pilot_submissions ORDER BY updated_at DESC LIMIT 1000").all<PilotRow>();
    return json({ records: results.map(row => ({ id: row.id, ...JSON.parse(row.input_json), ...JSON.parse(row.result_json), createdAt: row.created_at, updatedAt: row.updated_at })) });
  }
  if (request.method !== "POST") return json({ error: "Método no permitido." }, 405);
  if (Number(request.headers.get("content-length") ?? 0) > 100_000) return json({ error: "El expediente supera el tamaño permitido." }, 413);
  try {
    const input = parsePilotSubmission(JSON.parse(await request.text()));
    const result = transformPilotSubmission(input);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    await env.DB.prepare(`INSERT INTO pilot_submissions (id, participant_id, email, name, municipality, program_id, route_code, input_json, result_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET id = excluded.id, participant_id = excluded.participant_id, name = excluded.name, municipality = excluded.municipality,
      program_id = excluded.program_id, route_code = excluded.route_code, input_json = excluded.input_json, result_json = excluded.result_json,
      created_at = excluded.created_at, updated_at = excluded.updated_at`)
      .bind(id, input.participantId, input.email, input.name, input.municipality, input.programId, result.routeCode, JSON.stringify(input), JSON.stringify(result), now, now).run();
    return json({ record: { id, ...input, ...result, createdAt: now, updatedAt: now } }, 201);
  } catch (cause) {
    return json({ error: cause instanceof Error ? cause.message : "No se pudo guardar el expediente." }, 400);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: Parameters<typeof handler.fetch>[2]) {
    const url = new URL(request.url);
    if (url.pathname === "/api/pilot/participants") return pilotApi(request, env);
    return handler.fetch(request, env, ctx);
  },
};
