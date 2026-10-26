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
        professor: "Valerio Freschi",
        cfu: 9,
        semester: "Primo semestre",
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
        professor: "Lorenzo Calisti",
        cfu: 6,
        semester: "Primo semestre",
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
        professor: "Benedetta Brilli",
        cfu: 4,
        semester: "Primo Semestre",
        color: "#f59e0b",
        folder: "materiali/primo-anno/lingua-inglese-b2",

        sections: {
          lezioni: [],
          appunti: [],
          simulazioni: [],
          extra: []
        }
      },

    ]
  }
];