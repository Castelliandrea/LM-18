const coursesEl = document.getElementById("courses");
const searchEl = document.getElementById("search");

const sectionLabels = {
  lezioni: "Lezioni",
  appunti: "Appunti",
  simulazioni: "Simulazioni",
  extra: "Extra"
};

function iconFor(type) {
  const value = type.toLowerCase();

  if (value.includes("pdf")) return "📄";
  if (value.includes("doc")) return "📝";
  if (value.includes("ppt")) return "📊";
  if (value.includes("notebook")) return "🐍";
  if (value.includes("link")) return "🔗";
  if (value.includes("video")) return "🎬";
  if (value.includes("codice")) return "💻";

  return "📁";
}

function createFileLink(file) {
  const isExternal = file.file.startsWith("http");

  const link = document.createElement("a");
  link.className = "file";
  link.href = file.file;
  link.target = isExternal ? "_blank" : "_self";
  link.rel = "noopener";

  link.innerHTML = `
    <span class="file-title">
      ${iconFor(file.type)} ${file.title}
    </span>
    <span class="file-type">${file.type}</span>
  `;

  return link;
}

function courseMatchesQuery(course, query) {
  const courseText = `${course.name} ${course.semester}`.toLowerCase();

  if (courseText.includes(query)) {
    return true;
  }

  return Object.values(course.sections)
    .flat()
    .some(file => {
      const fileText = `${file.title} ${file.type}`.toLowerCase();
      return fileText.includes(query);
    });
}

function createCourseCard(course, query) {
  const card = document.createElement("article");
  card.className = "course";

  card.innerHTML = `
    <h3>${course.name}</h3>
    <p class="meta">${course.semester}</p>
    <div class="sections"></div>
  `;

  const sectionsEl = card.querySelector(".sections");
  let hasVisibleContent = false;

  Object.entries(course.sections).forEach(([sectionKey, files]) => {
    const filteredFiles = files.filter(file => {
      const fileText = `${file.title} ${file.type}`.toLowerCase();
      const courseText = `${course.name} ${course.semester}`.toLowerCase();

      return (
        fileText.includes(query) ||
        courseText.includes(query)
      );
    });

    if (filteredFiles.length === 0) {
      return;
    }

    hasVisibleContent = true;

    const section = document.createElement("div");
    section.className = "section";

    section.innerHTML = `
      <h4>${sectionLabels[sectionKey]}</h4>
      <div class="files"></div>
    `;

    const filesEl = section.querySelector(".files");

    filteredFiles.forEach(file => {
      filesEl.appendChild(createFileLink(file));
    });

    sectionsEl.appendChild(section);
  });

  return hasVisibleContent ? card : null;
}

function render(query = "") {
  const normalizedQuery = query.trim().toLowerCase();

  coursesEl.innerHTML = "";

  let totalCourses = 0;

  years.forEach(yearData => {
    const matchingCourses = yearData.courses.filter(course =>
      courseMatchesQuery(course, normalizedQuery)
    );

    if (matchingCourses.length === 0) {
      return;
    }

    totalCourses += matchingCourses.length;

    const yearSection = document.createElement("section");
    yearSection.className = "year";

    yearSection.innerHTML = `
      <div class="year-header">
        <h2>${yearData.year}</h2>
        <span>
          ${matchingCourses.length}
          ${matchingCourses.length === 1 ? "materia" : "materie"}
        </span>
      </div>
      <div class="courses-grid"></div>
    `;

    const grid = yearSection.querySelector(".courses-grid");

    matchingCourses.forEach(course => {
      const card = createCourseCard(course, normalizedQuery);

      if (card) {
        grid.appendChild(card);
      }
    });

    coursesEl.appendChild(yearSection);
  });

  if (totalCourses === 0) {
    coursesEl.innerHTML = `
      <p class="empty">Nessun materiale trovato.</p>
    `;
  }
}

searchEl.addEventListener("input", event => {
  render(event.target.value);
});

render();