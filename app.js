const coursesEl = document.getElementById("courses");
const searchEl = document.getElementById("search");
const heroEl = document.querySelector(".hero");

const sectionLabels = {
  lezioni: "Lezioni",
  appunti: "Appunti",
  simulazioni: "Simulazioni",
  extra: "Extra"
};

const defaultTitle = document.title;

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

function getCourseSections(course) {
  return course.sections ?? {};
}

function countMaterials(course) {
  const sections = getCourseSections(course);

  return Object.keys(sectionLabels).reduce(
    (total, key) => total + (sections[key]?.length ?? 0),
    0
  );
}

function createMetadata(course) {
  const metadata = makeElement("div", "course-metadata");

  metadata.append(
    makeElement(
      "span",
      "metadata-badge",
      course.cfu != null ? `${course.cfu} CFU` : "CFU da inserire"
    ),
    makeElement(
      "span",
      "metadata-badge",
      course.semester || "Semestre da inserire"
    )
  );

  return metadata;
}

function safeUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const url = new URL(value, document.baseURI);

    return ["http:", "https:"].includes(url.protocol)
      ? url
      : null;
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
    makeElement("span", "file-title", file.title || "Materiale"),
    makeElement("span", "file-type", file.type || "File")
  );

  return link;
}

function matchesCourse(course, yearName, query) {
  if (!query) {
    return true;
  }

  // Nella home si cercano solo le informazioni dei corsi.
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
  card.style.setProperty("--course-color", course.color || "#6ea8fe");

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
    makeElement("span", "course-open", "Apri il corso →")
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
    const courses = yearData.courses.filter(course =>
      matchesCourse(course, yearData.year, query)
    );

    if (courses.length === 0) {
      return;
    }

    total += courses.length;

    const section = makeElement("section", "year");
    const header = makeElement("div", "year-header");

    header.append(
      makeElement("h2", "", yearData.year),
      makeElement(
        "span",
        "",
        `${courses.length} ${courses.length === 1 ? "materia" : "materie"}`
      )
    );

    const grid = makeElement("div", "courses-grid");

    courses.forEach(course => {
      grid.appendChild(createCourseCard(course));
    });

    section.append(header, grid);
    coursesEl.appendChild(section);
  });

  if (total === 0) {
    coursesEl.appendChild(
      makeElement("p", "empty", "Nessun corso trovato.")
    );
  }
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

function renderCourse(course, yearName) {
  document.title = `${course.name} · Appunti LM-18`;

  if (heroEl) {
    heroEl.hidden = true;
  }

  coursesEl.replaceChildren();

  const page = makeElement("article", "course-page");
  page.style.setProperty("--course-color", course.color || "#6ea8fe");

  const back = makeElement(
    "a",
    "back-link",
    "← Tutti gli esami"
  );

  back.href = "#";

  const intro = makeElement("div", "course-detail-intro");

  // Pannello decorativo: solo colore e testo, nessuna immagine.
  const cover = makeElement("div", "course-detail-cover");

  cover.append(
    makeElement("span", "detail-cover-label", "LM-18 · Urbino"),
    makeElement("span", "detail-cover-name", course.name),
    makeElement(
      "span",
      "detail-cover-count",
      `${countMaterials(course)} materiali disponibili`
    )
  );

  const information = makeElement("div", "course-information");

  const title = makeElement("h1", "course-detail-title", course.name);
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
      makeElement("p", "course-description", course.description)
    );
  }

  const usefulLinks = createUsefulLinks(course);

  if (usefulLinks.childElementCount > 0) {
    information.appendChild(usefulLinks);
  }

  intro.append(cover, information);

  const resources = makeElement("section", "course-resources");

  resources.appendChild(
    makeElement("h2", "resources-title", "Materiali del corso")
  );

  const sections = getCourseSections(course);

  Object.entries(sectionLabels).forEach(([key, label]) => {
    const files = sections[key] ?? [];

    const details = makeElement("details", "resource-section");

    // Le categorie con contenuti sono aperte inizialmente.
    details.open = files.length > 0;

    const summary = document.createElement("summary");

    summary.append(
      makeElement("span", "resource-name", label),
      makeElement("span", "category-count", String(files.length))
    );

    details.appendChild(summary);

    if (files.length > 0) {
      const list = makeElement("div", "files resource-files");

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

  page.append(back, intro, resources);
  coursesEl.appendChild(page);

  title.focus({ preventScroll: true });
}

function renderNotFound() {
  document.title = "Corso non trovato · Appunti LM-18";

  if (heroEl) {
    heroEl.hidden = true;
  }

  coursesEl.replaceChildren();

  const wrapper = makeElement("div", "course-page");

  const back = makeElement("a", "back-link", "← Tutti gli esami");
  back.href = "#";

  wrapper.append(
    back,
    makeElement("h1", "course-detail-title", "Corso non trovato"),
    makeElement(
      "p",
      "course-description",
      "Il collegamento potrebbe essere cambiato."
    )
  );

  coursesEl.appendChild(wrapper);
}

function renderRoute() {
  const params = new URLSearchParams(window.location.hash.slice(1));
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

searchEl.placeholder = "Cerca esame, docente o semestre…";
searchEl.setAttribute("aria-label", "Cerca tra i corsi");

searchEl.addEventListener("input", () => {
  if (!new URLSearchParams(location.hash.slice(1)).has("corso")) {
    renderHome();
  }
});

window.addEventListener("hashchange", () => {
  renderRoute();
  window.scrollTo({ top: 0, behavior: "instant" });
});

renderRoute();