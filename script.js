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

// Aktualizacja przy załadowaniu strony
updateFavicons();

// Obsługa zmian systemowego motywu
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateFavicons);
// Docelowy czas (02/02/2025, godzina 20:00 polskiego czasu)
const targetDate = new Date("2025-02-02T19:00:00+01:00");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").textContent = "Czas minął!";
    clearInterval(intervalId);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById(
    "countdown"
  ).textContent = `${days} dni, ${hours} godz., ${minutes} min., ${seconds} sek.`;
}

// Aktualizacja odliczania co sekundę
const intervalId = setInterval(updateCountdown, 1000);
updateCountdown();
