const coursesEl = document.getElementById("courses");
const searchEl = document.getElementById("search");
const heroEl = document.querySelector(".hero");

const defaultTitle = document.title;

// --------------------------------------------------
// FUNZIONI GENERALI
// --------------------------------------------------

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function courseId(course) {
  return course.folder;
}

function courseUrl(course) {
  return `#corso=${encodeURIComponent(courseId(course))}`;
}

// --------------------------------------------------
// SEZIONI PERSONALIZZATE
// --------------------------------------------------

function getCourseSections(course) {
  const sections = course.sections;

  // Formato attuale: elenco di sezioni personalizzate.
  if (Array.isArray(sections)) {
    return sections.map(section => ({
      id: section.id,
      title: section.title || section.id || "Materiali",
      files: Array.isArray(section.files) ? section.files : []
    }));
  }

  // Compatibilità con il vecchio formato a categorie fisse.
  const oldLabels = {
    lezioni: "Lezioni",
    appunti: "Appunti",
    simulazioni: "Simulazioni",
    extra: "Extra"
  };

  return Object.entries(sections ?? {}).map(([key, files]) => ({
    id: key,
    title: oldLabels[key] || key,
    files: Array.isArray(files) ? files : []
  }));
}

function countMaterials(course) {
  return getCourseSections(course).reduce(
    (total, section) => total + section.files.length,
    0
  );
}

// --------------------------------------------------
// INFORMAZIONI DEL CORSO
// --------------------------------------------------

function createMetadata(course) {
  const metadata = makeElement("div", "course-metadata");

  metadata.append(
    makeElement(
      "span",
      "metadata-badge",
      course.cfu != null
        ? `${course.cfu} CFU`
        : "CFU da inserire"
    ),
    makeElement(
      "span",
      "metadata-badge",
      course.semester || "Semestre da inserire"
    )
  );

  return metadata;
}

// --------------------------------------------------
// COLLEGAMENTI E MATERIALI
// --------------------------------------------------

function safeUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const url = new URL(value.trim(), document.baseURI);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function configureLink(link, url) {
  link.href = url.href;

  if (url.origin !== window.location.origin) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
}

function createMaterialLink(file) {
  const url = safeUrl(file.file);

  if (!url) {
    return makeElement(
      "p",
      "category-empty",
      `${file.title || "Materiale"}: collegamento non valido.`
    );
  }

  const link = makeElement("a", "file");

  configureLink(link, url);

  link.append(
    makeElement(
      "span",
      "file-title",
      file.title || "Materiale"
    ),
    makeElement(
      "span",
      "file-type",
      file.type || "File"
    )
  );

  return link;
}

function createUsefulLinks(course) {
  const container = makeElement("div", "course-useful-links");

  (course.links ?? []).forEach(item => {
    const url = safeUrl(item.url);

    if (!url) {
      return;
    }

    const link = makeElement(
      "a",
      "useful-link",
      item.title || "Collegamento"
    );

    configureLink(link, url);

    container.appendChild(link);
  });

  return container;
}

// --------------------------------------------------
// HOME: RICERCA E SCHEDE
// --------------------------------------------------

function matchesCourse(course, yearName, query) {
  if (!query) {
    return true;
  }

  // La ricerca della home riguarda le informazioni di base.
  const text = [
    yearName,
    course.name,
    course.professor,
    course.semester,
    course.cfu != null ? `${course.cfu} CFU` : ""
  ].join(" ");

  return normalize(text).includes(query);
}

function createCourseCard(course) {
  const card = makeElement("a", "course course-preview");

  card.href = courseUrl(course);

  card.style.setProperty(
    "--course-color",
    course.color || "#6ea8fe"
  );

  // Copertina solo colorata: nessuna immagine o icona.
  const cover = makeElement("div", "course-cover");
  cover.setAttribute("aria-hidden", "true");

  const body = makeElement("div", "course-body");

  body.append(
    makeElement("h3", "", course.name),
    makeElement(
      "p",
      "course-professor",
      `Docente: ${course.professor || "Da inserire"}`
    ),
    createMetadata(course),
    makeElement(
      "span",
      "course-open",
      "Apri il corso →"
    )
  );

  card.append(cover, body);

  return card;
}

function renderHome() {
  document.title = defaultTitle;

  if (heroEl) {
    heroEl.hidden = false;
  }

  const query = normalize(searchEl.value.trim());

  coursesEl.replaceChildren();

  let total = 0;

  years.forEach(yearData => {
    const matchingCourses = yearData.courses.filter(course =>
      matchesCourse(course, yearData.year, query)
    );

    if (matchingCourses.length === 0) {
      return;
    }

    total += matchingCourses.length;

    const section = makeElement("section", "year");
    const header = makeElement("div", "year-header");

    header.append(
      makeElement("h2", "", yearData.year),
      makeElement(
        "span",
        "",
        `${matchingCourses.length} ${
          matchingCourses.length === 1 ? "materia" : "materie"
        }`
      )
    );

    const grid = makeElement("div", "courses-grid");

    matchingCourses.forEach(course => {
      grid.appendChild(createCourseCard(course));
    });

    section.append(header, grid);

    coursesEl.appendChild(section);
  });

  if (total === 0) {
    coursesEl.appendChild(
      makeElement(
        "p",
        "empty",
        "Nessun corso trovato."
      )
    );
  }
}

// --------------------------------------------------
// PAGINA DEL CORSO
// --------------------------------------------------

function renderCourse(course, yearName) {
  document.title = `${course.name} · Appunti LM-18`;

  if (heroEl) {
    heroEl.hidden = true;
  }

  coursesEl.replaceChildren();

  const page = makeElement("article", "course-page");

  page.style.setProperty(
    "--course-color",
    course.color || "#6ea8fe"
  );

  const back = makeElement(
    "a",
    "back-link",
    "← Tutti gli esami"
  );

  back.href = "#";

  const intro = makeElement("div", "course-detail-intro");

  // Copertina colorata della pagina del corso.
  const cover = makeElement("div", "course-detail-cover");

  const totalMaterials = countMaterials(course);

  cover.append(
    makeElement(
      "span",
      "detail-cover-label",
      "LM-18 · Urbino"
    ),
    makeElement(
      "span",
      "detail-cover-name",
      course.name
    ),
    makeElement(
      "span",
      "detail-cover-count",
      `${totalMaterials} ${
        totalMaterials === 1
          ? "materiale disponibile"
          : "materiali disponibili"
      }`
    )
  );

  const information = makeElement(
    "div",
    "course-information"
  );

  const title = makeElement(
    "h1",
    "course-detail-title",
    course.name
  );

  title.tabIndex = -1;

  information.append(
    makeElement("p", "eyebrow", yearName),
    title,
    makeElement(
      "p",
      "course-professor",
      `Docente: ${course.professor || "Da inserire"}`
    ),
    createMetadata(course)
  );

  if (course.description?.trim()) {
    information.appendChild(
      makeElement(
        "p",
        "course-description",
        course.description
      )
    );
  }

  const usefulLinks = createUsefulLinks(course);

  if (usefulLinks.childElementCount > 0) {
    information.appendChild(usefulLinks);
  }

  intro.append(cover, information);

  const resources = makeElement(
    "section",
    "course-resources"
  );

  resources.appendChild(
    makeElement(
      "h2",
      "resources-title",
      "Materiali del corso"
    )
  );

  const sections = getCourseSections(course);

  sections.forEach(section => {
    const files = section.files;

    const details = makeElement(
      "details",
      "resource-section"
    );

    // Le sezioni con materiali sono aperte inizialmente.
    details.open = files.length > 0;

    const summary = document.createElement("summary");

    summary.append(
      makeElement(
        "span",
        "resource-name",
        section.title
      ),
      makeElement(
        "span",
        "category-count",
        String(files.length)
      )
    );

    details.appendChild(summary);

    if (files.length > 0) {
      const list = makeElement(
        "div",
        "files resource-files"
      );

      files.forEach(file => {
        list.appendChild(createMaterialLink(file));
      });

      details.appendChild(list);
    } else {
      details.appendChild(
        makeElement(
          "p",
          "category-empty",
          "Nessun materiale caricato per ora."
        )
      );
    }

    resources.appendChild(details);
  });

  if (sections.length === 0) {
    resources.appendChild(
      makeElement(
        "p",
        "category-empty",
        "Le sezioni di questo corso non sono ancora state aggiunte."
      )
    );
  }

  page.append(back, intro, resources);

  coursesEl.appendChild(page);

  title.focus({ preventScroll: true });
}

// --------------------------------------------------
// PAGINA NON TROVATA
// --------------------------------------------------

function renderNotFound() {
  document.title = "Corso non trovato · Appunti LM-18";

  if (heroEl) {
    heroEl.hidden = true;
  }

  coursesEl.replaceChildren();

  const wrapper = makeElement("div", "course-page");

  const back = makeElement(
    "a",
    "back-link",
    "← Tutti gli esami"
  );

  back.href = "#";

  wrapper.append(
    back,
    makeElement(
      "h1",
      "course-detail-title",
      "Corso non trovato"
    ),
    makeElement(
      "p",
      "course-description",
      "Il collegamento potrebbe essere cambiato."
    )
  );

  coursesEl.appendChild(wrapper);
}

// --------------------------------------------------
// NAVIGAZIONE
// --------------------------------------------------

function renderRoute() {
  const params = new URLSearchParams(
    window.location.hash.slice(1)
  );

  const requestedId = params.get("corso");

  if (requestedId === null) {
    renderHome();
    return;
  }

  for (const yearData of years) {
    const course = yearData.courses.find(
      item => courseId(item) === requestedId
    );

    if (course) {
      renderCourse(course, yearData.year);
      return;
    }
  }

  renderNotFound();
}

// --------------------------------------------------
// EVENTI E AVVIO
// --------------------------------------------------

searchEl.placeholder = "Cerca esame, docente o semestre…";

searchEl.setAttribute(
  "aria-label",
  "Cerca tra i corsi"
);

searchEl.addEventListener("input", () => {
  const params = new URLSearchParams(
    window.location.hash.slice(1)
  );

  if (!params.has("corso")) {
    renderHome();
  }
});

window.addEventListener("hashchange", () => {
  renderRoute();

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
});

renderRoute();