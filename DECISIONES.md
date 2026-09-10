# Decisiones de la aplicación

Fecha: **2026-09-08**, fecha de la sesión de construcción. Este registro pertenece a la aplicación; no modifica las decisiones del cerebro.

| Decisión | Motivo y estado |
|---|---|
| Crear `TALENTIA_App` junto a `TALENTIA_Cerebro_v1` | Separar implementación y fuente documental. Aprobado por el usuario. |
| Ampliar el primer flujo con panel, empresas, salarios y rutas | El usuario solicitó esta ampliación para una demo destinada a potenciales inversionistas. Se conserva la implementación local. |
| Ejecutar localmente con React, TypeScript, Vinext y Vite | Elección técnica inicial; sin publicación ni conexión a datos reales. |
| Usar almacenamiento local con clave `talentia.demo.v1` | Permitir persistencia en el mismo navegador y dirección. No sustituye una base de datos compartida ni copias de seguridad. |
| Aceptar únicamente correos `@example.com` | Convención del demo para reforzar el uso de datos ficticios; además se valida formato y duplicado sin distinguir mayúsculas o espacios exteriores. |
| Crear altas en `Registrada` | Estado operativo inicial de demostración. No implica evaluación ni elegibilidad. |
| Permitir cambios manuales entre estados distintos del catálogo | Política provisional del demo: la secuencia ilustrativa del cerebro no define transiciones oficiales. Confirmación e historial obligatorios; responsable fijo `Equipo demo`. |
| No derivar logros al cambiar estado | Seleccionar `CV listo`, `Ruta definida` o `Graduada` no crea documentos, tareas ni certificaciones. |
| Permitir perfil parcial sin indicador de completitud | El equipo todavía no definió qué constituye un perfil completo. Guardar expresa persistencia, no suficiencia metodológica. |
| Conservar los 12 registros de muestra y sus estados | La fuente contiene tres graduadas, dos de formación técnica. Se conserva ese dato pese al prompt que pide tres técnicas; no se alteran muestras para aparentar cumplimiento. |
| Separar registros originales de escenarios adicionales | El JSON fuente no contiene expedientes completos. La demo muestra perfiles y rutas ficticias expresamente añadidas en `labor-market.ts`; los datos persistidos de muestra mantienen `profile:null` hasta que se editan. |
| Conservar borradores e informar fallos de almacenamiento | Evitar pérdida silenciosa y mensajes de éxito cuando la escritura falla. No reemplazar datos ilegibles por muestras automáticamente. |
| Selector de vistas y consentimiento de demostración | No son autenticación ni consentimiento institucional definitivo. Solo datos ficticios. |
| Conexiones por ocupación compartida | No hay ranking ni exclusión por salario o experiencia. Se muestran puntos en común y aspectos por conversar. |
| Comparar salarios base de jornada completa | Incentivo separado, mínimo según actividad y lugar de trabajo. Expectativas de otras jornadas o desconocidas quedan fuera de la comparación. |
| Mantener la versión de almacenamiento v1 con campos opcionales | Compatibilidad con registros y borradores anteriores; no se restaura la muestra sobre datos existentes. |
| Revisar rutas tras cambios de perfil, respuestas o avance | Los cambios invalidan la revisión previa. El responsable de la demo es explícito y no representa una identidad autenticada. |
| Ejecutar la versión compilada en presentaciones | Evita recargas de desarrollo mientras se recorre la demo. No implica publicación externa. |
| Priorizar operación por una sola persona | La conversación con la entidad confirma que la mayoría de unidades tendrá una persona y, como máximo, dos. El piloto debe reducir revisión individual y destacar excepciones. |
| Compartir solo al pulsar `Enviar al panel` | El formulario continúa local durante el llenado. La acción explícita crea una copia común para la sesión con siete participantes. |
| Usar D1 para el piloto compartido | Permite que dispositivos distintos alimenten una bandeja administrativa común. El almacenamiento local permanece para las demás funciones de la demo. |
| Reemplazar por correo ficticio | Un nuevo envío con el mismo correo `@example.com` actualiza el recorrido anterior y evita duplicarlo en la sesión. |
| Proponer A/B/C por señales declaradas | Regla provisional: A con cuatro o más señales, B con dos o tres, C con cero o una. Representa acompañamiento requerido, no empleabilidad ni elegibilidad. |
| Mantener el piloto sin documentos reales ni autenticación | La sesión valida el viaje del dato. Antes de datos reales se requieren roles, acceso institucional, consentimiento definitivo y almacenamiento seguro de archivos. |

## Trazabilidad conocida

| Función | Historia | Componente | Actividad | Proceso | Partida |
|---|---|---|---|---|---|
| Registro | HU-PAR-001 | C1 | 2.1 | M1 | P-2.1 |
| Lista, búsqueda y expediente del equipo | HU-EQU-001, subconjunto inicial | C1 | 5.1 | M7 | P-5.1 |
| Cambio manual de estado | HU-EQU-003 | Pendiente de cotejo | Pendiente | Pendiente | Pendiente |
| Perfil laboral parcial | Sin historia propia documentada | Pendiente de cotejo | Pendiente | Pendiente | Pendiente |

Esta entrega solo cubre parte de HU-EQU-001: los filtros de cohorte, formación y avance quedan pendientes. El archivo `TALENTIA_Panel_Actividades_y_Presupuesto_V2.xlsx` no está disponible para cotejar la trazabilidad. No se asignan códigos presupuestarios nuevos.

## Pendientes del equipo

- Aprobar estados oficiales y transiciones permitidas, incluida la definición de graduación.
- Definir campos indispensables y criterio de perfil completo.
- Aprobar catálogos y texto institucional de consentimiento.
- Completar historias y cotejar códigos con el expediente V2.
- Elegir almacenamiento compartido y definir acceso, conservación y recuperación antes de usar información real.
