# Pruebas de TALENTIA 0.3

Fecha de verificación: **2026-09-09**. Usar exclusivamente nombres ficticios y correos `@example.com`. Las pruebas automatizadas y las comprobaciones HTTP indicadas al final fueron ejecutadas. El recorrido visual, móvil y teclado siguen pendientes: no había un navegador conectado.

## Recorrido de aceptación

Guion pendiente de ejecución interactiva en navegador. La secuencia de datos equivalente ya se comprobó mediante pruebas automatizadas.

1. Iniciar con `npm start` después de compilar y abrir la dirección mostrada. Confirmar que la entrada permite elegir participante y equipo y que indica que es una demostración.
2. En `/participante`, registrar `Marina Ensayo` y `marina.ensayo@example.com`, elegir municipio y programa del catálogo y aceptar el consentimiento. Dejar teléfono vacío. Debe crearse una sola persona con estado `Registrada` y permitir continuar al perfil.
3. Escribir un objetivo laboral ficticio y una habilidad; guardar el perfil parcial. Debe guardar sin exigir que toda pregunta esté contestada y sin afirmar “perfil completo”.
4. Recargar, volver al perfil y comprobar que ambos textos se mantienen. Editar un borrador, cambiar de pantalla y volver: lo escrito debe conservarse.
5. Abrir `/equipo/participantes`, buscar `Marina Ensayo` y después su correo. Abrir su expediente y comprobar municipio, programa y el perfil guardado. Los filtros aplicados deben conservarse al cerrar el detalle.
6. Elegir un estado distinto. Cancelar la confirmación: el estado y el historial deben seguir iguales. Repetir y confirmar: deben aparecer estado anterior, nuevo, fecha y `Equipo demo`.
7. Recargar y comprobar estado e historial. Confirmar que el cambio no ha generado rutas, CV ni logros adicionales.

## Panel, cuestionario y rutas

1. Abrir `/equipo` sin filtros: mostrar los 12 expedientes iniciales, 6 empresas relacionadas y 19 plazas ficticias si aún se conservan todos los escenarios. Los cambios locales pueden modificar esos indicadores.
2. Elegir ocupación Barista. Deben aparecer 2 participantes, 1 empresa y 4 plazas relacionadas. Abrir un expediente y volver: los filtros del panel se conservan. Limpiar filtros.
3. En `/participante`, elegir Julia Ejercicio o seleccionarla en «Cambiar expediente del demo». Abrir cuestionario: barista, expectativa base 4500, experiencia 0 meses, CV no actualizado, formación solicitada. Preparar ruta.
4. Comprobar los motivos de cada actividad. Cambiar el CV a «En proceso», recargar y comprobar persistencia. Desde el equipo, registrar revisión y comprobar actor/fecha. Un cambio posterior de perfil o actividad debe invalidarla.
5. Editar respuestas después de tener avance. Debe explicar y requerir confirmar que una nueva ruta reinicia las actividades; el expediente y su historial se conservan.
6. En oportunidades de Julia, ver Barista inicial y Barista de estación. El segundo puesto sigue visible aunque solicite 6 meses de experiencia; esto queda por conversar.
7. En `/equipo/salarios`, verificar Q4,002.28 base + Q250 = Q4,252.28 y brecha base Q497.72 frente a Julia. No sumar incentivo a una expectativa que se declaró base.
8. Cambiar CE1/CE2 en mínimos: solo cambia la tabla oficial; la referencia del comparador sigue fijada por la oferta seleccionada.
9. Elegir Gabriela o Karla en una oferta de su ocupación: al declarar medio tiempo no debe compararse automáticamente su salario con jornada completa, tampoco en la lista de conexiones.
10. Abrir Laura: su primera actividad debe ser acordar un canal accesible. Abrir Helena: debe conservar su experiencia informal de agenda, recibos y archivo sin inventar certificados.
11. Exportar CSV desde panel y salarios. Comprobar que refleja el filtro actual, usa encabezados claros y no incluye salarios de mercado supuestos.
12. Abrir desde equipo un expediente sin ruta y pulsar «Abrir vista participante»: debe seleccionar esa misma persona, aunque estuviera activa otra anteriormente.

## Piloto compartido con siete participantes

1. Abrir `/participante` en dos navegadores o dispositivos distintos y crear un registro ficticio diferente en cada uno.
2. Completar perfil, cuestionario y ruta. En la ruta debe aparecer **Enviar al panel** solamente para registros creados por la persona, no para historias precargadas.
3. Antes de enviar, abrir `/equipo/piloto`: el expediente todavía no debe aparecer.
4. Pulsar **Enviar al panel** y comprobar el mensaje de éxito.
5. En menos de diez segundos, el panel debe mostrar el nuevo recorrido sin recargar toda la página.
6. Abrir el registro y verificar ruta, señales, estado del CV, avance y próxima acción frente a las respuestas originales.
7. Editar el recorrido local, volver a enviarlo con el mismo correo ficticio y comprobar que se actualiza sin aumentar el total.
8. Enviar siete correos ficticios diferentes y comprobar la métrica `7` frente a la meta de la sesión.
9. Buscar por nombre, municipio u ocupación y filtrar por A, B y C.
10. Desconectar temporalmente el servidor: tanto envío como panel deben mostrar un error y permitir reintentar sin afirmar que se guardó.

## Formularios y lista

| Caso | Resultado esperado |
|---|---|
| Enviar registro vacío | Errores junto a los campos obligatorios; no se crea persona. |
| Omitir consentimiento | No permite continuar; conserva lo escrito. |
| Correo `marina@` o un dominio distinto de `example.com` | Error de formato o convención de demo comprensible. |
| Usar el correo de Marina con mayúsculas o espacios exteriores | Detecta duplicado; no aumenta la lista. |
| Hacer doble clic en registrar | Crea una sola persona e identificador. |
| Escribir teléfono sin prefijo internacional | No exige ese formato. |
| Municipio o programa sin elegir | Señala campo obligatorio; solo se aceptan opciones del catálogo. |
| Buscar texto inexistente | Explica que no hay coincidencias y permite limpiar búsqueda o filtros. |
| Combinar programa y estado | Todas las filas cumplen ambos filtros y cualquier total visible coincide. |
| Abrir una muestra original | Conserva sus datos y estado; el perfil complementario se identifica como escenario ficticio. Las consultas no cambian el consentimiento ni materializan perfiles por sí solas. |
| Consultar el conjunto inicial | Hay 12 muestras; tres graduadas, de ellas dos técnicas. |
| Intentar guardar el mismo estado | No produce un evento de cambio duplicado. |

## Almacenamiento y recuperación

Realizar estos casos en un perfil de navegador reservado para pruebas. Antes de alterar almacenamiento, copiar el valor de `talentia.demo.v1` como indica el README.

- **Primera visita:** sin una clave existente, se cargan las muestras una sola vez. Recargar después de una edición no restaura los valores originales.
- **Lista vacía:** preparar un conjunto vacío válido mediante el adaptador de pruebas. La pantalla ofrece registrar una persona; no repuebla silenciosamente las muestras.
- **JSON corrupto:** en las herramientas del navegador, sustituir temporalmente el valor de la clave por `{` y recargar. Debe mostrarse un error recuperable sin reemplazar ese contenido por muestras.
- **Formato desconocido:** guardar temporalmente `{"schemaVersion":"desconocida"}` en la clave y recargar. Debe impedir una sobrescritura silenciosa y explicar el problema de lectura/formato.
- **Lectura denegada:** simular que el adaptador de almacenamiento lanza `SecurityError`. Debe informarse el error sin afirmar que los expedientes se cargaron correctamente.
- **Escritura denegada o sin cuota:** simular que `setItem` lanza `SecurityError` o `QuotaExceededError` al registrar, guardar perfil o cambiar estado. Debe conservarse la entrada, mostrarse el fallo y evitar anunciar un guardado exitoso. El último contenido persistido debe mantenerse.
- **Tras recuperación:** restaurar la copia válida en el navegador de pruebas y recargar; los expedientes deben reaparecer sin duplicados. No modificar el almacenamiento de otros sitios.

Los fallos de lectura y cuota pueden comprobarse con un adaptador de prueba que lance esas excepciones; no es necesario llenar el disco ni todo el almacenamiento del navegador.

## Presentación y accesibilidad

Pendiente de ejecución visual en escritorio y teléfono:

- Probar a 390 px de ancho y en una ventana de escritorio: lectura, formularios, detalle y confirmación utilizables sin contenido cortado.
- Recorrer registro, búsqueda y cambio de estado con Tab, Shift+Tab, Enter y Espacio. El foco debe verse y permanecer accesible al abrir/cerrar la confirmación.
- Confirmar que campos tienen etiquetas y que errores/estados se comprenden sin depender solo del color.
- Comprobar carga, ausencia de datos, resultado y error. Todo control visible debe funcionar o indicar claramente por qué está deshabilitado.
- Confirmar que volver entre pantallas conserva datos y que la vista participante no muestra controles de cambio de estado del equipo.

## Registro de ejecución

Ejecutar desde `TALENTIA_App`:

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm run test:render
```

| Verificación | Estado | Evidencia / observación |
|---|---|---|
| Pruebas de lógica | Correcto: 38/38 | `npm test`: flujo inicial, cuestionarios, rutas, revisión, transformación del piloto, validación, salarios, jornadas, escenarios, filtros persistentes, compatibilidad v1, corrupción y cuota. |
| TypeScript | Correcto | `npm run typecheck` finalizó sin errores. |
| Lint | Correcto | `npm run lint` finalizó sin errores. |
| Compilación | Correcto | `npm run build` finalizó correctamente. |
| HTML renderizado | Correcto: 10/10 | `npm run test:render`: inicio, participante, seis rutas del equipo, página 404 y navegación segura. |
| API compartida local | Correcto | `GET /api/pilot/participants` respondió 200; un expediente ficticio de integración respondió 201 y produjo ruta, señales, estado documental y próxima acción. |
| Fuente del cerebro | Conservada | La implementación y documentación nuevas se escriben exclusivamente dentro de `TALENTIA_App`. La verificación de SHA-256 registrada en 0.1 corresponde a la primera entrega. |
| Corrupción y cuota | Correcto en lógica | Comprobadas con el almacenamiento de pruebas; la presentación del error en navegador queda pendiente. |
| Recorrido completo en navegador | Pendiente | No había navegador conectado; registrar navegador, fecha y resultado cuando se ejecute. |
| Teléfono y teclado | Pendiente | Sin ejecución visual; registrar tamaño de ventana y observaciones. |
| Denegación de acceso y recuperación manual | Pendiente | Comprobar presentación y recuperación en un navegador de pruebas. |

Por cada fallo registrar tarea, resultado esperado, observado y corrección. Las capturas y evidencias deben contener únicamente datos ficticios.
