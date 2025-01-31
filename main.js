function updateFavicons() {
  const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const favicons = [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      light: new URL("/img/favicon_black/apple-touch-icon.png", import.meta.url).toString(),
      dark: new URL("/img/favicon_white/apple-touch-icon.png", import.meta.url).toString()
    },
    {
      rel: "icon",
      type: "image/x-icon",
      light: new URL("/img/favicon_black/favicon.ico", import.meta.url).toString(),
      dark: new URL("/img/favicon_white/favicon.ico", import.meta.url).toString()
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      light: new URL("/img/favicon_black/favicon-16x16.png", import.meta.url).toString(),
      dark: new URL("/img/favicon_white/favicon-16x16.png", import.meta.url).toString()
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      light: new URL("/img/favicon_black/favicon-32x32.png", import.meta.url).toString(),
      dark: new URL("/img/favicon_white/favicon-32x32.png", import.meta.url).toString()
    }
  ];

  favicons.forEach(({ rel, type, sizes, light, dark }) => {
    let link =
      document.querySelector(`link[rel='${rel}'][sizes='${sizes}']`) ||
      document.createElement("link");
    link.rel = rel;
    if (type) link.setAttribute("type", type);
    if (sizes) link.setAttribute("sizes", sizes);
    link.href = darkMode ? dark : light;
    document.head.appendChild(link);
  });
}

updateFavicons();
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateFavicons);

function scrollToAboutSection(duration = 2000, section) {
  const aboutSection = document.querySelector(section);

  if (!aboutSection) {
    console.error('Sekcja z klasą "about" nie została znaleziona.');
    return;
  }

  const startPosition = window.pageYOffset; // Początkowa pozycja scrolla
  const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset; // Pozycja docelowa
  const distance = targetPosition - startPosition; // Całkowity dystans do przewinięcia
  let startTime = null;

  // Funkcja animacji
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1); // Upewnij się, że nie przekracza 1

    // Easing (płynność)
    const ease = easeInOutQuad(progress);

    window.scrollTo(0, startPosition + distance * ease); // Przewiń do nowej pozycji

    if (timeElapsed < duration) {
      requestAnimationFrame(animation); // Kontynuuj animację
    }
  }

  // Funkcja easing (możesz zmienić na inną)
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  requestAnimationFrame(animation); // Rozpocznij animację
}

let lastScrollTop = 0; // Zmienna do przechowywania ostatniej pozycji scrolla
const nav = document.querySelector("nav"); // Wybór elementu nawigacji

window.addEventListener("scroll", function () {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop; // Aktualna pozycja scrolla

  if (currentScroll > lastScrollTop) {
    // Scrollowanie w dół
    nav.classList.add("off"); // Usunięcie klasy "on"
  } else {
    // Scrollowanie w górę
    nav.classList.remove("off"); // Dodanie klasy "on"
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Aktualizacja ostatniej pozycji scrolla
});

// zmiana tła

// Funkcja do dodawania i usuwania klasy bg2
function toggleBgClass(classPhoto, bgClass) {
  const targetElement = document.querySelector(classPhoto);
  const bodyElement = document.body;
  const logo = document.querySelector(".logo");

  // Użycie Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Dodaj klasę bg2, gdy element jest widoczny
        bodyElement.classList.add(bgClass);
        if (bgClass == "bg1") logo.classList.remove("hide");
      } else {
        // Usuń klasę bg2, gdy element nie jest widoczny
        bodyElement.classList.remove(bgClass);
        if (bgClass == "bg1") logo.classList.add("hide");
      }
    });
  });

  // Obserwuj element
  if (targetElement) {
    observer.observe(targetElement);
  }
}

// Wywołaj funkcję po załadowaniu strony
document.addEventListener("DOMContentLoaded", toggleBgClass(".photo00", "bg1"));
document.addEventListener("DOMContentLoaded", toggleBgClass(".photo01", "bg2"));
document.addEventListener("DOMContentLoaded", toggleBgClass(".photo02", "bg3"));
document.addEventListener("DOMContentLoaded", toggleBgClass(".photo03", "bg4"));

// Wywołanie funkcji
// scrollToAboutSection(2000); // Przewiń w ciągu 2 sekund

// Wywołanie funkcji
// scrollToAboutSection();
document.querySelector(".link0").addEventListener("click", () => {
  scrollToAboutSection(2000, ".wrapper");
});

document.querySelector(".link1").addEventListener("click", () => {
  scrollToAboutSection(2000, ".about");
});

document.querySelector(".link2").addEventListener("click", () => {
  scrollToAboutSection(3000, ".whatWeDo");
});

document.querySelector(".link3").addEventListener("click", () => {
  scrollToAboutSection(3000, ".leaderboard");
});
