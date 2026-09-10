# TALENTIA como CRM de acompañamiento y rutas laborales

**Documento de visión y lluvia de ideas priorizada**  
**Fecha:** 9 de septiembre de 2026  
**Estado:** Propuesta para conversar con la Unidad de Inserción Laboral; todavía no representa reglas aprobadas.

## 0. Ajuste después de revisar la conversación con la entidad contratante

### La necesidad real

La conversación confirma que TALENTIA no se está creando porque la organización quiera otro tablero ni porque pueda contratar un equipo grande. El modelo original de Unidad de Inserción Laboral distribuía el trabajo entre cuatro o cinco roles, pero la mayoría de centros tendrá **una persona responsable y, en el mejor de los casos, dos**.

Por eso, la definición correcta del producto es:

> **TALENTIA es una Unidad de Inserción Laboral digital que automatiza el trabajo repetitivo para que una o dos personas puedan ordenar, preparar, localizar y acompañar talento a escala.**

El CRM es una parte del producto, pero la expectativa es más amplia: captar información, transformarla, producir documentos, mover etapas, avisar, presentar inventarios de talento y dejar lista la información para la colocación laboral.

### Conclusión sobre la lluvia de ideas anterior

La propuesta de dos vistas y rutas A/B/C sí responde a una parte de lo solicitado. Sin embargo, requiere tres correcciones de prioridad:

1. **La automatización debe ser el centro.** La ruta visual es la interfaz que permite que la participante complete trabajo sin depender continuamente de una técnica.
2. **La vista principal del producto debe ser la cabina de una sola operadora.** Debe mostrar excepciones, pendientes y acciones masivas; no obligarla a revisar expedientes uno por uno.
3. **La salida final debe acercarse a la inserción laboral.** Además de mejorar perfiles, el sistema debe permitir localizar grupos preparados cuando una empresa solicita determinado talento.

### Prueba de valor principal

La mejor demostración ya no sería solamente “Julia recibió una ruta personalizada”. Debería demostrar dos situaciones:

- **Caso individual:** Julia completa información, recibe una ruta, obtiene un borrador de CV y el sistema solo pide intervención humana cuando corresponde revisar o decidir.
- **Caso grupal:** una empresa solicita 25 perfiles de una ocupación; la responsable filtra cohorte, formación, disponibilidad, documentación y preparación, y en pocos minutos obtiene un grupo revisable.

El objetivo no debe formularse como “una persona colocará automáticamente a 500 participantes”. La tecnología puede administrar y preparar un volumen alto, pero la relación con empresas y las decisiones de colocación todavía requieren capacidad humana. Una meta responsable sería:

> **Una operadora puede saber en minutos qué ocurre con 500 expedientes, concentrar su tiempo en las excepciones y preparar grupos pertinentes sin reconstruir información manualmente.**

### Requisitos que aparecen de manera clara en la conversación

| Necesidad expresada | Implicación para TALENTIA |
|---|---|
| Operar con una o dos personas | Autoservicio, automatización y bandeja de excepciones. |
| Evitar archivos dispersos | Expediente único con documentos, perfil, ruta, CV y seguimiento. |
| Explicar cada fase con detalle | Mostrar entrada, transformación, salida y responsable de cada proceso. |
| Empezar desde el ingreso a la formación | Crear el expediente al inicio y actualizarlo durante la trayectoria formativa. |
| Manejar cientos de participantes | Acciones masivas, filtros, cohortes, carreras y cursos a la medida. |
| Conocer quién está preparado | Estados verificables por dimensión, sin depender de una nota opaca. |
| Responder a demandas grandes de empresas | Inventario de talento y búsqueda grupal por requisitos. |
| Reducir trabajo de CV | Generar un borrador y enviar solamente la revisión final a una persona. |
| Automatizar avisos y citas | Plantillas, programación, recordatorios y registro automático del contacto. |
| Mostrar datos individuales y agregados | Expediente 360 y tablero por institución, programa, cohorte y carrera. |
| Evitar demasiadas herramientas | Un flujo central, con integraciones solo donde reduzcan trabajo real. |
| Transferirlo a otras organizaciones | Configuración institucional, manual integrado y capacitación. |
| Evitar dependencia de un programador | Formularios, catálogos, rutas y reglas editables desde administración. |
| Mantener costos sostenibles | Hosting y licencias explícitos, bajos y asumibles después del proyecto. |
| Trabajar con equipos modestos | Aplicación web ligera, móvil y usable en tabletas o computadoras administrativas. |

### Modelo operativo para una persona

```text
PARTICIPANTE            TALENTIA                         OPERADORA
────────────────        ─────────────────────────        ─────────────────────
Llena formularios   →   valida campos y guarda      →   revisa excepciones
Adjunta documentos  →   clasifica y marca faltantes →   valida lo necesario
Cuenta su experiencia→  prepara resumen y CV        →   corrige versión final
Completa actividades→   actualiza etapa y progreso  →   interviene si se atrasa
Acepta recordatorios →  programa y registra envío   →   atiende falta de respuesta
Expresa interés      →  crea conversación pendiente →   acuerda si se postula
```

La operadora no debería “administrar el sistema” todo el día. Su trabajo ideal sería abrir una pantalla llamada **Hoy** y resolver una cola breve:

- 8 expedientes con datos contradictorios.
- 5 documentos pendientes de validación.
- 12 CV listos para revisión final.
- 7 participantes sin respuesta después de dos recordatorios.
- 3 rutas que necesitan decisión humana.
- 1 solicitud empresarial para preparar un grupo.

### Automatizar, asistir y reservar para personas

| Automatizar | Preparar para revisión | Decisión humana |
|---|---|---|
| Guardado y validación de formularios | Resumen de perfil | Interpretación de situaciones sensibles |
| Checklist documental | Borrador de CV | Aprobación final del CV |
| Cambio de etapa por reglas | Ruta y módulos sugeridos | Confirmación o ajuste de la ruta |
| Recordatorios programados | Lista de casos sin respuesta | Contacto especial o intervención social |
| Agenda y próxima acción | Perfiles relacionados con requisitos | Presentación o postulación acordada |
| Consolidación por cohortes | Paquete grupal para empresa | Relación y negociación con la empresa |
| Reportes periódicos | Borrador de comunicación | Mensajes delicados o no previstos |

La automatización debe reducir clics y búsqueda manual. No debe automatizar consentimiento, selección final, interpretación psicométrica, envío de datos personales a empresas ni decisiones que afecten oportunidades.

### Viaje del dato solicitado por la entidad

La propuesta técnica debe explicar cada fase con la misma estructura:

| Fase | Entrada | Transformación automatizada | Salida útil | Revisión humana |
|---|---|---|---|---|
| **Registro** | Formulario, consentimiento y documentos | Validación, detección de faltantes y organización | Expediente único con porcentaje documental | Identidad, excepciones y documentos críticos |
| **Perfil** | Formación, experiencia, intereses y condiciones | Normalización y resumen | Perfil laboral individual y campos filtrables | Correcciones o contexto cualitativo |
| **Necesidades** | Cuestionario y, si aplica, instrumento autorizado | Señales y módulos sugeridos | Resumen explicable de apoyos | Interpretación y conversación |
| **Plan** | Perfil, señales, calendario y oferta formativa | Propuesta de ruta, actividades y fechas | Plan A/B/C personalizado | Confirmación o ajuste |
| **CV** | Perfil e historia de experiencia | Borrador estructurado | CV pendiente de revisión | Edición y aprobación final |
| **Preparación** | Actividades, prácticas y simulaciones | Registro de avance y alertas | Estado de preparación por dimensión | Retroalimentación relevante |
| **Inventario** | Expedientes actualizados | Filtros, cohortes y agrupaciones | Panorama de talento disponible | Confirmación de disponibilidad |
| **Conexión** | Requisitos de empresa u oferta pública | Preselección explicable para revisar | Grupo potencial, sin envío automático | Acuerdo con participantes y empresa |
| **Seguimiento** | Citas, respuestas y resultados | Recordatorios y actualización de estados | Próximas acciones e indicadores | Casos sin respuesta o situaciones especiales |

Este cuadro debe convertirse después en el flujograma de la propuesta, incluyendo herramienta, responsable, tiempo ahorrado y costo por fase.

### Diseño para volumen, no solamente para casos individuales

La conversación menciona referencias de 500 participantes para un piloto y hasta 2,000 registros en un escenario más amplio. Esto exige:

- Filtros rápidos por institución, programa, cohorte, carrera, curso y estado.
- Acciones masivas seguras: programar recordatorio, asignar actividad o exportar un listado autorizado.
- Vistas guardadas como “Barismo 2026 con CV revisado” o “Electricidad disponible este mes”.
- Indicadores que abren la lista exacta que los produce.
- Detección de duplicados y control de calidad.
- Registro de disponibilidad actualizado; un perfil histórico no equivale a talento disponible hoy.
- Separación entre “cumple filtros”, “revisado por la operadora”, “aceptó conversar” y “compartido con empresa”.

### Sostenibilidad y transferencia son requisitos del producto

La conversación insiste en que una plataforma pierde valor si la organización no puede mantenerla después del proyecto. Desde la primera versión se debe contemplar:

- Costos anuales de hosting, mensajería, almacenamiento y servicios externos.
- Funcionamiento básico aunque una integración externa deje de pagarse.
- Panel para agregar preguntas, carreras, cursos, documentos y rutas sin programar.
- Exportación completa de datos y documentos en formatos comunes.
- Copias de seguridad y procedimiento de recuperación.
- Manual paso a paso integrado en TALENTIA.
- Capacitación inicial y acompañamiento de adopción.
- Responsable institucional claramente designado.
- Registro de versiones para que un cambio de formulario no destruya datos anteriores.

La primera versión debe poder transferirse a otra institución cambiando configuración, identidad visual, catálogos y reglas, sin construir otro sistema desde cero.

## 1. La idea central

TALENTIA puede evolucionar de una demo visual a un **CRM de acompañamiento para la inserción laboral**. Su valor no estaría solamente en registrar participantes o mostrar gráficas, sino en ayudar al equipo a responder cuatro preguntas todos los días:

1. ¿Quién necesita atención ahora?
2. ¿Qué necesita cada participante y por qué?
3. ¿Cuál es el siguiente paso acordado?
4. ¿Qué resultados está produciendo el acompañamiento?

El producto tendría dos experiencias conectadas:

| Vista | Usuario principal | Para qué sirve |
|---|---|---|
| **Mi ruta** | Participante | Completar su perfil, comprender su ruta, realizar actividades, preparar su CV y conocer su próximo paso. |
| **CRM de acompañamiento** | Equipo de Inserción Laboral | Administrar casos, distribuir trabajo, dar seguimiento, registrar interacciones, coordinar rutas y medir resultados. |

La vista del participante debe sentirse como una guía personal, clara y cercana. La vista del equipo puede parecerse a un tablero de inteligencia operativa, pero cada gráfica debe permitir llegar a las personas que necesitan una acción.

## 2. Qué ya existe y por qué es una base sólida

La documentación del Cerebro ya contiene gran parte de la estructura conceptual de un CRM:

- Personas, perfiles, inscripciones, programas y cohortes.
- Diagnóstico inicial y rutas configurables.
- Pasos de ruta y estados de avance.
- Seguimientos, historial de estados y recordatorios.
- CV, indicadores y tableros.
- Catálogos administrables, trazabilidad y reglas de acceso.
- Principio de decisión humana: la tecnología organiza y sugiere; el equipo interpreta y decide.

La demo actual ya materializa una parte importante de esa visión:

- Recorrido para participante con registro, perfil, cuestionario y ruta.
- Tablero para el equipo, directorio de participantes y detalle individual.
- Exploración de empresas, oportunidades, salarios y rutas.
- Datos fuente separados de los escenarios ficticios.
- Conexiones explicables por ocupación, sin ranking ni selección automática.
- Persistencia local para demostrar cambios durante una sesión.

Esto hace que la demo sea atractiva y creíble como visión. Para convertirse en CRM todavía necesita una capa operativa: responsables, tareas, fechas, historial de contactos, decisiones humanas, estados separados y datos compartidos entre usuarios.

## 3. El concepto de producto recomendado

### Nombre funcional

**TALENTIA — CRM de rutas y acompañamiento laboral**

Una frase para presentarlo:

> TALENTIA convierte el diagnóstico inicial de cada participante en una ruta explicable y ayuda al equipo a acompañar cada paso hasta la conexión laboral y su seguimiento.

### Promesa para la participante

“Sé dónde estoy, cuál es mi siguiente paso, por qué me lo recomiendan y quién puede apoyarme.”

### Promesa para el equipo

“Sé a quién atender, qué se acordó, qué está atrasado y qué resultados estamos obteniendo.”

### Promesa para dirección o financiadores

“Puedo observar cobertura, calidad del acompañamiento, avance y resultados con definiciones claras y evidencia trazable.”

## 4. Las dos vistas

### A. Vista de participante: “Mi ruta”

Debe ser móvil, sencilla y orientada a una acción por vez.

1. **Bienvenida y consentimiento**: explicar para qué se usarán los datos.
2. **Mi perfil**: información mínima, experiencia, intereses, disponibilidad y condiciones de trabajo buscadas.
3. **Cuestionario inicial**: preguntas breves para detectar necesidades de acompañamiento.
4. **Resultado conversacional**: mostrar fortalezas declaradas, aspectos por preparar y una ruta sugerida.
5. **Validación con el equipo**: la participante y una orientadora confirman o ajustan la ruta.
6. **Mi plan**: actividades, fechas, recursos, citas y persona de apoyo.
7. **Mi CV**: construir, revisar y descargar una versión.
8. **Oportunidades para conversar**: opciones relacionadas con su objetivo, siempre explicando la conexión.
9. **Seguimiento**: registrar avances, entrevistas, decisiones y próximos pasos.

La participante debería ver el nombre humano de su ruta. Las letras A, B y C pueden funcionar como códigos internos, pero no como calificaciones visibles.

### B. Vista del equipo: “CRM de acompañamiento”

El inicio debe responder “¿qué requiere acción hoy?”.

- Casos nuevos pendientes de revisión.
- Seguimientos vencidos y próximos.
- Participantes sin siguiente acción.
- Rutas esperando validación.
- CV pendientes de revisión.
- Participantes listas para conversar sobre oportunidades.
- Carga de trabajo por orientadora.
- Alertas de calidad de datos.

Cada registro de participante debería reunir:

- Resumen y datos de contacto.
- Programa, cohorte y responsable.
- Perfil laboral y objetivo declarado.
- Resultado del cuestionario con razones visibles.
- Ruta acordada y progreso.
- Línea de tiempo de contactos, notas y acuerdos.
- Tareas, fechas y recordatorios.
- Versiones del CV y otros documentos.
- Conversaciones sobre oportunidades.
- Resultados y seguimientos posteriores.

## 5. Modelo de rutas A, B y C

### Precaución necesaria con la puntuación

Una puntuación puede ordenar señales, pero no debe medir “empleabilidad”, talento, valor personal ni posibilidad de contratación. Tampoco debe usarse para excluir a alguien o repartir oportunidades.

La propuesta es calcular un **nivel de acompañamiento requerido**. Un valor alto significa que hoy conviene ofrecer más preparación; no significa que una persona tenga menos capacidad. Las reglas deben ser públicas para el equipo, configurables, versionadas y siempre sujetas a revisión humana.

### Dimensiones posibles del cuestionario

Cada dimensión puede usar una escala provisional de 0 a 2:

| Dimensión | 0 puntos de apoyo | 1 punto de apoyo | 2 puntos de apoyo |
|---|---|---|---|
| Objetivo laboral | Está definido | Hay varias opciones | Necesita explorarlo |
| Relato de experiencia | Puede explicarlo con ejemplos | Necesita ordenar algunos ejemplos | Solicita apoyo para reconocer o narrar su experiencia |
| CV | Está actualizado | Existe, pero necesita revisión | No existe o requiere crearlo |
| Preparación laboral | Se siente preparada para conversar | Quiere practicar un aspecto | Necesita una preparación inicial |
| Condiciones de trabajo | Horario, traslado y disponibilidad están definidos | Falta definir una condición | Hay varias condiciones por conversar |
| Acceso digital | Puede completar las actividades | Requiere apoyo ocasional | Requiere alternativa acompañada o presencial |

El máximo provisional sería 12 puntos de apoyo. La opción “prefiero no responder” no suma puntos ni produce una inferencia: crea una conversación pendiente para el equipo.

### Bandas provisionales

| Código interno | Nombre visible sugerido | Banda inicial | Propósito |
|---|---|---:|---|
| **A** | **Descubrir y preparar** | 8–12 | Clarificar el objetivo y construir las herramientas básicas. |
| **B** | **Fortalecer y practicar** | 4–7 | Mejorar elementos específicos y ganar preparación para avanzar. |
| **C** | **Conectar y dar seguimiento** | 0–3 | Conversar sobre oportunidades pertinentes y acompañar el proceso. |

Estas bandas son hipótesis para pilotear, no reglas definitivas. La Unidad debe revisar preguntas, pesos, umbrales y lenguaje antes de utilizarlos con datos reales.

### La puntuación no debe decidirlo todo

Dos personas con el mismo total pueden necesitar apoyos distintos. Por eso la ruta debe construirse con dos capas:

1. **Ruta base**, definida por la intensidad general del acompañamiento.
2. **Módulos**, definidos por las respuestas concretas.

Módulos posibles:

- Explorar intereses y ocupaciones.
- Reconocer y narrar experiencia informal o de cuidados.
- Crear o actualizar CV.
- Fortalecer una habilidad técnica.
- Practicar entrevista y presentación personal.
- Definir horario, movilidad y condiciones buscadas.
- Acceso digital acompañado.
- Conversación sobre oportunidades.
- Seguimiento de entrevista, contratación o permanencia.

Así, una persona puede estar en la Ruta C y necesitar un módulo corto de acceso digital. Otra puede estar en la Ruta A y ya tener un CV actualizado. El sistema se adapta sin encerrar a nadie en una categoría.

### Regla de decisión explicable

El flujo recomendado sería:

1. La participante completa el cuestionario.
2. TALENTIA calcula señales por dimensión y una banda provisional.
3. El sistema propone una ruta base y módulos.
4. Muestra el motivo en lenguaje claro: “Sugerimos crear tu CV y practicar cómo contar tu experiencia porque indicaste que deseas apoyo en esos dos puntos”.
5. Una orientadora revisa la sugerencia con la participante.
6. Ambas confirman, editan o posponen la ruta.
7. El sistema registra quién decidió, cuándo y bajo qué versión de reglas.

Las respuestas contradictorias, los datos incompletos o cualquier situación que no encaje deben conducir a **revisión humana**, no a una clasificación automática.

## 6. Tres historias para demostrar el sistema completo

### Historia A — Descubrir y preparar

**Laura** desea trabajar, pero todavía no ha definido una ocupación objetivo, necesita ayuda para reconocer su experiencia y no tiene CV.

- TALENTIA sugiere Ruta A.
- Módulos: exploración ocupacional, relato de experiencia y creación de CV.
- El equipo acuerda tres actividades y una cita.
- El tablero muestra el siguiente paso y su responsable.
- Al completar los módulos, Laura puede pasar a B o C sin comenzar de nuevo.

### Historia B — Fortalecer y practicar

**Julia** quiere trabajar como barista. Su objetivo es claro, pero necesita convertir su experiencia informal en ejemplos, terminar su CV y practicar una conversación laboral.

- TALENTIA sugiere Ruta B.
- Módulos: experiencia transferible, CV y práctica de entrevista.
- La orientadora ajusta el plan y asigna fechas.
- Al finalizar, aparecen empresas relacionadas con café como opciones para conversar, indicando la razón de la conexión.

### Historia C — Conectar y dar seguimiento

**Ana** tiene un objetivo claro, disponibilidad definida, CV revisado y ejemplos de experiencia.

- TALENTIA sugiere Ruta C.
- El equipo valida que está lista para explorar oportunidades.
- Se registra una conversación sobre una empresa, sin afirmar que existe una vacante real si no está verificada.
- El CRM separa “oportunidad”, “referencia acordada”, “postulación” y “resultado”.
- Se agenda seguimiento y se mantiene el historial.

Estas tres historias deberían existir completas en la demo. Así se ve el cambio de una página bonita a un sistema que organiza trabajo real.

## 7. Qué mejoraría primero en la demo

### Prioridad 0 — Demostrar que una persona puede operar la Unidad

| Idea | Impacto | Esfuerzo | Qué demostraría |
|---|---|---|---|
| Pantalla “Hoy” con excepciones y acciones pendientes | Muy alto | Medio | Que una operadora no revisa 500 expedientes uno por uno. |
| Camino de autoservicio para completar el expediente | Muy alto | Medio | Que la participante realiza el llenado inicial con poca asistencia. |
| Checklist automático de documentos y datos faltantes | Muy alto | Medio | Centralización y reducción de búsqueda manual. |
| Resultado A/B/C explicable después del cuestionario | Muy alto | Medio | Personalización sin caja negra. |
| Próxima acción, fecha y responsable generados por el flujo | Muy alto | Bajo | Que ningún caso depende de la memoria de la operadora. |
| Borrador de CV y cola de revisión final | Muy alto | Medio | Que el equipo revisa CV en vez de crearlos desde cero. |
| Recordatorio programado con registro del resultado | Muy alto | Medio | Ahorro de llamadas y mensajes repetitivos. |
| Buscador grupal por cohorte, carrera y preparación | Muy alto | Medio | Responder rápidamente a una solicitud empresarial. |
| Tres historias completas, una por ruta | Alto | Medio | Que el modelo funciona en situaciones distintas. |
| Línea de tiempo dentro del expediente | Alto | Medio | Continuidad del acompañamiento. |

### Prioridad 1 — Convertir la demo en piloto

- Base de datos compartida en lugar de almacenamiento local.
- Inicio de sesión y roles: participante, orientadora, coordinación y administración.
- Separación de organizaciones, programas y cohortes.
- Asignación de participantes a responsables.
- Tareas con fecha, estado, prioridad y recordatorio.
- Registro de consentimiento y su versión.
- Historial de cambios y auditoría básica.
- Importación y exportación controlada.
- Catálogos y reglas administrables sin editar código.
- Filtros guardados para el trabajo frecuente del equipo.

### Prioridad 2 — CRM de empresas y oportunidades

- Empresas y personas de contacto.
- Historial de reuniones, llamadas y acuerdos.
- Sectores, ocupaciones y condiciones de referencia.
- Oportunidades verificadas con fecha de actualización y fuente.
- Etapas de relación con la empresa.
- Conversación con la participante, referencia acordada y postulación como eventos distintos.
- Seguimiento de entrevistas y resultados.

El módulo de empresas debe crecer después de validar el flujo de acompañamiento. Una lista grande de empresas ficticias impresiona visualmente, pero un CRM demuestra más valor cuando registra quién hará qué y qué ocurrió después.

### Prioridad 3 — Resultados e impacto

- Inicio y finalización de rutas.
- Tiempo entre registro, diagnóstico, ruta y primera acción.
- CV creados o revisados.
- Conversaciones sobre oportunidades.
- Referencias acordadas y postulaciones reales.
- Entrevistas, colocaciones y motivos de cierre.
- Seguimiento a 30, 90 y 180 días.
- Permanencia, cambios y nuevas necesidades de apoyo.

Estos indicadores solo deben presentarse como impacto cuando provengan de datos reales, tengan denominador, período, definición y fuente visibles.

## 8. La arquitectura funcional del CRM

Conviene mantener cuatro procesos separados. Mezclarlos en un solo estado haría difícil saber qué está sucediendo.

| Proceso | Ejemplos de estado |
|---|---|
| **Participación en el programa** | preinscrita, activa, pausada, egresada, retirada |
| **Avance de la ruta** | sugerida, en validación, activa, completada, ajustada |
| **Trabajo con oportunidades** | conversada, referencia acordada, postulada, entrevista, resultado |
| **Seguimiento posterior** | pendiente, contacto realizado, sin respuesta, cerrado |

Entidades que ya existen conceptualmente y deben conservarse:

- Organización, programa, cohorte y usuario.
- Participante, inscripción y perfil.
- Diagnóstico, ruta y pasos de ruta.
- CV, seguimiento e historial de estados.

Entidades que completarían el CRM:

- **Asignación:** quién acompaña a quién y desde cuándo.
- **Interacción:** llamada, mensaje, reunión o sesión, con acuerdos.
- **Tarea:** acción, responsable, fecha y estado.
- **Plantilla de ruta:** actividades configurables por la Unidad.
- **Versión de reglas:** preguntas, pesos y umbrales utilizados.
- **Consentimiento:** versión, fecha y canal.
- **Documento:** tipo, versión, estado y acceso.
- **Empresa y contacto:** relación institucional.
- **Oportunidad:** información verificada y vigencia.
- **Referencia o postulación:** decisión acordada con la participante.
- **Resultado:** entrevista, contratación, continuidad u otro cierre definido.
- **Evento de auditoría:** cambio relevante, autor y fecha.

## 9. Pantallas que harían que el sistema se sienta completo

### Participante

- Inicio con “tu siguiente paso”.
- Perfil y cuestionario por etapas.
- Explicación de la ruta sugerida.
- Plan semanal con progreso real.
- Constructor y revisión de CV.
- Preparación para conversaciones laborales.
- Oportunidades explicadas y guardadas.
- Citas, recordatorios y canal de ayuda.
- Resumen de logros y próximos pasos.

### Equipo

- **Hoy:** cola de trabajo priorizada por fecha y estado.
- **Participantes:** filtros, responsable, ruta y próxima acción.
- **Expediente 360:** perfil, ruta, línea de tiempo y documentos.
- **Rutas:** plantillas, reglas y avance por cohorte.
- **Calendario y tareas:** compromisos del equipo.
- **Empresas:** contactos, relación y actividades.
- **Oportunidades:** vigencia, ocupación y trazabilidad.
- **Resultados:** embudo con acceso a los registros que forman cada cifra.
- **Configuración:** programas, cohortes, catálogos, permisos y versiones.

## 10. Ideas de diseño que potenciarían la presentación

- Mantener el estilo de tablero ejecutivo, pero convertir cada indicador en una puerta hacia una lista accionable.
- Usar una línea de tiempo clara para que el expediente cuente la historia de la participante.
- Dar a cada ruta una identidad por nombre, color y símbolo, sin apariencia de calificación escolar.
- Mostrar siempre “por qué aparece esto” en rutas, indicadores y conexiones.
- Diseñar estados vacíos que expliquen qué dato falta y cómo obtenerlo.
- Incluir una vista de “antes y después” de una participante ficticia: cuestionario, plan, CV y seguimiento.
- Usar lenguaje humano: “próximo paso”, “acuerdo”, “persona responsable” y “fecha”, en vez de terminología técnica.
- Reservar las gráficas para decisiones concretas; evitar llenar el tablero con métricas decorativas.
- Permitir abrir desde una gráfica la lista exacta de participantes correspondiente.
- Señalar con claridad qué datos son reales, cuáles son referencias y cuáles son simulados.

## 11. Indicadores útiles desde el primer piloto

### Operación

- Participantes activas con y sin responsable.
- Casos por orientadora.
- Seguimientos próximos y vencidos.
- Participantes sin próxima acción.
- Tiempo medio desde registro hasta validación de ruta.
- Rutas activas sin movimiento durante un período definido.

### Avance

- Participantes por ruta base y módulo.
- Pasos iniciados y completados.
- CV creados, en revisión y listos.
- Cambios de ruta acordados.
- Tiempo por etapa.

### Conexión y resultados

- Conversaciones sobre oportunidades.
- Referencias acordadas.
- Postulaciones e entrevistas registradas.
- Colocaciones confirmadas.
- Seguimientos realizados a 30, 90 y 180 días.

Cada tarjeta debe mostrar período, universo, denominador, fuente y fecha de actualización. Si el dato todavía es ficticio, debe decirlo en la misma pantalla.

## 12. Una demostración de diez minutos para generar inversión

1. **Problema:** un modelo pensado para cinco funciones debe operar con una o dos personas y cientos de expedientes.
2. **Autoservicio:** Julia completa desde su teléfono información que antes el equipo habría tenido que recopilar y transcribir.
3. **Transformación:** TALENTIA valida campos, organiza documentos, resume el perfil y propone “Fortalecer y practicar” con razones visibles.
4. **Producción:** el sistema prepara un borrador de CV, actividades y fechas sin que la operadora empiece desde cero.
5. **Control humano:** la operadora abre “Hoy” y revisa solamente el CV y la ruta que requieren decisión.
6. **Automatización:** se programa la próxima acción y un recordatorio; el contacto queda registrado automáticamente.
7. **Visión grupal:** el tablero muestra avance por cohorte, carrera y etapa, y cada cifra abre sus expedientes.
8. **Solicitud empresarial:** una empresa ficticia solicita perfiles de barismo; la operadora filtra formación, disponibilidad, documentos y preparación.
9. **Decisión y consentimiento:** TALENTIA presenta un grupo para revisar; la operadora confirma datos y consulta a las participantes antes de compartir información.
10. **Transferencia:** se muestra que una institución puede editar preguntas, documentos, rutas, cohortes y plantillas sin contratar un cambio de código.

La historia de inversión debe centrarse en tres ventajas:

- **Capacidad multiplicada:** una persona atiende excepciones mientras TALENTIA ejecuta el trabajo repetitivo.
- **Viaje del dato:** cada entrada se transforma en un producto útil y trazable.
- **Inserción a escala:** el centro puede localizar y presentar grupos pertinentes, no solamente revisar casos uno por uno.
- **Sostenibilidad:** el flujo puede configurarse y transferirse sin depender permanentemente del desarrollador.

## 13. Hoja de ruta recomendada

### Etapa 0 — Validar el modelo con la Unidad

**Objetivo:** acordar vocabulario, preguntas, dimensiones, rutas, módulos y decisiones humanas.

**Resultado esperado:** matriz de reglas aprobada y tres historias reales anonimizadas para probarla.

### Etapa 1 — Demo 0.3: mostrar la Unidad automatizada

**Objetivo:** implementar autoservicio, rutas A/B/C explicables, pantalla “Hoy”, checklist documental, borrador de CV, avisos y búsqueda grupal de talento.

**Resultado esperado:** una demostración donde la participante avanza por sí misma y una sola operadora resuelve excepciones, revisa resultados y responde a una solicitud empresarial.

### Etapa 2 — Piloto operativo

**Objetivo:** añadir base compartida, acceso por roles, responsables, tareas, consentimiento, auditoría y configuración básica.

**Resultado esperado:** un grupo pequeño puede trabajar durante varias semanas sin depender de hojas paralelas para el flujo central.

### Etapa 3 — Empresas y oportunidades reales

**Objetivo:** administrar relaciones, contactos, oportunidades verificadas, referencias y postulaciones.

**Resultado esperado:** trazabilidad desde la conversación inicial hasta el resultado de cada proceso.

### Etapa 4 — Resultados y aprendizaje

**Objetivo:** seguimiento longitudinal y análisis de qué rutas y actividades funcionan para distintos contextos.

**Resultado esperado:** decisiones metodológicas basadas en datos definidos, auditables y contextualizados.

## 14. Qué evitar por ahora

- Un puntaje opaco de empleabilidad.
- Ranking de participantes o selección automática para oportunidades.
- Interpretación automática de información sensible.
- Un chatbot presentado como el producto principal.
- Muchas gráficas sin una acción asociada.
- Automatizaciones antes de definir responsables y excepciones.
- Integraciones complejas antes de validar el flujo cotidiano.
- Afirmaciones de impacto basadas en datos ficticios.
- Convertir una conexión por ocupación en una promesa de vacante o contratación.

## 15. Decisiones que la Unidad debe tomar

1. ¿Cuáles son las rutas que realmente utiliza o desea utilizar?
2. ¿Qué actividades mínimas contiene cada ruta?
3. ¿Qué respuestas activan cada módulo?
4. ¿La intensidad de apoyo debe usar bandas numéricas o solamente reglas por dimensión?
5. ¿Quién puede validar, ajustar, pausar y cerrar una ruta?
6. ¿Qué significa que un CV esté “listo”?
7. ¿Cuál es la próxima acción mínima que todo caso activo debe tener?
8. ¿Qué seguimientos son obligatorios y en qué plazos?
9. ¿Qué estados distinguen una conversación, una referencia, una postulación y una contratación?
10. ¿Qué datos necesita dirección y cuáles no deberían recopilarse?
11. ¿Qué evidencia confirma cada resultado?
12. ¿Qué tres casos representarían un piloto realista?

## 16. Recomendación final de alcance

La siguiente versión no necesita convertirse todavía en un sistema enorme. Debe probar con claridad dos ciclos conectados:

> **Formulario inicial → señales explicables → ruta sugerida → validación humana → actividades y responsable → seguimiento → resultado trazable.**

> **Expedientes actualizados → filtros por requisitos → grupo potencial → revisión humana → consentimiento → conexión con empresa → resultado trazable.**

Si ambos ciclos funcionan para las tres rutas y una sola operadora puede controlarlos desde “Hoy”, TALENTIA deja de ser solamente un tablero atractivo. Se convierte en una propuesta convincente de Unidad de Inserción Laboral digital y transferible.

## Fuentes internas revisadas

Esta propuesta se elaboró a partir de todo el contenido Markdown disponible en `TALENTIA_Cerebro_v1`, de la documentación vigente de `TALENTIA_App` y de la conversación de definición compartida por el equipo contratante. Incluye visión, trazabilidad, navegación, flujos, formularios, metodología, reglas de IA y datos, modelo de datos, historias de usuario, piloto, seguridad, decisiones, metodología y guion de demo.

Documentos centrales:

- [`PROMPT_MAESTRO.md`](../TALENTIA_Cerebro_v1/PROMPT_MAESTRO.md)
- [`01_Alcance_y_principios.md`](../TALENTIA_Cerebro_v1/00_Vision/01_Alcance_y_principios.md)
- [`01_Navegacion_y_rutas.md`](../TALENTIA_Cerebro_v1/01_Procesos/01_Navegacion_y_rutas.md)
- [`02_Flujos_y_estados.md`](../TALENTIA_Cerebro_v1/01_Procesos/02_Flujos_y_estados.md)
- [`01_Metodologia_de_trabajo.md`](../TALENTIA_Cerebro_v1/03_Metodologia/01_Metodologia_de_trabajo.md)
- [`02_Reglas_de_IA_y_datos.md`](../TALENTIA_Cerebro_v1/03_Metodologia/02_Reglas_de_IA_y_datos.md)
- [`01_Modelo_de_datos.md`](../TALENTIA_Cerebro_v1/04_Producto/01_Modelo_de_datos.md)
- [`README.md`](README.md)
- [`METODOLOGIA_DEMO.md`](METODOLOGIA_DEMO.md)
- [`GUION_DEMO.md`](GUION_DEMO.md)
