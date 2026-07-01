export type CourseLessonType = "text" | "audio" | "video";

export type CourseLesson = {
  title: string;
  durationMin: number;
  body: string;
  type: CourseLessonType;
};

/** Contenido demo de lecciones. Los cursos no listados usan títulos genéricos. */
export const COURSE_LESSONS: Record<string, CourseLesson[]> = {
  "respiracion-478": [
    {
      title: "Por qué funciona la 4-7-8",
      durationMin: 5,
      type: "text",
      body: `La respiración 4-7-8 activa el sistema parasimpático: baja el ritmo cardíaco y calma la mente en pocos minutos.

No necesitas experiencia previa. Solo un lugar donde sentarte o tumbarse cómodamente.

**Lo que vas a notar:** al exhalar lento, la tensión en hombros y mandíbula suele aflojarse primero. Es normal si al principio te cuesta mantener el ritmo.`
    },
    {
      title: "Práctica guiada paso a paso",
      durationMin: 8,
      type: "audio",
      body: `**Instrucciones:**

1. Coloca una mano en el pecho y otra en el abdomen.
2. **Inhala** por la nariz contando hasta **4**.
3. **Mantén** el aire contando hasta **7** (sin forzar).
4. **Exhala** por la boca contando hasta **8**, como soplando una vela lejana.

Repite el ciclo **4 veces**. Si te mareas, vuelve a tu respiración normal y retoma más tarde.

**Consejo:** la exhalación larga es la clave. No compitas con el reloj; adapta el ritmo a tu cuerpo.`
    },
    {
      title: "Integrarla en tu día",
      durationMin: 5,
      type: "text",
      body: `Usa la 4-7-8 en tres momentos concretos:

- **Al despertar**, antes de mirar el móvil.
- **Antes de una conversación difícil** (5 minutos antes).
- **Al acostarte**, con las luces tenues.

Puedes pedir apoyo en la sección Apoyo diciendo "probemos respiración 4-7-8". El equipo te guía en tiempo real.

**Meta de hoy:** una sola ronda completa. Mañana, dos.`
    }
  ],

  "alfabetizacion-digital": [
    {
      title: "Tu móvil, tu aliado",
      durationMin: 12,
      type: "text",
      body: `Empezamos por lo que ya tienes: el smartphone.

**Hoy aprenderás:**
- Organizar iconos en carpetas (Salud, Trabajo, Banco).
- Activar el modo "No molestar" para entrevistas.
- Hacer capturas de pantalla para guardar justificantes.

**Ejercicio:** crea una carpeta llamada "RENACE" y mete dentro las apps que uses para tu proceso (calendario, email, esta app).`
    },
    {
      title: "Correo electrónico profesional",
      durationMin: 15,
      type: "text",
      body: `Un correo claro abre puertas. Estructura mínima:

**Asunto:** concreto ("Solicitud de entrevista — puesto de almacén").

**Cuerpo:**
1. Saludo ("Buenos días, [nombre]").
2. Quién eres en una línea.
3. Qué pides o ofreces.
4. Despedida y teléfono.

**Plantilla incluida:**
> Buenos días. Me llamo [nombre] y estoy buscando incorporarme como [puesto]. Adjunto mi CV. Quedo a disposición para una entrevista. Un saludo, [teléfono].

Practica enviándote el email a ti mismo.`
    },
    {
      title: "Trámites online (SEPE y cita médica)",
      durationMin: 18,
      type: "video",
      body: `Muchos trámites se hacen desde el navegador. Pasos generales:

**SEPE / prestaciones:**
1. Entra en sede.sepe.gob.es con certificado digital, Cl@ve o DNIe.
2. En "Mis solicitudes" revisa el estado.
3. Guarda PDF de cada resolución en una carpeta "Trámites".

**Cita sanitaria:**
- App de tu comunidad autónoma o SMS al número oficial.
- Ten a mano tu tarjeta sanitaria (foto en el móvil).

**Seguridad:** nunca compartas contraseñas por WhatsApp. El SEPE no pide datos bancarios por SMS.`
    },
    {
      title: "Google Docs y Word básico",
      durationMin: 20,
      type: "text",
      body: `Tu CV y cartas van en documento de texto.

**Formato básico:**
- Fuente Arial o Calibri, tamaño 11–12.
- Márgenes normales.
- Negrita solo en títulos de sección.

**Secciones mínimas del CV:**
1. Datos de contacto
2. Perfil (3 líneas)
3. Experiencia (más reciente primero)
4. Formación
5. Habilidades

**Truco:** en Google Docs, menú Archivo → Descargar → PDF para enviar a empresas.`
    },
    {
      title: "Buscar empleo en internet",
      durationMin: 15,
      type: "text",
      body: `Portales útiles en España: InfoJobs, Indeed, LinkedIn, SEPE Empleo.

**Rutina de 20 minutos:**
1. Filtra por tu ciudad y puesto.
2. Guarda 3 ofertas en favoritos.
3. Adapta una línea del CV a cada oferta (palabras clave del anuncio).

En RENACE, la sección Laboral te muestra ofertas con match. Marca "Me interesa" para llevar el control.`
    },
    {
      title: "Protege tu identidad digital",
      durationMin: 10,
      type: "text",
      body: `**Checklist de seguridad:**
- Contraseña distinta para email y banca.
- Activar verificación en dos pasos en Gmail/Outlook.
- No publicar fotos de documentos en redes.
- Desconfiar de "ofertas" que piden dinero adelantado.

Si algo te suena demasiado bueno, pregunta en Comunidad o al equipo de apoyo antes de hacer clic.`
    }
  ],

  "habitos-reinsercion": [
    {
      title: "Por qué los hábitos importan más que la motivación",
      durationMin: 10,
      type: "text",
      body: `La motivación sube y baja. Los hábitos sostienen cuando no hay ganas.

**Idea clave:** un hábito es una acción pequeña repetida en el mismo contexto (después del café, antes de dormir).

No intentes cambiar todo a la vez. Elige **uno** esta semana.`
    },
    {
      title: "Rutina matutina de 15 minutos",
      durationMin: 12,
      type: "text",
      body: `**Secuencia sugerida:**
1. Agua (1 min)
2. Respiración o estiramiento (5 min)
3. Revisar el plan del día en RENACE (3 min)
4. Desayuno sin pantalla (6 min)

Pon la alarma 15 minutos antes de lo habitual solo 3 días. Evalúa cómo te sientes al mediodía.`
    },
    {
      title: "Organización personal sin complicarte",
      durationMin: 15,
      type: "text",
      body: `**Método de tres listas:**
- **Hoy:** máximo 3 tareas realistas.
- **Esta semana:** citas, trámites, entrevistas.
- **Algún día:** ideas que no urgencian.

Usa notas del móvil o papel. Lo importante es vaciar la cabeza para dormir mejor.`
    },
    {
      title: "Gestión del tiempo y distracciones",
      durationMin: 12,
      type: "text",
      body: `**Técnica Pomodoro light:** 25 min de foco + 5 min de pausa. Solo dos ciclos al día ya suman.

**Distracciones comunes:** redes, noticias, compararte con otros.

Activa "Tiempo de uso" en el móvil para ver cuánto consumes. No para castigarte, para decidir con datos.`
    },
    {
      title: "Finanzas básicas: sobrevivir al mes",
      durationMin: 18,
      type: "text",
      body: `**Tres números que necesitas saber:**
1. Ingresos mensuales (netos).
2. Gastos fijos (alquiler, luz, comida mínima).
3. Margen libre (lo que queda).

**Regla 50/30/20 adaptada:** si el margen es pequeño, prioriza fijos primero. Ahorrar 5 € también cuenta.

Pide ayuda en el área Jurídica si hay deudas o embargos: no estás solo/a.`
    },
    {
      title: "Plan de la próxima semana",
      durationMin: 10,
      type: "text",
      body: `**Cierra el curso con un compromiso escrito:**

- Un hábito que mantendrás (ej.: caminar 10 min tras comer).
- Un hábito que dejarás o reducirás (ej.: móvil en la cama).
- Una persona de apoyo a quien contárselo.

Vuelve a RENACE el lunes y marca tu ánimo. El 360 reflejará tu constancia.`
    }
  ]
};

/** Títulos genéricos para cursos sin contenido detallado. */
const GENERIC_TITLES = [
  "Introducción y objetivos",
  "Conceptos clave",
  "Práctica guiada",
  "Ejercicio aplicado",
  "Repaso y dudas",
  "Integración en tu día",
  "Casos reales",
  "Evaluación rápida",
  "Profundización",
  "Recursos extra",
  "Práctica avanzada",
  "Cierre y siguientes pasos"
];

export function getCourseLessons(slug: string, fallbackCount = 6): CourseLesson[] {
  const detailed = COURSE_LESSONS[slug];
  if (detailed) return detailed;

  const count = Math.max(1, fallbackCount);
  return Array.from({ length: count }, (_, i) => ({
    title: GENERIC_TITLES[i] ?? `Lección ${i + 1}`,
    durationMin: Math.max(5, Math.round(30 / count)),
    body: `Contenido de la lección ${i + 1}. Estamos ampliando este curso con material guiado. Mientras tanto, avanza marcándola como vista para registrar tu progreso.`,
    type: "text" as const
  }));
}

export function getCourseLesson(
  slug: string,
  lessonIndex: number,
  fallbackCount = 6
): CourseLesson | null {
  const lessons = getCourseLessons(slug, fallbackCount);
  if (lessonIndex < 1 || lessonIndex > lessons.length) return null;
  return lessons[lessonIndex - 1] ?? null;
}

/** Convierte markdown-lite (**bold**, listas) a párrafos HTML-safe vía líneas. */
export function lessonBodyToParagraphs(body: string): string[] {
  return body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}
