# TALENTIA — Piloto de gestión y acompañamiento

Piloto funcional para que varias personas completen un recorrido inicial y una operadora reciba sus resultados transformados en una bandeja común. También permite explorar oportunidades ficticias, contexto salarial y rutas explicadas.

El proyecto está en `TALENTIA_App`, junto a `TALENTIA_Cerebro_v1`. La documentación original del cerebro se conserva sin modificaciones. Esta entrega funciona localmente y no está publicada.

## Iniciar

Se recomienda **Node.js 24** con npm. El proyecto admite Node.js desde 22.13 para el entorno; las pruebas directas de TypeScript requieren al menos 22.18. No se necesitan cuentas, claves, APIs ni variables de entorno.

Desde una terminal en esta carpeta:

```powershell
npm install
npm run build
npm start
```

Para las siguientes veces, hacer doble clic en [Iniciar TALENTIA.cmd](<Iniciar TALENTIA.cmd>): abre la versión compilada con las dependencias ya instaladas. Mantener abierta esa ventana mientras se use TALENTIA. Para desarrollar con recarga automática, usar `npm run dev`; volver a compilar después de editar para actualizar la versión de presentación.

Abrir `http://localhost:3000`, o la dirección que muestre la terminal si el puerto es distinto. Usar siempre la misma dirección para recuperar los mismos datos locales. Rutas:

| Ruta | Uso |
|---|---|
| `/` | Entrada a las dos vistas de demostración |
| `/participante` | Registro → perfil → cuestionario → propuesta de ruta → envío al panel común |
| `/equipo` | Panel de indicadores, filtros persistentes, talento/demanda, salarios y próximos pasos |
| `/equipo/participantes` | Búsqueda, filtros, expediente, ruta, oportunidades e historial |
| `/equipo/piloto` | Recepción compartida de los siete recorridos y transformación operativa |
| `/equipo/empresas` | Seis empresas ficticias, ocho oportunidades y conexiones explicadas |
| `/equipo/salarios` | Expectativas, ofertas y mínimos oficiales Guatemala 2026; comparador individual |
| `/equipo/rutas` | Historias de Julia, Helena y Laura; actividades y revisión del equipo |

El selector de vistas no constituye autenticación ni permisos reales.

## Qué incluye

- Registro con nombre ficticio, correo `@example.com`, municipio, programa y consentimiento de demostración; teléfono opcional.
- Validación de correo y duplicados, con conservación de lo escrito cuando hay errores.
- Perfil laboral que admite guardado parcial y conservación de borradores.
- Lista del equipo con búsqueda por nombre o correo y filtros de programa y estado.
- Expediente y cambios manuales de estado con confirmación, fecha y responsable fijo `Equipo demo`.
- Doce registros originales conservados y doce escenarios ficticios adicionales para recorrer la demo, sin convertirlos en información verificada ni modificar la fuente.
- Seis empresas, ocho oportunidades y diecinueve plazas simuladas. Conexiones por ocupación compartida, con experiencia, condiciones, salario y jornada por conversar.
- Cuestionario opcional con hasta cinco actividades explicadas; guardado de borradores, seguimiento y revisión humana. Regenerar una ruta con avance requiere confirmación.
- Comparador salarial con base e incentivo separados; solo se comparan expectativas y ofertas de la misma jornada. Exportación CSV del panel y del resumen salarial.
- Envío explícito de un expediente ficticio a la base compartida del piloto.
- Panel común que actualiza los recorridos, propone A/B/C y explica señales, CV, avance y próxima acción.

Los estados históricos de las muestras se conservan, incluidas las dos graduadas de formación técnica. Una etiqueta de estado no demuestra que exista una ruta, un CV ni una evaluación. Los estados y el consentimiento están pendientes de validación institucional. No se calcula “perfil completo”.

## Datos locales y piloto compartido

Mientras se completa un recorrido, la información se guarda en el navegador mediante `localStorage`, con la clave `talentia.demo.v1`. Al pulsar **Enviar al panel**, una copia se guarda en D1 y queda visible en `/equipo/piloto` desde los demás dispositivos conectados a la misma versión publicada. Solo se permite usar datos ficticios.

No borrar los datos del sitio para resolver un error sin guardar antes una copia. Para conservar una copia local del expediente de demostración, abrir las herramientas de desarrollo del navegador, ir a **Aplicación/Almacenamiento → Local Storage**, seleccionar la dirección de TALENTIA y copiar el valor de `talentia.demo.v1` a un archivo `.json` con fecha. Esta copia manual no equivale a una función de importación; revisar el formato y su versión antes de una restauración técnica. No almacenar datos reales en esas copias.

## Verificación

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm run test:render
```

La validación cubre registro, perfiles, borradores, persistencia, rutas, transformación del piloto, revisiones, conexiones y salarios. Consultar [PRUEBAS_MANUALES.md](PRUEBAS_MANUALES.md) para el registro actualizado.

`test:render` necesita la compilación previa. La revisión visual, el recorrido interactivo, móvil y teclado quedan pendientes porque no había un navegador conectado. Las pruebas automatizadas verifican lógica y HTML; no sustituyen ese recorrido. Detalle en [PRUEBAS_MANUALES.md](PRUEBAS_MANUALES.md).

Tecnologías: React, TypeScript, Vinext, Vite, Recharts, iconos Phosphor y tipografía DM Sans alojada localmente. Estructura:

- `app/`: rutas de la aplicación.
- `src/components/`: pantallas y componentes.
- `src/domain/`: configuración, tipos, reglas y transformación del piloto.
- `db/` y `drizzle/`: esquema y migración de la bandeja compartida.
- `src/data/demo.json`: muestras ficticias.
- `src/data/labor-market.ts`: escenarios adicionales, empresas, oportunidades y referencias salariales.
- `app/studio.css`: sistema visual y adaptación a pantallas pequeñas.
- `tests/`: pruebas de lógica y HTML renderizado.

Las reglas y el almacenamiento están separados de las pantallas. La versión 0.3 conserva la demo local y comparte únicamente los registros enviados de forma explícita.

## Continuación

Consultar [PILOTO_LUNES.md](PILOTO_LUNES.md) para preparar y ejecutar la sesión funcional con siete participantes. La visión del CRM, las rutas A/B/C y la evolución propuesta están en [LLUVIA_DE_IDEAS_CRM_Y_RUTAS.md](LLUVIA_DE_IDEAS_CRM_Y_RUTAS.md). Las decisiones provisionales y la trazabilidad están en [DECISIONES.md](DECISIONES.md), el alcance de la entrega en [CHANGELOG.md](CHANGELOG.md) y la aceptación reproducible en [PRUEBAS_MANUALES.md](PRUEBAS_MANUALES.md).

La nueva ampliación fue solicitada para presentar el valor del sistema. Las reglas son transparentes y provisionales: no hay puntuación de empleabilidad, selección automática, postulaciones, CV generado, empresas conectadas ni resultados de inserción acreditados. Antes de un piloto con personas reales deben definirse autenticación, permisos, consentimiento institucional, conservación y copias de seguridad.

Para presentar el producto, seguir [GUION_DEMO.md](GUION_DEMO.md). Las cifras oficiales, fuentes y reglas de comparación se documentan en [METODOLOGIA_DEMO.md](METODOLOGIA_DEMO.md).
