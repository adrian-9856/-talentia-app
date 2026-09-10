# TALENTIA · Piloto funcional para la sesión del lunes

## Objetivo de la entrega

Demostrar que siete personas pueden actuar como participantes, completar un recorrido inicial y enviar sus resultados a un panel compartido. La persona responsable de la Unidad puede observar cómo TALENTIA convierte cada formulario en información operativa sin reconstruirla manualmente.

## Qué funciona en esta versión

### Participante

1. Crea un expediente ficticio.
2. Completa datos básicos y consentimiento del piloto.
3. Completa su perfil laboral.
4. Responde el cuestionario de orientación.
5. Recibe una ruta inicial explicable.
6. Observa las actividades sugeridas.
7. Envía una copia al panel compartido.

### Administración

1. Recibe los expedientes enviados desde distintos dispositivos.
2. Actualiza la bandeja automáticamente cada diez segundos.
3. Ve el número de recorridos recibidos frente a la meta de siete.
4. Filtra por nombre, municipio, programa, ocupación o ruta.
5. Observa la ruta A, B o C sugerida.
6. Revisa las señales que originaron la propuesta.
7. Consulta el estado declarado del CV.
8. Identifica la próxima acción y el avance de actividades.
9. Abre las respuestas originales que produjeron el resultado.

## Recorrido para la reunión

### Preparación

- Compartir con las siete personas el enlace de la vista participante.
- Pedir que utilicen información ficticia.
- Cada correo debe ser diferente y terminar en `@example.com`.
- Abrir el panel compartido en la pantalla de presentación.
- Mantener una pestaña adicional con un recorrido completo por si una persona pierde conexión.

### Ejecución

1. Las siete personas entran en **Soy participante**.
2. Cada una selecciona **Crear otro registro ficticio** si aparece una historia de muestra.
3. Completan datos básicos, perfil y cuestionario.
4. Revisan la ruta sugerida.
5. Pulsan **Enviar al panel**.
6. La persona que presenta observa cómo aumenta “Recorridos recibidos”.
7. Abre dos o tres casos para comparar cómo respuestas distintas producen señales, rutas y próximas acciones distintas.
8. Utiliza los filtros para mostrar que la misma información puede consultarse como inventario grupal.

## Transformación demostrada

| Lo que llena la participante | Lo que recibe la operadora |
|---|---|
| Datos básicos | Expediente identificable y filtrable |
| Formación y experiencia | Perfil resumido para revisión |
| Ocupación de interés | Segmentación de talento |
| Claridad del objetivo | Señal de exploración cuando corresponde |
| Estado del CV | Cola de creación, revisión o conversación |
| Apoyo para describir experiencia | Módulo de acompañamiento sugerido |
| Acceso digital | Alternativa de apoyo sugerida |
| Interés en formación | Actividad formativa sugerida |
| Actividades de ruta | Avance y próxima acción |

## Regla provisional de rutas

La versión piloto cuenta señales explícitas de acompañamiento:

- **Ruta A — Descubrir y preparar:** cuatro o más señales.
- **Ruta B — Fortalecer y practicar:** dos o tres señales.
- **Ruta C — Conectar y dar seguimiento:** cero o una señal.

Esta regla no mide empleabilidad, talento ni posibilidad de contratación. Sirve para demostrar una transformación transparente y debe validarse metodológicamente antes de un uso real.

## Arquitectura de esta versión

- El expediente de trabajo continúa guardándose localmente mientras la participante llena el formulario.
- Solo al pulsar **Enviar al panel** se crea una copia compartida.
- El servidor vuelve a validar la información y calcula la transformación.
- La base compartida reemplaza el registro anterior cuando se utiliza nuevamente el mismo correo ficticio.
- El panel lee la base común; por eso puede reunir recorridos enviados desde dispositivos diferentes.

## Límites conscientes del piloto

- Utiliza únicamente información ficticia.
- No incluye cuentas ni permisos institucionales.
- El panel administrativo de esta prueba no tiene control de acceso propio.
- No admite documentos reales ni imágenes de identificación.
- No realiza pruebas psicométricas.
- No genera todavía un archivo de CV.
- No envía correos ni mensajes de WhatsApp.
- No comparte perfiles con empresas.
- No realiza postulaciones ni selección automática.

Estos límites permiten validar el viaje del dato antes de incorporar información sensible, integraciones y procesos institucionales.

## Criterios para considerar exitosa la sesión

- Se reciben siete recorridos desde dispositivos distintos.
- Ningún expediente requiere transcripción manual en el panel.
- Las respuestas diferentes producen resultados diferentes y explicables.
- La operadora puede identificar el próximo paso de una persona en menos de un minuto.
- El equipo comprende la diferencia entre datos capturados, transformación automática y decisión humana.
- La conversación final permite priorizar qué automatización construir después: documentos, CV, avisos o inventario para empresas.

## Siguiente etapa después de la validación

1. Incorporar acceso por roles y consentimiento institucional.
2. Agregar checklist y carga segura de documentación.
3. Generar el primer borrador de CV para revisión.
4. Crear la bandeja “Hoy” con excepciones y recordatorios.
5. Añadir filtros grupales por cohorte, carrera, disponibilidad y preparación.
6. Validar formularios, reglas y nombres de rutas con la Unidad.
