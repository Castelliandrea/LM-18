// ARCHIVIO APPUNTI LM-18
//
// Questo è il file da modificare per:
// - aggiungere o eliminare materie;
// - inserire docente, CFU e semestre;
// - aggiungere materiali nelle quattro categorie.
//
// cfu: null indica un valore ancora da compilare.
// Per esempio, quando conosci il valore:
// cfu: 9
//
// I percorsi nel campo "file" sono relativi alla root del sito.
// Il campo "folder" è solo un riferimento organizzativo:
// NON viene aggiunto automaticamente ai percorsi dei materiali.
//
// Esempio di materiale:
//
// {
//   title: "Lezione 01 — Introduzione",
//   type: "PDF",
//   file: "materiali/primo-anno/machine-learning/lezioni/lezione-01.pdf"
// }
//
// Esempio di link:
//
// {
//   title: "Pagina del corso",
//   type: "Link",
//   file: "https://example.com"
// }

const years = [
  {
    year: "Primo anno",

    courses: [
      {
        name: "Machine Learning",
        professor: "Da inserire",
        cfu: null,
        semester: "Semestre da inserire",
        color: "#8b5cf6",
        folder: "materiali/primo-anno/machine-learning",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Programmazione di Dispositivi Mobili e Interfacce Utente",
        professor: "Da inserire",
        cfu: null,
        semester: "Semestre da inserire",
        color: "#0ea5e9",
        folder: "materiali/primo-anno/programmazione-dispositivi-mobili",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Lingua Inglese B2",
        professor: "Da inserire",
        cfu: null,
        semester: "Semestre da inserire",
        color: "#f59e0b",
        folder: "materiali/primo-anno/lingua-inglese-b2",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Sicurezza Informatica",
        professor: "Da inserire",
        cfu: null,
        semester: "Semestre da inserire",
        color: "#ef4444",
        folder: "materiali/primo-anno/sicurezza-informatica",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Sistemi Distribuiti e Decentralizzati",
        professor: "Da inserire",
        cfu: null,
        semester: "Semestre da inserire",
        color: "#14b8a6",
        folder: "materiali/primo-anno/sistemi-distribuiti-e-decentralizzati",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Metodi Numerici per l’Algebra Lineare e l’Analisi Funzionale",
        professor: "Da inserire",
        cfu: null,
        semester: "Semestre da inserire",
        color: "#6366f1",
        folder: "materiali/primo-anno/metodi-numerici",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Principi di Intelligenza Artificiale",
        professor: "Da inserire",
        cfu: null,
        semester: "Semestre da inserire",
        color: "#d946ef",
        folder: "materiali/primo-anno/principi-intelligenza-artificiale",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      }
    ]
  },

  {
    year: "Secondo anno",

    // Materie iniziali modificabili:
    // mantieni solo gli insegnamenti del tuo piano personale.
    courses: [
      {
        name: "Applicazioni Distribuite e Cloud Computing",
        professor: "Da inserire",
        cfu: null,
        semester: "Da inserire · insegnamento a scelta",
        color: "#0284c7",
        folder: "materiali/secondo-anno/applicazioni-distribuite-cloud",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Elaborazione dei Dati Sperimentali",
        professor: "Da inserire",
        cfu: null,
        semester: "Da inserire · insegnamento a scelta",
        color: "#10b981",
        folder: "materiali/secondo-anno/elaborazione-dati-sperimentali",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Programmazione per l’Internet of Things",
        professor: "Da inserire",
        cfu: null,
        semester: "Da inserire · insegnamento a scelta",
        color: "#f97316",
        folder: "materiali/secondo-anno/programmazione-iot",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Deep Learning",
        professor: "Da inserire",
        cfu: null,
        semester: "Da inserire · insegnamento a scelta",
        color: "#a855f7",
        folder: "materiali/secondo-anno/deep-learning",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

      {
        name: "Tesi",
        professor: "Relatore da inserire",
        cfu: null,
        semester: "Prova finale",
        color: "#475569",
        folder: "materiali/secondo-anno/tesi",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      }
    ]
  }
];