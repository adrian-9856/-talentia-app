# TALENTIA · Dossier de Arquitectura, Metodología y Lluvia de Ideas (Fase 1)

> **Herramienta de Apoyo para la Unidad de Inserción Laboral**  
> **Expediente V2 · Versión Piloto**  
> *Principio Rector:* «La tecnología organiza y sugiere; las personas orientan y deciden».

---

## 1. Resumen Ejecutivo del Proyecto

TALENTIA nace como una solución integral para los equipos de inserción socio-laboral, resolviendo la necesidad de acompañar a cada persona con un itinerario a medida sin perder el rigor metodológico ni la calidez del trato humano.

En esta **Fase 1**, la plataforma cuenta con una arquitectura de **doble uso sincronizado**:
1. **La persona participante**: Cuenta con un espacio accesible, transparente y motivador donde responde su cuestionario de perfil laboral, visualiza su ruta de empleo paso a paso como un mapa interactivo, consulta los compromisos alcanzados en sus visitas y dispone de su CV listo para imprimir.
2. **El orientador / técnico de inserción**: Dispone de un panel centralizado donde supervisa los expedientes, visa técnicamente las sugerencias de la máquina, programa y registra tutorías (con acuerdos pactados y asignación presupuestaria V2) y cuenta con **alertas inteligentes de seguimiento para evitar que ningún participante pase más de 15 días sin atención**.

---

## 2. Mapa Conceptual de la Solución

```text
       ┌─────────────────────────────────────────────────────────────┐
       │                TALENTIA · UNIDAD DE INSERCIÓN               │
       └──────────────┬───────────────────────────────┬──────────────┘
                      │                               │
        ┌─────────────▼─────────────┐   ┌─────────────▼─────────────┐
        │    VISTA PARTICIPANTE     │   │   VISTA TÉCNICA / EQUIPO  │
        └─────────────┬─────────────┘   └─────────────┬─────────────┘
                      │                               │
        ┌─────────────┼─────────────┐   ┌─────────────┼─────────────┐
        │             │             │   │             │             │
   Cuestionario     Ruta         Mi CV   Expediente    Recordatorios  Registro
   Orientación     Interactiva   Oficial    V2          (>15 días)    Visitas
  (5 Dimensiones) (En flujo)           (Supervisión)   (Alertas)    (Acuerdos)
```

---

## 3. Motor de orientación por señales explicables

TALENTIA no debe producir una nota de “empleabilidad” ni clasificar el valor de una persona. El sistema puede ordenar **señales de apoyo requerido** para proponer el siguiente paso, siempre mediante reglas transparentes y auditables.

| Dimensión observada | Qué pregunta | Qué puede activar |
| :--- | :--- | :--- |
| **Objetivo laboral** | Si la participante tiene una ocupación o área de interés definida. | Exploración de intereses y ocupaciones. |
| **Relato de experiencia** | Si puede reconocer y explicar experiencias formales, informales, comunitarias o de cuidados. | Taller para convertir experiencias en ejemplos y logros. |
| **Herramientas de búsqueda** | Si cuenta con CV y necesita crearlo, actualizarlo o revisarlo. | Módulo de CV y presentación personal. |
| **Preparación para conversar** | Si desea practicar entrevistas, presentación o búsqueda. | Práctica acompañada. |
| **Condiciones buscadas** | Si ha definido disponibilidad, horario, movilidad y preferencias. | Conversación para precisar condiciones. |
| **Acceso digital** | Si puede realizar las actividades de manera autónoma o necesita otra modalidad. | Apoyo digital o alternativa presencial. |

Si se utiliza una escala, debe representar **cantidad de acompañamiento**, no capacidad. Las bandas y pesos serían provisionales, configurables y validados por la Unidad. “Prefiero no responder” no suma puntos ni genera interpretaciones: crea una conversación pendiente.

### Propuesta de rutas

- **Ruta A: Descubrir y preparar**  
  *Enfoque:* Clarificar el objetivo, reconocer la experiencia y construir herramientas iniciales.

- **Ruta B: Fortalecer y practicar**  
  *Enfoque:* Mejorar aspectos concretos del perfil, el CV, las competencias o la presentación laboral.

- **Ruta C: Conectar y dar seguimiento**  
  *Enfoque:* Explorar oportunidades pertinentes, preparar cada conversación y acompañar el resultado.

La ruta base se combina con módulos específicos. Dos participantes en la Ruta B no tienen que completar exactamente las mismas actividades.

> **Regla de Oro TALENTIA:** *La propuesta de ruta se conversa con la participante. La orientadora puede confirmarla, ajustarla o posponerla, y el sistema registra la razón y la versión de las reglas utilizadas.*

---

## 4. La Ruta hacia el Empleo ("Flujo con Criterio")

El itinerario no es una lista estática de tareas, sino un **pipeline progresivo** estructurado en etapas:
1. **Acogida y Diagnóstico Integral**: Apertura del expediente V2, firma del consentimiento y baremación inicial.
2. **Competencias y Plan de Acción**: Talleres específicos según la ruta (alfabetización digital, habilidades blandas o acreditación).
3. **Herramientas de Selección y Marca Personal**: Construcción del currículum vitae, carta y perfiles digitales.
4. **Intermediación y Práctica de Entrevistas**: Simulacros presenciales y postulaciones supervisadas a ofertas.
5. **Inserción y Seguimiento en Puesto**: Apoyo tutelado durante el primer trimestre de contrato laboral para asegurar la retención.

Cada hito tiene asignado un **responsable explícito** (*Participante*, *Orientador* o *Ambos*), una fecha límite y un **Consejo Práctico TALENTIA**.

---

## 5. Seguimiento de Visitas y Expediente V2

El seguimiento del participante se basa en visitas y tutorías reales:
- **Modalidades**: Presencial en despacho/aula, Telefónica, Videollamada (Online) o Sesión Grupal.
- **Trazabilidad Documental**:
  - Motivo de la cita.
  - Resumen técnico de la intervención realizada.
  - **Pacto de compromisos**: Acuerdos concretos que el participante y el orientador se comprometen a cumplir para la siguiente cita.
  - Vinculación presupuestaria al **Expediente V2** (ej. *Partida 1.2 - Orientación Individualizada*, *Partida 2.1 - Intermediación*).
  - Fecha del próximo contacto programado.

---

## 6. Nuevo Módulo de Recordatorios Automáticos (>15 días)

Para garantizar que nadie quede rezagado en su proceso:
- El sistema escanea en tiempo real la fecha de la última sesión realizada para cada participante activo.
- Si han transcurrido **más de 15 días** sin contacto formal o si un participante registrado no tiene su primera sesión de acogida, se genera una alerta visual en el panel del orientador.
- Clasifica la urgencia en **Atención (+15 días)** y **Urgente (+25 días o sin contacto inicial)**.
- Ofrece botones directos para **«Programar Visita»** o **«Ver Expediente»** con un solo clic.

---

## 7. Lluvia de Ideas para Fases Posteriores

A continuación se recopilan ideas estratégicas para cuando el proyecto avance más allá de la Fase 1:

### A. Automatizaciones y Comunicaciones Ágiles
1. **Recordatorios SMS / WhatsApp Automáticos**: Enviar un mensaje recordatorio 24 horas antes de la cita con el enlace a la ubicación o videollamada.
2. **Alertas de Inactividad al Participante**: Enviar un mensaje de motivación al participante si lleva más de 10 días sin marcar avances en sus hitos de la ruta.
3. **Generación con un Clic de Informes de Seguimiento**: Descarga en PDF del informe de evolución del participante listo para justificar subvenciones del expediente V2.

### B. Módulo de Empresas y Prospección (Fase 2)
1. **Ficha de presentación con datos mínimos**: Permitir que la orientadora prepare, con autorización de la participante, un perfil para una empresa sin compartir información personal innecesaria.
2. **Registro de Empresas Colaboradoras**: Directorio de empleadores con histórico de contrataciones e inserciones exitosas.
3. **Encuesta de Satisfacción Poscontratación**: Cuestionario breve a los 30 y 90 días del contrato para medir la adaptación de la persona insertada.

### C. Dinámicas y Gamificación Positiva
1. **Pasaporte de avances**: Un mapa de insignias descriptivas que muestre herramientas y logros reales, como “CV revisado” o “entrevista practicada”.
2. **Simulador de Preguntas Difíciles**: Módulo interactivo donde el participante puede practicar respuestas para preguntas típicas de entrevistas de selección.

---

## 8. Propuesta desarrollada: “Tu camino laboral”

La referencia visual propone una navegación parecida a un mapa: una ruta continua, estaciones circulares, una actividad destacada y diferentes paisajes. En TALENTIA esa lógica puede convertirse en un **expediente que se completa paso a paso**.

No sería una simple barra de progreso ni una lista larga de formularios. Cada parada tendría un propósito comprensible, una duración estimada, un responsable y un resultado visible.

### Qué debe comunicar el mapa

- **Dónde estoy.** La etapa actual está destacada.
- **Qué ya conseguí.** Las estaciones terminadas muestran fecha y resultado.
- **Qué sigue.** Solo una acción principal domina la pantalla.
- **Por qué me lo piden.** Cada formulario explica su utilidad.
- **Quién me ayuda.** Las actividades acompañadas muestran a la orientadora responsable.
- **Qué puedo cambiar.** La participante puede revisar respuestas y conversar su ruta.

### Anatomía visual sugerida

```text
┌──────────────────────────────────────┐
│ TU CAMINO LABORAL          35%       │
│ Ruta: Fortalecer y practicar         │
├──────────────────────────────────────┤
│                                      │
│       ✓ Bienvenida y consentimiento  │
│       │                              │
│   ✓───● Datos personales             │
│       │                              │
│       ◉ Perfil laboral  ← ESTÁS AQUÍ │
│       │   “5 minutos”                │
│       │   [Continuar]                │
│       │                              │
│       ○ Experiencia e intereses      │
│       │                              │
│       ◇ Conversación con orientadora │
│       │                              │
│       🔒 Mi ruta personalizada       │
│                                      │
└──────────────────────────────────────┘
```

El camino puede curvarse suavemente y atravesar zonas con personalidades visuales distintas. La estética debe sentirse adulta, optimista y profesional. Se pueden usar ilustraciones discretas de comunidad, herramientas, aprendizaje y oportunidades, evitando premios infantiles o competencia entre participantes.

### Estados de una estación

| Estado | Representación | Significado |
|---|---|---|
| **Completada** | Círculo con check | Se guardó y puede revisarse. |
| **Actual** | Círculo destacado con halo | Es la siguiente acción recomendada. |
| **Disponible** | Círculo de borde sólido | Puede realizarse ahora. |
| **Pendiente** | Círculo de borde suave | Todavía no es la acción principal. |
| **Requiere acompañamiento** | Símbolo de conversación | Se completa con la orientadora. |
| **Opcional** | Rombo o etiqueta “opcional” | Enriquece el perfil, pero no bloquea la ruta. |
| **En revisión** | Reloj | El equipo debe validar el resultado. |
| **Necesita corrección** | Aviso con texto | Explica exactamente qué falta. |

Los bloqueos deben utilizarse con cuidado. Una persona no debería quedar detenida por no responder una pregunta opcional o sensible. Cuando un requisito institucional sea obligatorio, la pantalla debe explicar qué falta y ofrecer ayuda.

## 9. El camino completo de llenado

### Zona 0 — Inicio seguro

**Objetivo:** dar contexto y obtener autorización informada.

1. **Bienvenida** — Qué es TALENTIA, qué recibirá la participante y cuánto dura el proceso inicial.
2. **Uso de datos y consentimiento** — Finalidad, acceso, corrección y conservación.
3. **Preferencias de atención** — Idioma, canal, accesibilidad y apoyo requerido para llenar formularios.

**Resultado visible:** “Tu expediente está abierto”.  
**Resultado para el CRM:** consentimiento versionado, canal preferido y necesidad de apoyo.

### Zona 1 — Quién soy y cómo contactarme

**Objetivo:** completar la información personal mínima necesaria.

1. Datos de identificación definidos por la Unidad.
2. Datos de contacto.
3. Municipio o zona general.
4. Programa y cohorte, cuando corresponda.
5. Contacto alternativo únicamente si existe una razón operativa clara y consentimiento.
6. Revisión final de los datos.

**Diseño:** dividir el formulario en bloques cortos. Mostrar “3 de 5” dentro de la estación, permitir guardar y continuar después, y validar cada campo cerca del lugar donde ocurre el error.

**Resultado visible:** “Información personal completada”.  
**Resultado para el CRM:** ficha de participante y alerta de campos que requieren verificación.

### Zona 2 — Mi historia laboral

**Objetivo:** comprender la experiencia sin limitarla al empleo formal.

1. Estudios, cursos y certificaciones.
2. Trabajos formales anteriores.
3. Emprendimientos y trabajo por cuenta propia.
4. Experiencia informal, comunitaria, voluntaria o de cuidados que la participante desee incluir.
5. Tareas que sabe realizar.
6. Ocupaciones y sectores de interés.
7. Condiciones de trabajo buscadas.

**Interacción valiosa:** ofrecer ejemplos antes de preguntar. “Atender clientes en un negocio familiar” puede ayudar a reconocer experiencia sin que el sistema invente competencias.

**Resultado visible:** una tarjeta resumen editable de su historia laboral.  
**Resultado para el CRM:** perfil estructurado y temas que la orientadora debe conversar.

### Zona 3 — Cuestionario de orientación

**Objetivo:** identificar apoyos útiles para construir la ruta.

Puede incluir preguntas sobre:

- Claridad del objetivo laboral.
- Confianza para explicar experiencia con ejemplos.
- Estado del CV.
- Preparación para entrevistas y búsqueda.
- Definición de horario, disponibilidad y movilidad.
- Acceso a teléfono, correo y herramientas digitales.
- Interés en formación o práctica.

Este cuestionario debe llamarse **cuestionario de orientación** o **autodiagnóstico acompañado**. Si fue creado por el equipo para organizar el servicio, no debe presentarse como prueba psicométrica.

**Resultado visible:** “Esto es lo que entendimos”, con tres bloques:

- Lo que ya tienes preparado.
- Lo que quieres fortalecer.
- Lo que conviene conversar con tu orientadora.

**Resultado para el CRM:** señales por dimensión, módulos sugeridos y explicación de cada sugerencia.

### Zona 4 — Evaluación psicométrica, solo cuando tenga sentido

Una evaluación psicométrica es un instrumento profesional con evidencia de validez, instrucciones estandarizadas y reglas de interpretación. No debe confundirse con un cuestionario creado para la demo.

Antes de incorporarla, la Unidad tendría que definir:

1. Qué decisión o intervención justifica aplicarla.
2. Qué instrumento validado se utilizará y para qué población.
3. Quién tiene autorización y formación para administrarlo e interpretarlo.
4. Si existe licencia para utilizarlo digitalmente.
5. Qué consentimiento específico se requiere.
6. Cómo se ofrecerán ajustes de accesibilidad.
7. Quién podrá ver los resultados y durante cuánto tiempo.
8. Cómo se evita su uso para selección automática, exclusión o diagnóstico clínico.

En el mapa aparecería como una estación **acompañada u opcional**, dependiendo del programa. El resultado no debería ser un número aislado. La participante recibiría una explicación comprensible y el equipo registraría únicamente la información necesaria para el plan de apoyo.

### Zona 5 — Conversación y validación humana

**Objetivo:** transformar datos en un acuerdo.

Esta estación no se llena como formulario. Representa una entrevista breve entre la participante y la orientadora:

1. Revisan el resumen.
2. Corrigen datos o interpretaciones.
3. Confirman el objetivo inicial.
4. Seleccionan la ruta base A, B o C.
5. Escogen módulos y actividades.
6. Definen responsable, fecha y modalidad del siguiente paso.

**Resultado visible:** “Esta es la ruta que acordamos”.  
**Resultado para el CRM:** ruta validada, responsable, fecha, versión de reglas y motivo de cualquier ajuste.

### Zona 6 — Mi ruta personalizada

Aquí el camino deja de ser igual para todas las personas y se abre en tres recorridos posibles.

#### Ruta A — Descubrir y preparar

Estaciones sugeridas:

1. Reconocer habilidades y experiencias.
2. Explorar familias de ocupaciones.
3. Elegir uno o dos objetivos iniciales.
4. Crear un primer CV.
5. Resolver necesidades básicas de acceso digital.
6. Revisar el plan con la orientadora.

#### Ruta B — Fortalecer y practicar

Estaciones sugeridas:

1. Ordenar experiencia por logros y ejemplos.
2. Actualizar el CV según el objetivo.
3. Realizar un taller o práctica concreta.
4. Preparar presentación personal.
5. Simular una entrevista.
6. Validar preparación para conversar sobre oportunidades.

#### Ruta C — Conectar y dar seguimiento

Estaciones sugeridas:

1. Confirmar objetivo y condiciones buscadas.
2. Revisar CV final.
3. Explorar empresas u oportunidades verificadas.
4. Conversar y decidir si avanzar.
5. Preparar referencia o postulación.
6. Registrar entrevista y resultado.
7. Programar seguimiento.

### Zona 7 — Seguimiento y nuevos ciclos

El mapa no termina necesariamente con una contratación. Puede abrir un nuevo ciclo:

- Seguimiento a 30, 90 y 180 días.
- Ajuste de horario, expectativas o apoyos.
- Nueva formación.
- Cambio de objetivo.
- Reingreso a una ruta anterior.
- Cierre acordado del acompañamiento.

El camino debe admitir avances, pausas y cambios sin representar una pausa como fracaso.

## 10. Cómo se decide qué estación aparece después

El motor debe utilizar reglas sencillas y visibles.

```text
Si falta consentimiento obligatorio
    → mostrar consentimiento
Si faltan datos personales mínimos
    → mostrar información personal
Si el perfil laboral está incompleto
    → mostrar historia laboral
Si no existe cuestionario vigente
    → mostrar cuestionario de orientación
Si la propuesta no tiene validación humana
    → mostrar conversación con orientadora
Si la ruta está validada
    → mostrar la primera actividad pendiente según fecha y prioridad
Si no hay próxima acción
    → alertar al equipo para acordarla
```

Las reglas de los módulos pueden ser igualmente claras:

```text
Si la participante indica que no tiene CV
    → sugerir “Crear mi CV”
Si tiene CV pero no lo ha revisado recientemente
    → sugerir “Actualizar mi CV”
Si desea ayuda para explicar su experiencia
    → sugerir “Preparar mis ejemplos”
Si necesita apoyo digital
    → ofrecer modalidad acompañada; no bloquear el camino
```

## 11. Diseño de cada formulario

Para evitar abandono y fatiga, cada parada debería seguir estas reglas:

- Una sola finalidad por estación.
- Entre 3 y 7 minutos como referencia, indicando el tiempo antes de empezar.
- Guardado automático y opción de continuar más tarde.
- Preguntas condicionales: no mostrar campos que no correspondan.
- Explicación “¿por qué preguntamos esto?” en los datos menos evidentes.
- Opción de corregir respuestas anteriores.
- “Prefiero no responder” cuando la respuesta no sea indispensable.
- Lenguaje directo, sin términos técnicos ni juicios.
- Controles grandes y navegación cómoda en teléfono.
- Compatibilidad con teclado, lector de pantalla y texto ampliado.
- Resumen de revisión antes de enviar.
- Mensaje de éxito que explique qué se desbloqueó.

Una estación extensa, como la historia laboral, puede dividirse internamente en pequeñas pantallas sin aparecer como diez pasos distintos en el mapa.

## 12. Motivación sin infantilizar

La idea visual puede usar recursos de gamificación, pero el progreso debe representar resultados reales.

### Recursos apropiados

- Animación breve cuando se completa una etapa.
- Mensajes concretos: “Ya puedes revisar tu ruta”.
- Insignias descriptivas: “CV revisado”, “Objetivo definido” o “Entrevista practicada”.
- Celebración privada de logros.
- Vista del camino recorrido.
- Pequeños consejos asociados con la actividad actual.

### Recursos que conviene evitar

- Ranking entre participantes.
- Pérdida de vidas, rachas o castigos por inactividad.
- Puntos sin significado metodológico.
- Mensajes que culpabilicen a la persona.
- Personajes o recompensas con apariencia demasiado infantil.
- Desbloqueos que oculten información necesaria.

## 13. Relación entre el mapa y el CRM del equipo

Cada acción de la participante debe producir algo útil para el equipo, sin duplicar trabajo.

| En “Mi camino” | En el CRM del equipo |
|---|---|
| Completa datos personales | Se actualiza la ficha y aparecen campos por verificar. |
| Guarda su historia laboral | Se crea un resumen para la entrevista de orientación. |
| Termina el cuestionario | Aparecen señales y módulos sugeridos con sus razones. |
| Solicita ayuda | Se crea una tarea para la persona responsable. |
| Confirma una actividad | Se registra el acuerdo y su fecha. |
| Sube o construye su CV | Cambia el estado del documento a “pendiente de revisión”. |
| Marca una actividad | El equipo ve el avance y valida cuando corresponda. |
| Expresa interés en una oportunidad | Se abre una conversación; todavía no se registra como postulación. |

La orientadora debe poder observar el mismo mapa en modo técnico, con información adicional: fechas, responsable, notas, alertas y botones para validar o ajustar.

## 14. Ejemplo de experiencia completa

**Julia entra por primera vez desde su teléfono.**

1. Ve una bienvenida y completa el consentimiento.
2. Llena su información personal en tres bloques breves.
3. En “Mi historia laboral” cuenta que ha apoyado en ventas familiares y desea trabajar como barista.
4. El cuestionario muestra que su objetivo es claro, pero necesita crear su CV y practicar cómo contar su experiencia.
5. TALENTIA propone “Fortalecer y practicar”. No afirma que Julia sea poco empleable; explica qué apoyos activó.
6. Una orientadora revisa el resultado con ella y añade un taller corto de atención al cliente.
7. El mapa de Julia cambia y muestra cuatro estaciones: ejemplos de experiencia, CV, taller y práctica de entrevista.
8. Julia completa su CV. El equipo recibe una tarea de revisión.
9. Cuando ambos acuerdan que está preparada, se activa “Explorar oportunidades”.
10. Julia muestra interés en una empresa vinculada con café. El CRM registra una conversación y programa seguimiento.

Esta historia permite demostrar formularios, personalización, decisión humana, documentos, tareas, empresas y seguimiento mediante una sola narrativa.

## 15. Primera versión que conviene construir

Para demostrar el concepto sin desarrollar todavía todo el CRM, bastaría con:

1. Un mapa vertical adaptable a móvil.
2. Seis estaciones comunes: bienvenida, consentimiento, datos personales, perfil laboral, cuestionario y validación.
3. Tres variantes del mapa para las rutas A, B y C.
4. Estados visuales de completado, actual, pendiente y revisión.
5. Guardado del avance de la participante ficticia.
6. Explicación de por qué se propone cada módulo.
7. Un cambio visible en el CRM cuando se completa una estación.
8. La historia completa de Julia como caso principal.

### Criterio de éxito de la demo

Una persona que nunca ha visto TALENTIA debería poder explicar al terminar:

- qué información completó Julia;
- cuál es su ruta y por qué;
- cuál es su siguiente actividad;
- quién debe acompañarla;
- qué puede ver el equipo;
- y cómo se registra el resultado.

## 16. Decisiones pendientes antes de diseñar las pantallas

1. ¿Cuáles documentos son obligatorios y cuáles opcionales?
2. ¿Qué información personal necesita realmente la Unidad?
3. ¿Qué parte puede completar la participante sin acompañamiento?
4. ¿Qué estaciones requieren validación técnica?
5. ¿Se utilizará solo un cuestionario de orientación o existe un instrumento psicométrico validado?
6. ¿Cuáles son los nombres definitivos de las rutas A, B y C?
7. ¿Qué módulos puede repetir o saltar una participante?
8. ¿Qué condición marca que una estación está completa?
9. ¿Qué sucede cuando alguien cambia de objetivo?
10. ¿Cómo se ofrecerá una alternativa presencial o asistida?
11. ¿Qué actividades debe ver la participante y cuáles son internas del equipo?
12. ¿Qué celebración visual corresponde al tono institucional?

---

*Documento generado para el equipo de TALENTIA · Proyecto Piloto V2.*
