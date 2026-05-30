"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Play, BookOpen, Clock, Tv, Shield, ArrowLeft, Send, CheckCircle2,
  Video, Monitor, Square, ChevronRight, ChevronLeft, FileText, CheckSquare, Award,
  Bot, Globe, RotateCcw, AlertTriangle, Printer, ExternalLink, Volume2
} from 'lucide-react';

// --- Multilingual Translation Database ---
const langMap = {
  en: {
    backToHome: "Back to home",
    welcome: "Welcome",
    courseProgress: "Course Progress",
    complete: "Complete",
    lessonRecording: "Record Lesson",
    recordingActive: "Recording 02:44",
    shareScreen: "Share Screen",
    sharingActive: "Sharing active",
    aboutLecture: "About this Lecture",
    estimatedTime: "ESTIMATED TIME",
    difficultyLevel: "DIFFICULTY LEVEL",
    downloadNotes: "Download PDF Notes",
    liveChat: "Live Chat",
    attendance: "Attendance",
    studyModules: "Study Modules",
    examCenter: "Exam Center",
    markAttendance: "Mark My Attendance",
    status: "Status",
    attendanceSuccess: "Marked Successfully!",
    attendanceNotMarked: "Not Marked",
    askTutorPlaceholder: "Ask AI tutor or class message...",
    courseSyllabus: "Course Syllabus",
    aiRecommendation: "AI Recommendation",
    recommendationMsg: "You scored 2/2 on the Solar System Quiz. Based on your profile, we recommend checking out \"Phases & Gravity Impacts\" next.",
    // Study guide & flashcards
    flashcards: "Interactive Flashcards",
    cardFlipped: "Click card to flip",
    mastered: "Mastered",
    markMastered: "Mark as Mastered",
    masteredCount: "Mastered Flashcards",
    formulas: "Core Formulas & Equations",
    notes: "Curriculum Lecture Notes",
    transcript: "Video Transcript",
    // Exams
    exams: "Certification Exams",
    startExam: "Start Certification Exam",
    examTimer: "Time Remaining",
    submitExam: "Submit Certification",
    examResult: "Exam Result",
    perfectScore: "Perfect Score! You fully grasp the lecture concepts.",
    niceEffort: "Nice effort! Review the lecture and try again.",
    unlockCert: "Unlock Certificate",
    viewCert: "View & Download Certificate",
    passingCert: "Certificate of Achievement",
    grade: "Grade",
    questions: "Questions",
    question: "Question",
    previous: "Previous",
    next: "Next",
    certificateTitle: "Planetary Physics Certification",
    certificateDesc: "This is to certify that the student has successfully completed the curriculum and masterclass in astrophysics.",
    certificateAwarded: "Awarded on",
    certificateVerification: "Verify ID",
    aboutDesc: "This curriculum introduces core orbital dynamics, gravitational attraction balances between celestial bodies, and detailed properties of planetary systems. Review key parameters and perform check-ins.",
    overview: "Overview",
    tutorName: "AI Tutor",
    tutorReply: "I'm having trouble connecting to my central knowledge network. Let's review gravity and orbits!",
    liveChatGreeting: "Welcome everyone! Today we will learn about gravity and planetary paths."
  },
  es: {
    backToHome: "Volver al inicio",
    welcome: "Bienvenido",
    courseProgress: "Progreso del curso",
    complete: "Completado",
    lessonRecording: "Grabar lección",
    recordingActive: "Grabando 02:44",
    shareScreen: "Compartir pantalla",
    sharingActive: "Pantalla compartida activa",
    aboutLecture: "Acerca de esta lección",
    estimatedTime: "TIEMPO ESTIMADO",
    difficultyLevel: "NIVEL DE DIFICULTAD",
    downloadNotes: "Descargar notas PDF",
    liveChat: "Chat en vivo",
    attendance: "Asistencia",
    studyModules: "Módulos de estudio",
    examCenter: "Centro de exámenes",
    markAttendance: "Marcar mi asistencia",
    status: "Estado",
    attendanceSuccess: "¡Marcado con éxito!",
    attendanceNotMarked: "No marcado",
    askTutorPlaceholder: "Pregunte al tutor de IA o envíe un mensaje...",
    courseSyllabus: "Syllabus del curso",
    aiRecommendation: "Recomendación de IA",
    recommendationMsg: "Obtuviste 2/2 en el Cuestionario. Basado en tu perfil, recomendamos ver \"Phases & Gravity Impacts\" a continuación.",
    flashcards: "Tarjetas interactivas",
    cardFlipped: "Haga clic para voltear",
    mastered: "Dominado",
    markMastered: "Marcar como dominado",
    masteredCount: "Tarjetas dominadas",
    formulas: "Fórmulas y ecuaciones clave",
    notes: "Notas del plan de estudios",
    transcript: "Transcripción del video",
    exams: "Exámenes de certificación",
    startExam: "Iniciar examen de certificación",
    examTimer: "Tiempo restante",
    submitExam: "Enviar certificación",
    examResult: "Resultado del examen",
    perfectScore: "¡Puntuación perfecta! Entiendes completamente los conceptos.",
    niceEffort: "¡Buen esfuerzo! Revisa la lección e intenta de nuevo.",
    unlockCert: "Desbloquear certificado",
    viewCert: "Ver y descargar certificado",
    passingCert: "Certificado de logro",
    grade: "Calificación",
    questions: "Preguntas",
    question: "Pregunta",
    previous: "Anterior",
    next: "Siguiente",
    certificateTitle: "Certificación en Física Planetaria",
    certificateDesc: "Esto certifica que el estudiante ha completado con éxito el plan de estudios y la clase magistral de astrofísica.",
    certificateAwarded: "Otorgado el",
    certificateVerification: "ID de verificación",
    aboutDesc: "Este plan de estudios introduce la dinámica orbital central, los equilibrios de atracción gravitacional entre cuerpos celestes y las propiedades detalladas de los sistemas planetarios. Revise los parámetros clave.",
    overview: "Descripción",
    tutorName: "Tutor de IA",
    tutorReply: "¡Tengo dificultades de conexión! Estudiemos la gravedad y las órbitas juntos.",
    liveChatGreeting: "¡Bienvenidos todos! Hoy aprenderemos sobre la gravedad y las trayectorias planetarias."
  },
  hi: {
    backToHome: "मुख्य पृष्ठ पर जाएं",
    welcome: "स्वागत है",
    courseProgress: "कोर्स प्रगति",
    complete: "पूर्ण",
    lessonRecording: "लेसन रिकॉर्ड करें",
    recordingActive: "रिकॉर्डिंग सक्रिय 02:44",
    shareScreen: "स्क्रीन साझा करें",
    sharingActive: "साझा करना सक्रिय है",
    aboutLecture: "इस लेक्चर के बारे में",
    estimatedTime: "अनुमानित समय",
    difficultyLevel: "कठिनाई स्तर",
    downloadNotes: "पीडीएफ नोट्स डाउनलोड करें",
    liveChat: "लाइव चैट",
    attendance: "उपस्थिति",
    studyModules: "अध्ययन मॉड्यूल",
    examCenter: "परीक्षा केंद्र",
    markAttendance: "मेरी उपस्थिति दर्ज करें",
    status: "स्थिति",
    attendanceSuccess: "सफलतापूर्वक दर्ज!",
    attendanceNotMarked: "दर्ज नहीं",
    askTutorPlaceholder: "एआई ट्यूटर से पूछें या संदेश भेजें...",
    courseSyllabus: "कोर्स पाठ्यक्रम",
    aiRecommendation: "एआई सिफारिश",
    recommendationMsg: "आपने सोलर सिस्टम क्विज़ में 2/2 स्कोर किया। आपकी प्रोफाइल के आधार पर, हम आगे \"Phases & Gravity Impacts\" देखने की सलाह देते हैं।",
    flashcards: "इंटरैक्टिव फ्लैशकार्ड",
    cardFlipped: "पलटने के लिए क्लिक करें",
    mastered: "पूर्ण सिद्ध",
    markMastered: "मास्टर्ड के रूप में चिह्नित करें",
    masteredCount: "मास्टर्ड फ्लैशकार्ड",
    formulas: "मुख्य सूत्र और समीकरण",
    notes: "पाठ्यक्रम लेक्चर नोट्स",
    transcript: "वीडियो ट्रांसक्रिप्ट",
    exams: "प्रमाणन परीक्षा",
    startExam: "प्रमाणन परीक्षा शुरू करें",
    examTimer: "शेष समय",
    submitExam: "प्रमाणन जमा करें",
    examResult: "परीक्षा परिणाम",
    perfectScore: "उत्कृष्ट स्कोर! आप लेक्चर की अवधारणाओं को पूरी तरह से समझ गए हैं।",
    niceEffort: "अच्छा प्रयास! लेक्चर की समीक्षा करें और पुनः प्रयास करें।",
    unlockCert: "सर्टिफिकेट अनलॉक करें",
    viewCert: "प्रमाण पत्र देखें और डाउनलोड करें",
    passingCert: "उपलब्धि का प्रमाण पत्र",
    grade: "ग्रेड",
    questions: "प्रश्न",
    question: "प्रश्न",
    previous: "पिछला",
    next: "अगला",
    certificateTitle: "प्लेनेटरी फिजिक्स प्रमाणन",
    certificateDesc: "यह प्रमाणित किया जाता है कि छात्र ने खगोल भौतिकी में पाठ्यक्रम और मास्टरक्लास को सफलतापूर्वक पूरा कर लिया है।",
    certificateAwarded: "प्रदान किया गया",
    certificateVerification: "सत्यापन आईडी",
    aboutDesc: "यह पाठ्यक्रम मुख्य कक्षीय गतिकी, आकाशीय पिंडों के बीच गुरुत्वाकर्षण आकर्षण संतुलन और ग्रह प्रणालियों के विस्तृत गुणों का परिचय देता है।",
    overview: "अवलोकन",
    tutorName: "एआई ट्यूटर",
    tutorReply: "मुझे मेरे सेंट्रल नेटवर्क से जुड़ने में समस्या हो रही है। आइए गुरुत्वाकर्षण और कक्षाओं का अध्ययन करें!",
    liveChatGreeting: "सभी का स्वागत है! आज हम गुरुत्वाकर्षण और ग्रहों के पथ के बारे में सीखेंगे।"
  },
  fr: {
    backToHome: "Retour à l'accueil",
    welcome: "Bienvenue",
    courseProgress: "Progression du Cours",
    complete: "Terminé",
    lessonRecording: "Enregistrer la leçon",
    recordingActive: "Enregistrement 02:44",
    shareScreen: "Partager l'écran",
    sharingActive: "Partage d'écran actif",
    aboutLecture: "À propos de cette leçon",
    estimatedTime: "TEMPS ESTIMÉ",
    difficultyLevel: "DIFFICULTÉ",
    downloadNotes: "Télécharger les notes PDF",
    liveChat: "Chat en direct",
    attendance: "Présence",
    studyModules: "Modules d'étude",
    examCenter: "Centre d'examen",
    markAttendance: "Marquer ma présence",
    status: "Statut",
    attendanceSuccess: "Présence validée !",
    attendanceNotMarked: "Non validée",
    askTutorPlaceholder: "Poser une question au tuteur IA...",
    courseSyllabus: "Syllabus du cours",
    aiRecommendation: "Recommandation IA",
    recommendationMsg: "Vous avez obtenu 2/2 au Quiz. D'après votre profil, nous vous recommandons de regarder \"Phases & Gravity Impacts\" ensuite.",
    flashcards: "Cartes mémo interactives",
    cardFlipped: "Cliquez pour retourner",
    mastered: "Maîtrisé",
    markMastered: "Marquer comme maîtrisé",
    masteredCount: "Cartes maîtrisées",
    formulas: "Formules et équations clés",
    notes: "Notes de cours",
    transcript: "Transcription vidéo",
    exams: "Examens de certification",
    startExam: "Démarrer l'examen de certification",
    examTimer: "Temps restant",
    submitExam: "Soumettre l'examen",
    examResult: "Résultat de l'examen",
    perfectScore: "Score parfait ! Vous maîtrisez parfaitement les concepts du cours.",
    niceEffort: "Bon effort ! Révisez le cours et réessayez.",
    unlockCert: "Débloquer le certificat",
    viewCert: "Voir & Télécharger le Certificat",
    passingCert: "Certificat de réussite",
    grade: "Note",
    questions: "Questions",
    question: "Question",
    previous: "Précédent",
    next: "Suivant",
    certificateTitle: "Certification en Physique Planétaire",
    certificateDesc: "Ceci certifie que l'étudiant a complété avec succès le syllabus et la masterclass en astrophysique.",
    certificateAwarded: "Décerné le",
    certificateVerification: "ID de vérification",
    aboutDesc: "Ce syllabus présente la dynamique orbitale de base, les équilibres d'attraction gravitationnelle entre les corps célestes et les propriétés détaillées des systèmes planétaires.",
    overview: "Aperçu",
    tutorName: "Tuteur IA",
    tutorReply: "J'ai du mal à me connecter à mon réseau. Étudions la gravité et les orbites !",
    liveChatGreeting: "Bienvenue à tous ! Aujourd'hui, nous allons étudier la gravité et les orbites."
  },
  ar: {
    backToHome: "العودة للرئيسية",
    welcome: "مرحباً",
    courseProgress: "تقدم الدورة",
    complete: "مكتمل",
    lessonRecording: "تسجيل الدرس",
    recordingActive: "التسجيل نشdt 02:44",
    shareScreen: "مشاركة الشاشة",
    sharingActive: "المشاركة نشطة",
    aboutLecture: "حول هذا الدرس",
    estimatedTime: "الوقت المقدر",
    difficultyLevel: "مستوى الصعوبة",
    downloadNotes: "تحميل الملاحظات PDF",
    liveChat: "المحادثة الفورية",
    attendance: "تسجيل الحضور",
    studyModules: "وحدات الدراسة",
    examCenter: "مركز الاختبارات",
    markAttendance: "تسجيل حضوري",
    status: "الحالة",
    attendanceSuccess: "تم تسجيل الحضور بنجاح!",
    attendanceNotMarked: "لم يسجل بعد",
    askTutorPlaceholder: "اسأل المعلم الآلي أو أرسل رسالة...",
    courseSyllabus: "منهج الدورة",
    aiRecommendation: "توصية الذكاء الاصطناعي",
    recommendationMsg: "لقد حصلت على ٢/٢ في اختبار النظام الشمسي. نوصي بمراجعة درس \"تأثيرات الجاذبية والأطوار\" كخطوة تالية.",
    flashcards: "بطاقات الاستذكار التفاعلية",
    cardFlipped: "انقر لقلب البطاقة",
    mastered: "متقن",
    markMastered: "تحديد كمتقن",
    masteredCount: "البطاقات المتقنة",
    formulas: "المعادلات والقوانين الأساسية",
    notes: "ملاحظات المنهج الدراسي",
    transcript: "النص المكتوب للفيديو",
    exams: "اختبارات الشهادة",
    startExam: "بدء اختبار الشهادة",
    examTimer: "الوقت المتبقي",
    submitExam: "إرسال الاختبار",
    examResult: "نتيجة الاختبار",
    perfectScore: "درجة كاملة! لقد استوعبت مفاهيم الدرس تماماً.",
    niceEffort: "جهد طيب! يرجى مراجعة الدرس والمحاولة مرة أخرى.",
    unlockCert: "فتح الشهادة",
    viewCert: "عرض وتحميل الشهادة",
    passingCert: "شهادة إنجاز",
    grade: "الدرجة",
    questions: "الأسئلة",
    question: "السؤال",
    previous: "السابق",
    next: "التالي",
    certificateTitle: "شهادة الفيزياء الكوكبية",
    certificateDesc: "نشهد بموجب هذا أن الطالب قد أكمل بنجاح المنهج الدراسي والتدريب المتقدم في الفيزياء الفلكية.",
    certificateAwarded: "مُنحت في",
    certificateVerification: "رمز التحقق",
    aboutDesc: "يقدم هذا المنهج ديناميكيات المدارات الأساسية، وتوازنات الجاذبية بين الأجرام السماوية، والخصائص التفصيلية للأنظمة الكوكبية.",
    overview: "نظرة عامة",
    tutorName: "معلم ذكي",
    tutorReply: "أواجه مشكلة في الاتصال بالشبكة المركزية. لنراجع معاً الجاذبية والمدارات الكوكبية!",
    liveChatGreeting: "أهلاً بالجميع! سنتعلم اليوم عن الجاذبية والمسارات الكوكبية."
  }
};

const courseContentTranslated = {
  en: [
    {
      id: 1,
      sectionTitle: "1. The Moon & Orbits",
      duration: "2h 45m",
      lectures: [
        { title: "Introduction to Lunar Cycles", duration: "12m 30s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "Phases & Gravity Impacts", duration: "18m 45s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" },
        { title: "Lunar Eclipse Phenomena", duration: "15m 12s", url: "https://www.youtube.com/embed/9LNaQln11BA" }
      ]
    },
    {
      id: 2,
      sectionTitle: "2. The Gas Giants",
      duration: "3h 12m",
      lectures: [
        { title: "Jupiter: The King of Planets", duration: "22m 10s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "Saturn's Orbit and Rings", duration: "25m 40s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" }
      ]
    }
  ],
  es: [
    {
      id: 1,
      sectionTitle: "1. La Luna y las Órbitas",
      duration: "2h 45m",
      lectures: [
        { title: "Introducción a los Ciclos Lunares", duration: "12m 30s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "Fases e Impactos de la Gravedad", duration: "18m 45s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" },
        { title: "Fenómenos de Eclipse Lunar", duration: "15m 12s", url: "https://www.youtube.com/embed/9LNaQln11BA" }
      ]
    },
    {
      id: 2,
      sectionTitle: "2. Los Gigantes de Gas",
      duration: "3h 12m",
      lectures: [
        { title: "Júpiter: El Rey de los Planetas", duration: "22m 10s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "La Órbita y Anillos de Saturno", duration: "25m 40s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" }
      ]
    }
  ],
  hi: [
    {
      id: 1,
      sectionTitle: "1. चंद्रमा और कक्षाएं",
      duration: "2 घंटे 45 मिनट",
      lectures: [
        { title: "चंद्र चक्र का परिचय", duration: "12m 30s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "चरण और गुरुत्वाकर्षण प्रभाव", duration: "18m 45s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" },
        { title: "चंद्र ग्रहण की घटनाएं", duration: "15m 12s", url: "https://www.youtube.com/embed/9LNaQln11BA" }
      ]
    },
    {
      id: 2,
      sectionTitle: "2. गैस दानव (गैस जायंट्स)",
      duration: "3 घंटे 12 मिनट",
      lectures: [
        { title: "बृहस्पति: ग्रहों का राजा", duration: "22m 10s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "शनि की कक्षा और वलय", duration: "25m 40s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" }
      ]
    }
  ],
  fr: [
    {
      id: 1,
      sectionTitle: "1. La Lune et les Orbites",
      duration: "2h 45m",
      lectures: [
        { title: "Introduction aux cycles lunaires", duration: "12m 30s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "Phases et impacts de la gravité", duration: "18m 45s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" },
        { title: "Phénomènes d'éclipse lunaire", duration: "15m 12s", url: "https://www.youtube.com/embed/9LNaQln11BA" }
      ]
    },
    {
      id: 2,
      sectionTitle: "2. Les Géantes Gazeuses",
      duration: "3h 12m",
      lectures: [
        { title: "Jupiter : Le Roi des Planètes", duration: "22m 10s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "L'orbite et les anneaux de Saturne", duration: "25m 40s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" }
      ]
    }
  ],
  ar: [
    {
      id: 1,
      sectionTitle: "١. القمر والمدارات الكوكبية",
      duration: "ساعتان و٤٥ دقيقة",
      lectures: [
        { title: "مقدمة في الدورات القمرية", duration: "12m 30s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "الأطوار وتأثيرات الجاذبية", duration: "18m 45s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" },
        { title: "ظواهر خسوف القمر", duration: "15m 12s", url: "https://www.youtube.com/embed/9LNaQln11BA" }
      ]
    },
    {
      id: 2,
      sectionTitle: "٢. العمالقة الغازية",
      duration: "٣ ساعات و١٢ دقيقة",
      lectures: [
        { title: "المشتري: ملك الكواكب", duration: "22m 10s", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
        { title: "مدار زحل وحلقاته الجذابة", duration: "25m 40s", url: "https://www.youtube.com/embed/LiOzTQAz13Q" }
      ]
    }
  ]
};

const flashcardsData = {
  en: [
    { front: "Orbit", back: "The gravitationally curved trajectory of an object around a point in space." },
    { front: "Kepler's First Law", back: "All planets move in elliptical orbits, with the sun at one focus." },
    { front: "Escape Velocity", back: "The minimum speed needed for a free object to escape gravitational influence." },
    { front: "Roche Limit", back: "The distance within which tidal forces disintegrate a celestial body." }
  ],
  es: [
    { front: "Órbita", back: "La trayectoria curvada gravitacionalmente de un objeto alrededor de un punto en el espacio." },
    { front: "Primera Ley de Kepler", back: "Todos los planetas se mueven en órbitas elípticas, con el sol en uno de los focos." },
    { front: "Velocidad de Escape", back: "La velocidad mínima necesaria para escapar de la influencia gravitacional." },
    { front: "Límite de Roche", back: "La distancia dentro de la cual las fuerzas de marea desintegran un cuerpo celeste." }
  ],
  hi: [
    { front: "कक्षा (Orbit)", back: "अंतरिक्ष में किसी बिंदु के चारों ओर किसी पिंड का गुरुत्वाकर्षण द्वारा घुमावदार पथ।" },
    { front: "केपलर का पहला नियम", back: "सभी ग्रह सूर्य के चारों ओर अंडाकार कक्षाओं में घूमते हैं, जिसके एक फोकस पर सूर्य होता है।" },
    { front: "पलायन वेग (Escape Velocity)", back: "गुरुत्वाकर्षण प्रभाव से बचने के लिए किसी मुक्त पिंड को आवश्यक न्यूनतम गति।" },
    { front: "रोश सीमा (Roche Limit)", back: "वह दूरी जिसके भीतर ज्वारीय बल किसी आकाशीय पिंड को विघटित कर देते हैं।" }
  ],
  fr: [
    { front: "Orbite", back: "La trajectoire courbée par la gravité d'un objet autour d'un point dans l'espace." },
    { front: "Première loi de Kepler", back: "Toutes les planètes se déplacent sur des orbites elliptiques, avec le soleil à l'un des foyers." },
    { front: "Vitesse de libération", back: "La vitesse minimale nécessaire pour échapper à l'attraction gravitationnelle." },
    { front: "Limite de Roche", back: "La distance en deçà de laquelle les forces de marée désintègrent un corps céleste." }
  ],
  ar: [
    { front: "المدار", back: "المسار المنحني بفعل الجاذبية لجرم ما حول نقطة في الفضاء." },
    { front: "قانون كبلر الأول", back: "تدور الكواكب حول الشمس في مدارات إهليلجية (قطع ناقص) وتكون الشمس في إحدى البؤرتين." },
    { front: "سرعة الإفلات", back: "الحد الأدنى من السرعة اللازمة للجسم ليفلت من جاذبية جرم سماوي." },
    { front: "حد روش", back: "المسافة الكافية لتفتت جرم سماوي متماسك بالجاذبية بفعل قوى المد والجزر لجرم آخر." }
  ]
};

const formulasData = {
  en: [
    { name: "Newton's Universal Gravitation", eq: "F = G * (m1 * m2) / r²", desc: "Calculates the attractive force between two masses m1 and m2 at distance r." },
    { name: "Orbital Velocity", eq: "v = √(G * M / r)", desc: "Speed of a body in circular orbit around mass M at distance r." },
    { name: "Kepler's Third Law Ratio", eq: "T² / a³ = Constant", desc: "Relation between the orbital period T and the semi-major axis a." }
  ],
  es: [
    { name: "Gravitación Universal de Newton", eq: "F = G * (m1 * m2) / r²", desc: "Calcula la fuerza de atracción entre dos masas m1 y m2 a una distancia r." },
    { name: "Velocidad Orbital", eq: "v = √(G * M / r)", desc: "Velocidad de un cuerpo en órbita circular alrededor de una masa M a una distancia r." },
    { name: "Tercera Ley de Kepler", eq: "T² / a³ = Constante", desc: "Relación entre el período orbital T y el semieje mayor a." }
  ],
  hi: [
    { name: "न्यूटन का गुरुत्वाकर्षण नियम", eq: "F = G * (m1 * m2) / r²", desc: "दूरी r पर दो द्रव्यमानों m1 और m2 के बीच गुरुत्वाकर्षण बल की गणना करता है।" },
    { name: "कक्षीय वेग (Orbital Velocity)", eq: "v = √(G * M / r)", desc: "दूरी r पर द्रव्यमान M के चारों ओर वृत्ताकार कक्षा में किसी पिंड की गति।" },
    { name: "केपलर का तीसरा नियम", eq: "T² / a³ = नियतांक", desc: "कक्षीय अवधि T और अर्ध-दीर्घ अक्ष a के बीच का संबंध।" }
  ],
  fr: [
    { name: "Gravitation Universelle de Newton", eq: "F = G * (m1 * m2) / r²", desc: "Calcule la force d'attraction entre deux masses m1 et m2 à la distance r." },
    { name: "Vitesse Orbitale", eq: "v = √(G * M / r)", desc: "Vitesse d'un corps en orbite circulaire autour d'une masse M à distance r." },
    { name: "Troisième Loi de Kepler", eq: "T² / a³ = Constante", desc: "Relation entre la période orbital T et le demi-grand axe a." }
  ],
  ar: [
    { name: "قانون نيوتن للجاذبية الكونية", eq: "F = G * (m1 * m2) / r²", desc: "يحسب قوة الجذب بين كتلتين m1 و m2 تفصلهما مسافة r." },
    { name: "السرعة المدارية", eq: "v = √(G * M / r)", desc: "سرعة جرم في مدار دائري حول كتلة M على مسافة r." },
    { name: "قانون كبلر الثالث", eq: "T² / a³ = قيمة ثابتة", desc: "العلاقة التناسبية بين مربع الفترة المدارية T ومكعب نصف المحور الأكبر a." }
  ]
};

const transcriptsData = {
  en: "Welcome back to Astrophysics 101. Today we are exploring the orbits of planetary bodies. The Moon rotates around the Earth in an elliptical orbit, which takes approximately 27.3 days. Gravity is the invisible force keeping all planets in check. As Newton calculated, the attraction is directly proportional to mass and inversely proportional to the square of the distance. As we move outer to the gas giants, Jovian systems like Jupiter command immense gravitational fields...",
  es: "Bienvenido de nuevo a Astrofísica 101. Hoy exploramos las órbitas de los cuerpos planetarios. La Luna gira alrededor de la Tierra en una órbita elíptica, lo que tarda aproximadamente 27.3 días. La gravedad es la fuerza invisible que mantiene a todos los planetas controlados. Como calculó Newton, la atracción es directamente proporcional a la masa e inversamente proporcional al cuadrado de la distancia. A medida que nos alejamos hacia los gigantes de gas...",
  hi: "एस्ट्रोफिजिक्स 101 में आपका स्वागत है। आज हम ग्रहों की कक्षाओं का अध्ययन कर रहे हैं। चंद्रमा लगभग 27.3 दिनों में एक अंडाकार कक्षा में पृथ्वी की परिक्रमा करता है। गुरुत्वाकर्षण वह अदृश्य शक्ति है जो सभी ग्रहों को अपनी स्थिति में रखती है। जैसा कि न्यूटन ने गणना की थी, आकर्षण सीधे द्रव्यमान के आनुपातिक होता है और दूरी के वर्ग के व्युत्क्रमानुपातिक होता है...",
  fr: "Bienvenue dans Astrophysique 101. Aujourd'hui, nous explorons les orbites des corps planétaires. La Lune tourne autour de la Terre sur une orbite elliptique en 27,3 jours environ. La gravité est la force invisible qui maintient les planètes en équilibre. Comme Newton l'a calculé, l'attraction est proportionnelle aux masses et inversement proportionnelle au carré de la distance...",
  ar: "مرحبًا بكم مجددًا في الفيزياء الفلكية ١٠١. نستكشف اليوم مدارات الأجرام الكوكبية. يدور القمر حول الأرض في مدار إهليلجي، ويستغرق حوالي ٢٧.٣ يومًا. الجاذبية هي القوة الخفية التي تبقي الكواكب في مداراتها. كما حسب نيوتن، فإن قوة الجذب تتناسب طرديًا مع الكتلة وعكسيًا مع مربع المسافة بينهما..."
};

const examQuestionsData = {
  en: [
    { q: "What is the orbital period of the Moon around the Earth?", options: ["24 Hours", "27.3 Days", "365 Days", "29.5 Days"], correct: 1 },
    { q: "Which law states planetary orbits are ellipses with the Sun at a focus?", options: ["Newton's Law", "Kepler's First Law", "Kepler's Second Law", "Galileo's Inertia"], correct: 1 },
    { q: "What is the boundary where escape velocity equals speed of light?", options: ["Roche Limit", "Event Horizon", "Accretion Disk", "Singularity"], correct: 1 },
    { q: "Which solar system planet has the strongest magnetosphere?", options: ["Earth", "Saturn", "Jupiter", "Neptune"], correct: 2 },
    { q: "What causes the tidal locking of the Moon to Earth?", options: ["Centrifugal Force", "Solar Winds", "Gravitational Tidal Forces", "Magnetic Dipole"], correct: 2 }
  ],
  es: [
    { q: "¿Cuál es el período orbital de la Luna al rededor de la Tierra?", options: ["24 Horas", "27.3 Días", "365 Días", "29.5 Días"], correct: 1 },
    { q: "¿Qué ley establece que las órbitas planetarias son elipses con el Sol en un foco?", options: ["Ley de Newton", "Primera Ley de Kepler", "Segunda Ley de Kepler", "Inercia de Galileo"], correct: 1 },
    { q: "¿Cuál es el límite donde la velocidad de escape es igual a la velocidad de la luz?", options: ["Límite de Roche", "Horizonte de Sucesos", "Disco de Acreción", "Singularidad"], correct: 1 },
    { q: "¿Qué planeta del sistema solar tiene la magnetosfera más fuerte?", options: ["Tierra", "Saturno", "Júpiter", "Neptuno"], correct: 2 },
    { q: "¿Qué causa el acoplamiento de marea de la Luna con la Tierra?", options: ["Fuerza Centrífuga", "Vientos Solares", "Fuerzas de Marea Gravitacionales", "Dipolo Magnético"], correct: 2 }
  ],
  hi: [
    { q: "पृथ्वी के चारों ओर चंद्रमा की कक्षीय अवधि कितनी है?", options: ["24 घंटे", "27.3 दिन", "365 दिन", "29.5 दिन"], correct: 1 },
    { q: "किस नियम के अनुसार ग्रहों की कक्षाएं अंडाकार होती हैं और सूर्य उनके एक फोकस पर होता है?", options: ["न्यूटन का नियम", "केपलर का पहला नियम", "केपलर का दूसरा नियम", "गैलिलियो का जड़त्व नियम"], correct: 1 },
    { q: "वह सीमा कौन सी है जहाँ पलायन वेग प्रकाश की गति के बराबर हो जाता है?", options: ["रोश सीमा", "घटना क्षितिज (Event Horizon)", "अक्रिशन डिस्क", "विलक्षणता (Singularity)"], correct: 1 },
    { q: "हमारे सौरमंडल के किस ग्रह का चुंबकीय क्षेत्र सबसे मजबूत है?", options: ["पृथ्वी", "शनि", "बृहस्पति (Jupiter)", "नेप्च्यून"], correct: 2 },
    { q: "चंद्रमा के पृथ्वी के साथ टाइडल लॉकिंग का क्या कारण है?", options: ["अपकेंद्री बल", "सौर हवाएं", "गुरुत्वाकर्षण ज्वारीय बल", "चुंबकीय द्विध्रुव"], correct: 2 }
  ],
  fr: [
    { q: "Quelle est la période orbitale de la Lune autour de la Terre ?", options: ["24 heures", "27,3 jours", "365 jours", "29,5 jours"], correct: 1 },
    { q: "Quelle loi stipule que les orbites planétaires sont des ellipses avec le Soleil à un foyer ?", options: ["Loi de Newton", "Première loi de Kepler", "Deuxième loi de Kepler", "Inertie de Galilée"], correct: 1 },
    { q: "Quelle est la limite où la vitesse de libération est égale à la vitesse de la lumière ?", options: ["Limite de Roche", "Horizon des événements", "Disque d'accrétion", "Singularité"], correct: 1 },
    { q: "Quelle planète a la magnétosphère la plus puissante ?", options: ["Terre", "Saturne", "Jupiter", "Neptune"], correct: 2 },
    { q: "Qu'est-ce qui cause le verrouillage gravitationnel de la Lune par la Terre ?", options: ["Force centrifuge", "Vents solaires", "Forces de marée gravitationnelles", "Dipôle magnétique"], correct: 2 }
  ],
  ar: [
    { q: "ما هي الفترة المدارية للقمر حول الأرض؟", options: ["٢٤ ساعة", "٢٧.٣ يوم", "٣٦٥ يوم", "٢٩.٥ يوم"], correct: 1 },
    { q: "أي قانون ينص على أن مدارات الكواكب إهليلجية وتكون الشمس في إحدى بؤرتيها؟", options: ["قانون نيوتن", "قانون كبلر الأول", "قانون كبلر الثاني", "عطالة غاليليو"], correct: 1 },
    { q: "ما هو الحد الفاصل الذي تتساوى عنده سرعة الإفلات مع سرعة الضوء؟", options: ["حد روش", "أفق الحدث", "قرص التنامي", "المتفردة"], correct: 1 },
    { q: "أي كواكب المجموعة الشمسية يمتلك أقوى غلاف مغناطيسي؟", options: ["الأرض", "زحل", "المشتري", "نبتون"], correct: 2 },
    { q: "ما الذي يسبب التقيد المدي (tidal locking) للقمر مع الأرض؟", options: ["القوة الطاردة المركزية", "الرياح الشمسية", "قوى المد والجزر الجاذبية", "ثنائي القطب المغناطيسي"], correct: 2 }
  ]
};

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState('en');

  // Load language preference from local storage if available
  useEffect(() => {
    const savedLang = localStorage.getItem('fuelup_lang');
    if (savedLang && langMap[savedLang]) {
      setCurrentLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('fuelup_lang', lang);
  };

  const t = langMap[currentLang] || langMap.en;

  useEffect(() => {
    const token = localStorage.getItem('fuelup_token');
    if (!token) {
      alert("Please sign in to access the Student Portal.");
      router.push('/login');
      return;
    }

    // Verify token with backend
    fetch('http://127.0.0.1:8000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error("Invalid token");
      return res.json();
    })
    .then(profile => {
      setUser(profile);
      setAuthLoading(false);
    })
    .catch(err => {
      console.warn("Backend auth failed. Using mock session for student dashboard.", err);
      setUser({ name: "Alex Carter", email: "student@fuelup.com", role: "student" });
      setAuthLoading(false);
    });
  }, [router]);

  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/tgbNymZ7vqY");
  const [videoTitle, setVideoTitle] = useState("The Solar System - Core Introduction");
  const [currentTab, setCurrentTab] = useState('overview');
  const [courseActive, setCourseActive] = useState(1);
  
  // Interactive Simulator States
  const [isRecording, setIsRecording] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("Not Marked");
  const [progress, setProgress] = useState(25); // Progress bar percentage
  
  // Flashcards States
  const [activeCard, setActiveCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState(new Set());
  
  // Exam States
  const [examActive, setExamActive] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [examTimeLeft, setExamTimeLeft] = useState(300); // 5 mins in seconds
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});
  const [examScore, setExamScore] = useState(null);
  const [certUnlocked, setCertUnlocked] = useState(false);
  const [certId, setCertId] = useState("");
  const timerRef = useRef(null);

  // Sync initial greeting based on selected language
  useEffect(() => {
    setChatMessages([
      { sender: "Teacher Amit", text: t.liveChatGreeting },
      { sender: "Student Rohit", text: currentLang === 'ar' ? "هل يقع حزام الكويكبات بين المريخ والمشتري؟" : "Is the asteroid belt located between Mars and Jupiter?" }
    ]);
  }, [currentLang, t.liveChatGreeting]);

  // Exam timer logic
  useEffect(() => {
    if (examActive && examTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setExamTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [examActive, examTimeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startExam = () => {
    setExamActive(true);
    setExamFinished(false);
    setExamAnswers({});
    setActiveQuestionIdx(0);
    setExamTimeLeft(300);
    setExamScore(null);
  };

  const handleSelectExamAnswer = (questionIdx, optIdx) => {
    setExamAnswers(prev => ({ ...prev, [questionIdx]: optIdx }));
  };

  const handleAutoSubmit = () => {
    submitExam();
  };

  const submitExam = () => {
    clearInterval(timerRef.current);
    setExamActive(false);
    setExamFinished(true);

    const questions = examQuestionsData[currentLang] || examQuestionsData.en;
    let score = 0;
    questions.forEach((q, idx) => {
      if (examAnswers[idx] === q.correct) {
        score += 1;
      }
    });

    setExamScore(score);
    const passPercentage = (score / questions.length) * 100;
    if (passPercentage >= 80) {
      setCertUnlocked(true);
      setCertId(`FE-ASTRO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      setProgress(100); // Fully complete course on passing
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const studentMsg = newMessage;
    setChatMessages(prev => [...prev, { sender: `${user ? user.name : 'You'} (Student)`, text: studentMsg }]);
    setNewMessage("");

    try {
      const token = localStorage.getItem('fuelup_token');
      const response = await fetch('http://127.0.0.1:8000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: studentMsg,
          lecture_title: videoTitle
        })
      });

      if (!response.ok) {
        throw new Error("Chat service failed");
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { sender: data.role || t.tutorName, text: data.reply }]);
    } catch (err) {
      console.warn("Tutor central network offline. Using localized fallback reply.", err);
      setChatMessages(prev => [...prev, { sender: `${t.tutorName} (Assistant)`, text: t.tutorReply }]);
    }
  };

  const handleMarkAttendance = () => {
    setAttendanceStatus(t.attendanceSuccess);
    setProgress(Math.min(progress + 20, 100)); // Increase progress on attendance check-in
  };

  const handlePlayLecture = (lecture) => {
    setVideoUrl(lecture.url);
    setVideoTitle(lecture.title);
  };

  const markFlashcardAsMastered = (idx) => {
    if (!masteredCards.has(idx)) {
      const updated = new Set(masteredCards);
      updated.add(idx);
      setMasteredCards(updated);
      setProgress(prev => Math.min(prev + 5, 100)); // Minor progress boost
    }
  };

  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank');
    const svgContent = document.getElementById('certificate-svg').outerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate of Achievement - FuelUp Education</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #0b0a1d; color: #fff; }
            svg { width: 100%; max-width: 900px; height: auto; }
          </style>
        </head>
        <body>
          ${svgContent}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Get active lists based on language
  const localizedSyllabus = courseContentTranslated[currentLang] || courseContentTranslated.en;
  const localizedFlashcards = flashcardsData[currentLang] || flashcardsData.en;
  const localizedFormulas = formulasData[currentLang] || formulasData.en;
  const localizedTranscript = transcriptsData[currentLang] || transcriptsData.en;
  const localizedExamQuestions = examQuestionsData[currentLang] || examQuestionsData.en;

  if (authLoading) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFF',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '4px solid rgba(255,255,255,0.05)',
            borderTopColor: 'var(--accent-orange)',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Verifying your credentials...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', direction: currentLang === 'ar' ? 'rtl' : 'ltr' }}>
      
      {/* Upper Navigation Bar */}
      <header style={{ 
        background: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft className={`w-5 h-5 ${currentLang === 'ar' ? 'rotate-180' : ''}`} />
              <span>{t.backToHome}</span>
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontWeight: 700, fontSize: '18px' }}>{t.welcome}, {user ? user.name : 'Student'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Language Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <Globe className="w-4 h-4 text-purple-500" />
              <select 
                value={currentLang} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="en" style={{ background: 'var(--bg-secondary)' }}>English (EN)</option>
                <option value="es" style={{ background: 'var(--bg-secondary)' }}>Español (ES)</option>
                <option value="hi" style={{ background: 'var(--bg-secondary)' }}>हिन्दी (HI)</option>
                <option value="fr" style={{ background: 'var(--bg-secondary)' }}>Français (FR)</option>
                <option value="ar" style={{ background: 'var(--bg-secondary)' }}>العربية (AR)</option>
              </select>
            </div>

            {/* Course Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: currentLang === 'ar' ? 'flex-start' : 'flex-end' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.courseProgress}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-orange)' }}>{progress}% {t.complete}</span>
              </div>
              <div style={{ width: '120px', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-orange), var(--accent-purple))', transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main style={{ flex: 1, padding: '24px', display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px' }} className="student-grid">
        
        {/* Left Side: Video Section & Tabs */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Lecture Heading */}
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{videoTitle}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Subject: Astrophysics 101 • Standard Curriculum</p>
            </div>
            
            {/* Live Rec / Screen options */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setIsRecording(!isRecording)} 
                className="btn btn-secondary" 
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '13px', 
                  borderColor: isRecording ? 'var(--accent-orange)' : 'var(--border-color)',
                  color: isRecording ? 'var(--accent-orange)' : 'var(--text-primary)'
                }}
              >
                {isRecording ? <Square className="w-4 h-4 text-orange-500 animate-pulse" /> : <Video className="w-4 h-4" />}
                <span>{isRecording ? t.recordingActive : t.lessonRecording}</span>
              </button>

              <button 
                onClick={() => setIsSharingScreen(!isSharingScreen)} 
                className="btn btn-secondary" 
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '13px',
                  borderColor: isSharingScreen ? 'var(--accent-cyan)' : 'var(--border-color)',
                  color: isSharingScreen ? 'var(--accent-cyan)' : 'var(--text-primary)'
                }}
              >
                <Monitor className="w-4 h-4" />
                <span>{isSharingScreen ? t.sharingActive : t.shareScreen}</span>
              </button>
            </div>
          </div>

          {/* Premium Video Player / Embed */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', height: '480px', position: 'relative' }}>
            <iframe 
              src={videoUrl} 
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Interactive Content Tabs */}
          <div className="card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
            {/* Tab navigation headers */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', overflowX: 'auto', gap: '8px' }} className="custom-scrollbar">
              {[
                { id: 'overview', label: t.overview, icon: <BookOpen className="w-4 h-4" /> },
                { id: 'modules', label: t.studyModules, icon: <FileText className="w-4 h-4" /> },
                { id: 'exams', label: t.examCenter, icon: <Award className="w-4 h-4" /> },
                { id: 'chat', label: t.liveChat, icon: <Bot className="w-4 h-4" /> },
                { id: 'attendance', label: t.attendance, icon: <Clock className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    background: 'none',
                    color: currentTab === tab.id ? 'var(--accent-orange)' : 'var(--text-secondary)',
                    borderBottom: currentTab === tab.id ? '2.5px solid var(--accent-orange)' : 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Views */}
            {currentTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.3s ease' }}>
                <h3 style={{ fontWeight: 700, fontSize: '18px' }}>{t.aboutLecture}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '15px' }}>{t.aboutDesc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }} className="overview-grid">
                  <div className="card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                    <h4 style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.estimatedTime}</h4>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '4px' }}>48 Mins</p>
                  </div>
                  <div className="card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                    <h4 style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.difficultyLevel}</h4>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-orange)', marginTop: '4px' }}>Intermediate</p>
                  </div>
                  <div className="card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)' }}>
                    <h4 style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI STUDY GUIDE</h4>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-purple)', marginTop: '4px', textDecoration: 'underline', cursor: 'pointer' }}>{t.downloadNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'modules' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="modules-inner-grid">
                  
                  {/* Left Column: Flashcards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RotateCcw className="w-4 h-4 text-purple-500" />
                        {t.flashcards}
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {t.masteredCount}: {masteredCards.size} / {localizedFlashcards.length}
                      </span>
                    </div>

                    {/* Interactive 3D Card */}
                    <div 
                      className={`flip-card ${flipped ? 'flipped' : ''}`}
                      onClick={() => setFlipped(!flipped)}
                    >
                      <div className="flip-card-inner">
                        {/* Front Side */}
                        <div className="flip-card-front">
                          <span className="badge badge-purple" style={{ fontSize: '10px', marginBottom: '12px' }}>TERM</span>
                          <h5 style={{ fontSize: '20px', fontWeight: 700 }}>{localizedFlashcards[activeCard]?.front}</h5>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>{t.cardFlipped}</p>
                        </div>
                        {/* Back Side */}
                        <div className="flip-card-back">
                          <span className="badge badge-orange" style={{ fontSize: '10px', marginBottom: '12px' }}>DEFINITION</span>
                          <p style={{ fontSize: '14px', lineHeight: 1.5, fontWeight: 500 }}>{localizedFlashcards[activeCard]?.back}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '8px 12px' }}
                          disabled={activeCard === 0}
                          onClick={() => { setFlipped(false); setActiveCard(prev => Math.max(0, prev - 1)); }}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>{t.previous}</span>
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '8px 12px' }}
                          disabled={activeCard === localizedFlashcards.length - 1}
                          onClick={() => { setFlipped(false); setActiveCard(prev => Math.min(localizedFlashcards.length - 1, prev + 1)); }}
                        >
                          <span>{t.next}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        className={`btn ${masteredCards.has(activeCard) ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          markFlashcardAsMastered(activeCard);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{masteredCards.has(activeCard) ? t.mastered : t.markMastered}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Key Equations */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Volume2 className="w-4 h-4 text-cyan-500" />
                      {t.formulas}
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto' }} className="custom-scrollbar">
                      {localizedFormulas.map((f, i) => (
                        <div key={i} className="card" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-orange)' }}>{f.name}</span>
                          <code style={{ fontSize: '14px', fontFamily: 'monospace', color: '#FFF', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>{f.eq}</code>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{f.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sub-section: Synced Transcript */}
                <div className="card" style={{ background: '#0F0E1F', padding: '16px 20px', border: '1px dashed var(--border-color)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-cyan)' }}>{t.transcript}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, fontStyle: 'italic' }}>"{localizedTranscript}"</p>
                </div>
              </div>
            )}

            {currentTab === 'exams' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
                
                {/* 1. Exam Not Started & Not Finished */}
                {!examActive && !examFinished && (
                  <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', display: 'grid', placeItems: 'center' }}>
                      <Award className="w-10 h-10 text-purple-500" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{t.certificateTitle}</h3>
                      <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '8px auto 0 auto', fontSize: '14px' }}>
                        Take the 5-question comprehensive planetary mechanics exam. Score 80% or higher to unlock your Gold-Standard Accredited Certificate.
                      </p>
                    </div>
                    <button className="btn btn-primary animate-glow" onClick={startExam} style={{ marginTop: '12px' }}>
                      <Play className="w-4 h-4" />
                      {t.startExam}
                    </button>
                  </div>
                )}

                {/* 2. Exam Active State */}
                {examActive && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <span className="badge badge-purple" style={{ fontSize: '12px' }}>
                        {t.question} {activeQuestionIdx + 1} of {localizedExamQuestions.length}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: examTimeLeft < 60 ? 'var(--accent-orange)' : 'var(--accent-cyan)' }}>
                        <Clock className={`w-4 h-4 ${examTimeLeft < 60 ? 'animate-pulse' : ''}`} />
                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '15px' }}>{t.examTimer}: {formatTime(examTimeLeft)}</span>
                      </div>
                    </div>

                    <div>
                      <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                        {localizedExamQuestions[activeQuestionIdx]?.q}
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {localizedExamQuestions[activeQuestionIdx]?.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectExamAnswer(activeQuestionIdx, optIdx)}
                            style={{
                              padding: '14px 20px',
                              border: '1px solid',
                              borderRadius: '8px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              background: examAnswers[activeQuestionIdx] === optIdx ? 'rgba(139,92,246,0.15)' : 'var(--bg-primary)',
                              borderColor: examAnswers[activeQuestionIdx] === optIdx ? 'var(--accent-purple)' : 'var(--border-color)',
                              color: '#FFF',
                              transition: 'all 0.2s',
                              fontSize: '14px',
                              fontWeight: 500
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary" 
                          disabled={activeQuestionIdx === 0}
                          onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>{t.previous}</span>
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          disabled={activeQuestionIdx === localizedExamQuestions.length - 1}
                          onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                        >
                          <span>{t.next}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <button className="btn btn-primary" onClick={submitExam}>
                        <CheckSquare className="w-4 h-4" />
                        {t.submitExam}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Exam Result & Certificate Unlock */}
                {examFinished && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '20px', fontWeight: 700 }}>{t.examResult}</h4>
                      <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-orange)', margin: '12px 0' }}>
                        {examScore} / {localizedExamQuestions.length} ({Math.round((examScore/localizedExamQuestions.length)*100)}%)
                      </p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                        {examScore >= 4 ? t.perfectScore : t.niceEffort}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
                        {examScore < 4 && (
                          <button className="btn btn-secondary" onClick={startExam}>
                            <RotateCcw className="w-4 h-4" />
                            <span>Retake Exam</span>
                          </button>
                        )}
                        {certUnlocked && (
                          <button className="btn btn-primary" onClick={handlePrintCertificate}>
                            <Printer className="w-4 h-4" />
                            {t.viewCert}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dynamic Certificate SVG Drawer (Only if Unlocked) */}
                    {certUnlocked && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          Certificate Unlocked & Ready
                        </h4>
                        
                        {/* Interactive Certificate Viewport */}
                        <div style={{ width: '100%', maxWidth: '650px', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                          <svg id="certificate-svg" viewBox="0 0 800 600" width="100%" style={{ backgroundColor: '#0b0a1d', display: 'block', border: '4px solid #d4af37' }}>
                            <rect x="20" y="20" width="760" height="560" fill="none" stroke="#d4af37" strokeWidth="2" opacity="0.6"/>
                            <rect x="25" y="25" width="750" height="550" fill="none" stroke="#d4af37" strokeWidth="1" strokeDasharray="10 5" opacity="0.4"/>
                            
                            <path d="M 20 50 L 50 20 M 20 70 L 70 20" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.7"/>
                            <path d="M 780 50 L 750 20 M 780 70 L 730 20" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.7"/>
                            <path d="M 20 550 L 50 580 M 20 530 L 70 580" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.7"/>
                            <path d="M 780 550 L 750 580 M 780 530 L 730 580" stroke="#d4af37" strokeWidth="2" fill="none" opacity="0.7"/>
                            
                            <circle cx="400" cy="300" r="220" fill="url(#gold-glow)" opacity="0.15"/>
                            
                            <defs>
                              <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="100%" stopColor="#0b0a1d" stopOpacity="0" />
                              </radialGradient>
                              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#BF953F" />
                                <stop offset="25%" stopColor="#FCF6BA" />
                                <stop offset="50%" stopColor="#B38728" />
                                <stop offset="75%" stopColor="#FBF5B7" />
                                <stop offset="100%" stopColor="#AA771C" />
                              </linearGradient>
                            </defs>

                            <text x="400" y="90" textAnchor="middle" fill="url(#gold-gradient)" fontSize="26" fontWeight="800" letterSpacing="4">FUELUP EDUCATION</text>
                            <text x="400" y="115" textAnchor="middle" fill="#94A3B8" fontSize="11" letterSpacing="6">WORLD-CLASS EDUCATION HUB</text>
                            <line x1="280" y1="130" x2="520" y2="130" stroke="url(#gold-gradient)" strokeWidth="1.5" opacity="0.5"/>
                            
                            <text x="400" y="195" textAnchor="middle" fill="#F8FAFC" fontSize="34" fontWeight="700">{t.passingCert.toUpperCase()}</text>
                            <text x="400" y="230" textAnchor="middle" fill="#94A3B8" fontSize="15" fontStyle="italic">This certificate is awarded to</text>
                            
                            <text x="400" y="295" textAnchor="middle" fill="url(#gold-gradient)" fontSize="40" fontWeight="800">{user ? user.name : 'Alex Carter'}</text>
                            <line x1="220" y1="310" x2="580" y2="310" stroke="#94A3B8" strokeWidth="1" opacity="0.3"/>
                            
                            <text x="400" y="350" textAnchor="middle" fill="#F8FAFC" fontSize="15">{t.certificateDesc}</text>
                            <text x="400" y="385" textAnchor="middle" fill="url(#gold-gradient)" fontSize="20" fontWeight="700">{t.certificateTitle}</text>
                            <text x="400" y="415" textAnchor="middle" fill="#94A3B8" fontSize="13">Astrophysics Module I & II • Completed with Distinction</text>
                            
                            <text x="180" y="485" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="600">DATE</text>
                            <text x="180" y="510" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="700">May 30, 2026</text>
                            <line x1="110" y1="495" x2="250" y2="495" stroke="#94A3B8" strokeWidth="0.5" opacity="0.3"/>
                            
                            <text x="620" y="485" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="600">{t.certificateVerification}</text>
                            <text x="620" y="510" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontFamily="monospace" fontWeight="700">{certId || "FE-ASTRO-9029X"}</text>
                            <line x1="550" y1="495" x2="690" y2="495" stroke="#94A3B8" strokeWidth="0.5" opacity="0.3"/>
                            
                            <g transform="translate(365, 460)">
                              <path d="M 40 0 L 47 18 L 65 9 L 58 27 L 76 27 L 58 37 L 69 52 L 50 49 L 45 67 L 35 52 L 21 61 L 22 43 L 4 38 L 20 30 L 11 14 L 28 17 Z" fill="#D4AF37" transform="scale(0.8) translate(5, 5)" opacity="0.95"/>
                              <circle cx="40" cy="40" r="26" fill="#CF9E2E" stroke="#FCF6BA" strokeWidth="1.5"/>
                              <text x="40" y="44" textAnchor="middle" fill="#0b0a1d" fontSize="9" fontWeight="800">GOLD</text>
                            </g>
                          </svg>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

            {currentTab === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '300px', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', paddingRight: '8px' }} className="custom-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div key={i} style={{ 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      background: msg.sender.includes("You") || msg.sender.includes(user?.name || "Student") ? 'rgba(255,106,61,0.1)' : 'rgba(255,255,255,0.03)',
                      alignSelf: msg.sender.includes("You") || msg.sender.includes(user?.name || "Student") ? 'flex-end' : 'flex-start',
                      maxWidth: '80%'
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: msg.sender.includes("Teacher") ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>{msg.sender}</span>
                      <p style={{ fontSize: '13px', marginTop: '2px' }}>{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder={t.askTutorPlaceholder}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      color: '#FFF',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {currentTab === 'attendance' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Interactive Check-in</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Confirm your active attention to register class credits.</p>
                </div>

                <div style={{ 
                  padding: '12px 24px', 
                  borderRadius: '8px', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span style={{ fontWeight: 600 }}>Status: <span style={{ color: attendanceStatus.includes("Successfully") || attendanceStatus.includes("सफलतापूर्वक") || attendanceStatus.includes("validée") || attendanceStatus.includes("بنجاح") ? 'var(--accent-green)' : 'var(--accent-orange)' }}>{attendanceStatus}</span></span>
                </div>

                {attendanceStatus === "Not Marked" && (
                  <button onClick={handleMarkAttendance} className="btn btn-primary">
                    {t.markAttendance}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Course Curriculum Accordion */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen className="w-5 h-5 text-purple-500" />
              {t.courseSyllabus}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {localizedSyllabus.map((section) => (
                <details 
                  key={section.id} 
                  open={section.id === courseActive}
                  onToggle={() => setCourseActive(section.id)}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.01)'
                  }}
                >
                  <summary style={{
                    padding: '12px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)'
                  }}>
                    <span>{section.sectionTitle}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{section.duration}</span>
                  </summary>

                  <div style={{ padding: '8px 0', backgroundColor: 'transparent' }}>
                    {section.lectures.map((lec, idx) => (
                      <div
                        key={idx}
                        onClick={() => handlePlayLecture(lec)}
                        style={{
                          padding: '10px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          borderBottom: idx < section.lectures.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                          background: videoUrl === lec.url ? 'rgba(255,106,61,0.05)' : 'transparent',
                          transition: 'background 0.2s',
                          textAlign: currentLang === 'ar' ? 'right' : 'left'
                        }}
                        className="lecture-item"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Play className={`w-4 h-4 ${videoUrl === lec.url ? 'text-orange-500' : 'text-text-muted'}`} />
                          <span style={{ fontSize: '13px', color: videoUrl === lec.url ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{lec.title}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lec.duration}</span>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Quick AI recommendation widget */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(255,106,61,0.05))', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot className="w-5 h-5 text-orange-500 animate-bounce" />
              {t.aiRecommendation}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.4, marginTop: '8px' }}>
              "{t.recommendationMsg}"
            </p>
          </div>
        </section>
      </main>

      <style jsx>{`
        .lecture-item:hover {
          background: rgba(255,106,61,0.03) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

