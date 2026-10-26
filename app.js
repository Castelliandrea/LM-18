const coursesEl = document.getElementById("courses");
const searchEl = document.getElementById("search");

const sectionLabels = {
  lezioni: "Lezioni",
  appunti: "Appunti",
  simulazioni: "Simulazioni",
  extra: "Extra"
};

const sectionIcons = {
  lezioni: "🎓",
  appunti: "📝",
  simulazioni: "✍️",
  extra: "📎"
};

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

function iconFor(type) {
  const value = normalize(type);

  if (value.includes("pdf")) return "📄";
  if (value.includes("doc")) return "📝";
  if (value.includes("ppt")) return "📊";
  if (value.includes("notebook")) return "🐍";
  if (value.includes("link")) return "🔗";
  if (value.includes("video")) return "🎬";
  if (value.includes("codice")) return "💻";

  return "📁";
}

function metadataMatches(course, query) {
  return normalize([
    course.name,
    course.professor,
    course.semester,
    course.cfu != null ? `${course.cfu} CFU` : ""
  ].join(" ")).includes(query);
}

function fileMatches(file, query) {
  return normalize(
    `${file.title ?? ""} ${file.type ?? ""}`
  ).includes(query);
}

function courseMatchesQuery(course, query, yearName) {
  if (
    !query ||
    normalize(yearName).includes(query) ||
    metadataMatches(course, query)
  ) {
    return true;
  }

  return Object.entries(sectionLabels).some(([key, label]) => {
    const files = course.sections?.[key] ?? [];

    return (
      normalize(label).includes(query) ||
      files.some(file => fileMatches(file, query))
    );
  });
}

function createFileLink(file) {
  const link = makeElement("a", "file");

  const url = new URL(file.file, document.baseURI);

  if (!["http:", "https:"].includes(url.protocol)) {
    return makeElement(
      "p",
      "category-empty",
      "Collegamento non valido."
    );
  }

  link.href = url.href;

  const external = url.origin !== window.location.origin;

  if (external) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  link.append(
    makeElement(
      "span",
      "file-title",
      `${iconFor(file.type ?? "")} ${file.title}`
    ),
    makeElement("span", "file-type", file.type ?? "File")
  );

  return link;
}

function createCourseCard(course, query, yearName) {
  const card = makeElement("article", "course");
  card.style.setProperty("--course-color", course.color || "#6ea8fe");

  // Copertina: icona sempre presente, immagine facoltativa.
  const cover = makeElement("div", "course-cover");
  cover.setAttribute("aria-hidden", "true");

  cover.append(
    makeElement("span", "course-icon", course.icon || "📚")
  );

  if (course.image) {
    const image = document.createElement("img");
    image.src = course.image;
    image.alt = "";
    image.loading = "lazy";

    image.addEventListener("error", () => image.remove());

    cover.appendChild(image);
  }

  const sections = course.sections ?? {};

  const totalFiles = Object.keys(sectionLabels).reduce(
    (total, key) => total + (sections[key]?.length ?? 0),
    0
  );

  cover.appendChild(
    makeElement(
      "span",
      "material-count",
      `${totalFiles} ${totalFiles === 1 ? "materiale" : "materiali"}`
    )
  );

  const body = makeElement("div", "course-body");

  body.appendChild(makeElement("h3", "", course.name));

  body.appendChild(
    makeElement(
      "p",
      "course-professor",
      `Docente: ${course.professor || "Da inserire"}`
    )
  );

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

  body.appendChild(metadata);

  const showAll =
    !query ||
    normalize(yearName).includes(query) ||
    metadataMatches(course, query);

  const categories = makeElement("div", "course-categories");

  Object.entries(sectionLabels).forEach(([key, label]) => {
    const files = sections[key] ?? [];
    const categoryMatches = normalize(label).includes(query);

    const visibleFiles =
      showAll || categoryMatches
        ? files
        : files.filter(file => fileMatches(file, query));

    if (!showAll && !categoryMatches && visibleFiles.length === 0) {
      return;
    }

    const details = makeElement("details", "category");

    // Durante una ricerca, apre le sezioni con risultati.
    details.open = Boolean(query) && visibleFiles.length > 0;

    const summary = document.createElement("summary");

    summary.append(
      makeElement(
        "span",
        "category-label",
        `${sectionIcons[key]} ${label}`
      ),
      makeElement(
        "span",
        "category-count",
        String(visibleFiles.length)
      )
    );

    details.appendChild(summary);

    if (visibleFiles.length > 0) {
      const list = makeElement("div", "files category-files");

      visibleFiles.forEach(file => {
        list.appendChild(createFileLink(file));
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

    categories.appendChild(details);
  });

  body.appendChild(categories);
  card.append(cover, body);

  return card;
}

function render(query = "") {
  const normalizedQuery = normalize(query.trim());

  coursesEl.replaceChildren();

  let totalCourses = 0;

  years.forEach(yearData => {
    const matchingCourses = yearData.courses.filter(course =>
      courseMatchesQuery(course, normalizedQuery, yearData.year)
    );

    if (matchingCourses.length === 0) {
      return;
    }

    totalCourses += matchingCourses.length;

    const yearSection = makeElement("section", "year");
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
      grid.appendChild(
        createCourseCard(course, normalizedQuery, yearData.year)
      );
    });

    yearSection.append(header, grid);
    coursesEl.appendChild(yearSection);
  });

  if (totalCourses === 0) {
    coursesEl.appendChild(
      makeElement(
        "p",
        "empty",
        "Nessun risultato trovato. Prova un’altra ricerca."
      )
    );
  }
}

searchEl.addEventListener("input", event => {
  render(event.target.value);
});

render();