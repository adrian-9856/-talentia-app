import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const { default: worker } = await import("../dist/server/index.js");
async function render(path) {
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} });
}

test("entrada renderizada tiene identidad TALENTIA y enlaces a ambas vistas", async () => {
  const response = await render("/"); assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<html[^>]*lang="es"/); assert.match(html, /<title>TALENTIA/);
  assert.match(html, /Soy participante/); assert.match(html, /Administro el piloto/);
  assert.match(html, /href="\/participante"/); assert.match(html, /href="\/equipo\/piloto"/);
  assert.match(html, /Datos ficticios/); assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Starter Project|react-loading-skeleton/);
});
for (const path of ["/participante", "/equipo", "/equipo/participantes", "/equipo/piloto", "/equipo/empresas", "/equipo/salarios", "/equipo/rutas"]) {
  test(`ruta ${path} carga sin acceder a localStorage desde el servidor`, async () => {
    const response = await render(path); assert.equal(response.status, 200);
    const html = await response.text(); assert.match(html, /TALENTIA/); assert.match(html, /role="status"/);
    assert.doesNotMatch(html, /Internal Server Error|window is not defined/);
  });
}
test("una ruta inexistente responde 404", async () => {
  const response = await render("/ruta-inexistente"); assert.equal(response.status, 404);
});
test("la navegación evita el prefetch defectuoso de Vinext", async () => {
  const files = ["analytics-shared", "companies-screen", "dashboard-screen", "home-screen", "journey-components", "participant-screen", "pilot-admin-screen", "pilot-share", "routes-screen", "salary-screen", "team-screen", "shared"];
  const sources = await Promise.all(files.map(name => readFile(new URL(`../src/components/${name}.tsx`, import.meta.url), "utf8")));
  assert.ok(sources.every(source => !source.includes('next/link')));
});
