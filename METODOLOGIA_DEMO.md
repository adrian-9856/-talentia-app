# Datos y reglas de la demostración

Los 12 identificadores, datos básicos y estados originales provienen de `src/data/demo.json`, copia de la fuente del cerebro. Sus perfiles iniciales persistidos siguen vacíos. `labor-market.ts` aporta perfiles, respuestas y experiencias **ficticias** para explorar el producto. Si se guarda un perfil, ese contenido tiene prioridad sobre el escenario. Al materializar una edición, su ruta anterior se conserva; la revisión vuelve a estar pendiente.

Las 6 empresas, 8 oportunidades, 19 plazas, rangos ofrecidos y expectativas de las personas son escenarios inventados. No se consultan portales de empleo ni se envían datos a empresas.

## Indicadores

- **Participantes:** expedientes que cumplen los filtros actuales. No equivale a personas contratadas ni perfiles completos.
- **Empresas con conexiones:** empresas distintas con al menos una oportunidad cuya ocupación coincide con el interés de una participante filtrada. El filtro municipal se aplica al municipio de la persona y al centro de trabajo de la empresa.
- **Plazas para explorar:** suma de plazas de las oportunidades relacionadas, contando cada oportunidad una vez. Una persona puede tener varias oportunidades; esto no representa una asignación ni una postulación.
- **Sin CV actualizado:** cuestionarios que responden explícitamente «No». No se deduce que un CV esté actualizado porque el perfil diga que existe.
- **Talento y demanda:** participantes por ocupación y plazas de las empresas del escenario. Programa y estado afectan a participantes; ocupación y municipio afectan también a ofertas. Las etiquetas y notas aclaran ambas series.
- **Expectativa mediana:** mediana de expectativas base mensuales válidas, con disponibilidad de tiempo completo. Omisiones y otras jornadas quedan fuera; se muestra el número de respuestas comparables.
- **Oferta inicial promedio:** media del extremo inferior de cada rango base, sin ponderar por número de plazas. No es el promedio de salarios del mercado ni el salario final acordado.
- **Avance de ruta:** actividades completadas / actividades propuestas. El escenario inicial aporta un progreso ficticio explícito y deja la revisión pendiente. No se deduce avance a partir de etiquetas como «Graduada».

## Referencias oficiales de Guatemala · 2026

Vigencia: 1 de enero a 31 de diciembre de 2026. CE1 corresponde al departamento de Guatemala; CE2 a los otros departamentos. La circunscripción corresponde al **centro de trabajo**, no a la residencia de la participante. Las oportunidades ficticias actuales están en CE1.

| Región | Actividad | Base mensual Q | Incentivo Q | Total Q |
|---|---|---:|---:|---:|
| CE1 | Agrícola | 3,791.20 | 250.00 | 4,041.20 |
| CE1 | No agrícola | 4,002.28 | 250.00 | 4,252.28 |
| CE1 | Exportación y maquila | 3,409.73 | 250.00 | 3,659.73 |
| CE2 | Agrícola | 3,625.89 | 250.00 | 3,875.89 |
| CE2 | No agrícola | 3,816.90 | 250.00 | 4,066.90 |
| CE2 | Exportación y maquila | 3,221.10 | 250.00 | 3,471.10 |

Fuentes: [MINTRAB, Acuerdo Gubernativo 256-2025](https://www.mintrabajo.gob.gt/doc/AcuerdosGubernativos/2025/Acuerdo%20Gubernativo%20256-2025%20Salario%20Minino.pdf) y [Memoria de Labores 2025, tablas 6 y 7](https://www.mintrabajo.gob.gt/doc/MemoriaDeLabores/Memoria%20de%20Labores%202025.pdf). Consulta de referencia durante esta sesión: 2026-09-08. Los enlaces se incluyen también en la aplicación.

Se usan los importes mensuales publicados, sin reconstruirlos como salario diario × 30. Son referencias de jornada completa. Se separa la bonificación incentivo; no se calculan descuentos, horas extra, comisiones, prestaciones ni prorrateos. Una referencia mínima no equivale a una estimación de salario de mercado ni certifica el cumplimiento de todas las condiciones legales de una oferta.

El comparador individual fija la región y actividad según la oferta seleccionada. El selector CE1/CE2 cambia solo la tabla de referencias, evitando reclasificar una oferta al cambiar el contexto de consulta. La expectativa y el máximo ofrecido se comparan únicamente cuando la jornada coincide.

## Cuestionario, conexiones y rutas

Las respuestas opcionales activan reglas visibles: explorar si no hay ocupación definida; conversar formación si se solicita; apoyar el CV si se declara desactualizado o se pide ayuda para describir experiencia; acordar un canal si hay acceso digital ocasional o necesidad de apoyo; practicar entrevista y revisar oportunidades con el equipo. Se proponen hasta cinco pasos. Omitir una respuesta o reservarla no se interpreta como una carencia.

Las conexiones se basan exclusivamente en ocupación compartida. Las diferencias de meses, salario y jornada se muestran como asuntos por conversar, nunca como exclusión o puntuación. No se verifican capacidades ni se asignan probabilidades de contratación.

La revisión registra fecha y el actor fijo «Equipo demo» y completa la actividad de revisión. Modificar respuestas, perfil o avance invalida esa revisión. Regenerar una ruta con avance requiere confirmación en el formulario. Ninguna acción envía postulaciones, cambia automáticamente el estado de inscripción ni genera un CV.

La aplicación guarda datos en `talentia.demo.v1` en este navegador. La vista inicial de portada es una vista previa del escenario base; el panel usa datos locales y filtros actuales. Las vistas son navegación de demostración y no constituyen autenticación.
