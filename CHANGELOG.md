# Historial de la aplicación

## 0.3.0 — Piloto compartido para siete recorridos — 2026-09-09

- Envío explícito de expedientes ficticios desde la ruta participante a una base compartida.
- Nueva vista `Piloto compartido` con actualización periódica, búsqueda, filtro por ruta y meta de siete recorridos.
- Transformación transparente de respuestas en ruta A/B/C, señales de acompañamiento, estado del CV, avance y próxima acción.
- Persistencia D1 para recibir registros desde dispositivos diferentes; el resto de la demo mantiene su adaptación local.
- Validación del contenido en el servidor, límite de tamaño y actualización por correo ficticio para evitar duplicados.
- Página inicial orientada al recorrido participativo y al panel común.
- Guion operativo, alcance y límites documentados en `PILOTO_LUNES.md`.
- Modo de presentación con siete casos ficticios, separado de los registros recibidos en vivo.
- Nueva narrativa visual que muestra la transformación formulario → señales → ruta → próxima acción.

Esta versión utiliza exclusivamente información ficticia. El panel del piloto todavía no incluye cuentas ni control de acceso institucional.

## 0.2.0 — Panel, oportunidades y rutas — 2026-09-08

- Nuevo sistema visual: navegación lateral, tipografía DM Sans local, iconos Phosphor, tablas compactas y gráficas Recharts sin animaciones decorativas.
- Cinco vistas del equipo: resumen, participantes, empresas, observatorio salarial y rutas. Filtros del panel persistentes y exportación CSV.
- Doce escenarios de participantes, seis empresas ficticias, ocho oportunidades y diecinueve plazas simuladas, separados de los registros originales.
- Cuestionario, actividades explicadas, avance guardado y revisión humana. Historias de Julia, Helena y Laura accesibles desde la participante y el equipo.
- Referencias oficiales Guatemala 2026 CE1/CE2, base e incentivo separados, comparación individual y exclusión de jornadas no equivalentes en comparaciones salariales.
- Compatibilidad con la clave local v1, protección de borradores y conservación del historial original. Cambiar estados no genera documentos ni contrataciones.
- Inicio de presentación desde la versión compilada, guion de demostración y metodología documentados.

El registro de pruebas actualizado está en `PRUEBAS_MANUALES.md`. No se publicaron datos ni se conectaron empresas o servicios de empleo reales.

## 0.1.0 — Primera entrega — 2026-09-08

- Proyecto separado en `TALENTIA_App`, conservando intacto `TALENTIA_Cerebro_v1`.
- Flujo local de registro ficticio y perfil laboral parcial.
- Vista del equipo con búsqueda por nombre o correo, filtros de programa y estado y consulta de expediente.
- Cambio manual de estado con confirmación e historial de fecha, estado anterior, estado nuevo y responsable `Equipo demo`.
- Persistencia local y conservación de borradores; errores de escritura y lectura deben ser visibles.
- Doce participantes ficticios de la fuente, conservando dos graduadas técnicas y sin inventar perfiles, rutas ni CV.
- Documentación de inicio, decisiones provisionales, trazabilidad y pruebas reproducibles.
- Archivo `Iniciar TALENTIA.cmd` para iniciar la aplicación con doble clic después de instalar las dependencias.

Validación realizada: 17/17 pruebas de lógica; TypeScript, lint y compilación correctos; 4/4 pruebas de HTML renderizado. Las rutas de inicio, participante y equipo respondieron HTTP 200 tras reiniciar el servidor local. Los SHA-256 de los 18 archivos del cerebro se mantienen iguales a los del inicio.

El recorrido visual en navegador, móvil y teclado queda pendiente porque no había navegador conectado. El detalle de lo verificado y lo pendiente está en `PRUEBAS_MANUALES.md`.

El alcance excluye diagnóstico, ruta, CV, indicadores avanzados, autenticación real y conexiones externas. No hay publicación autorizada ni datos reales.
