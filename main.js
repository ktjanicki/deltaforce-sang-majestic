const hamburgerIcon = document.querySelector('.hamburgerIcon');
const mediaQuery = window.matchMedia('(min-width: 1150px)');

function updateFavicons() {
  const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const favicons = [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      light: new URL(
        '/img/favicon_black/apple-touch-icon.png',
        import.meta.url
      ).toString(),
      dark: new URL(
        '/img/favicon_black/apple-touch-icon.png',
        import.meta.url
      ).toString()
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      light: new URL(
        '/img/favicon_black/favicon.ico',
        import.meta.url
      ).toString(),
      dark: new URL(
        '/img/favicon_white/favicon.ico',
        import.meta.url
      ).toString()
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      light: new URL(
        '/img/favicon_black/favicon-16x16.png',
        import.meta.url
      ).toString(),
      dark: new URL(
        '/img/favicon_white/favicon-16x16.png',
        import.meta.url
      ).toString()
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      light: new URL(
        '/img/favicon_black/favicon-32x32.png',
        import.meta.url
      ).toString(),
      dark: new URL(
        '/img/favicon_white/favicon-32x32.png',
        import.meta.url
      ).toString()
    }
  ];

  favicons.forEach(({ rel, type, sizes, light, dark }) => {
    let link =
      document.querySelector(`link[rel='${rel}'][sizes='${sizes}']`) ||
      document.createElement('link');
    link.rel = rel;
    if (type) link.setAttribute('type', type);
    if (sizes) link.setAttribute('sizes', sizes);
    link.href = darkMode ? dark : light;
    document.head.appendChild(link);
  });
}

updateFavicons();
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', updateFavicons);

function scrollToAboutSection(duration = 2000, section) {
  const aboutSection = document.querySelector(section);

  if (!aboutSection) {
    console.error('Sekcja nie została znaleziona.');
    return;
  }

  const startPosition = window.pageYOffset;
  const targetPosition =
    aboutSection.getBoundingClientRect().top + window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutQuad(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  requestAnimationFrame(animation);
  toggleMenu();
}

let lastScrollTop = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', function () {
  const currentScroll =
    window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    if (mediaQuery.matches) nav.classList.add('off');
  } else {
    if (mediaQuery.matches) nav.classList.remove('off');
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// background image change

function toggleBgClass(classPhoto, bgClass) {
  const targetElement = document.querySelector(classPhoto);
  const bodyElement = document.querySelector('.backgroundPhoto');
  const logo = document.querySelector('.logo');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        bodyElement.classList.add(bgClass);
        if (bgClass == 'bg1') logo.classList.remove('hide');
      } else {
        bodyElement.classList.remove(bgClass);
        if (bgClass == 'bg1') logo.classList.add('hide');
      }
    });
  });

  if (targetElement) {
    observer.observe(targetElement);
  }
}

if (mediaQuery.matches) {
  nav.classList.remove('off');
  hamburgerIcon.classList.add('hide');
}

mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    nav.classList.remove('off');
    hamburgerIcon.classList.add('hide');
  } else {
    nav.classList.add('off');
    hamburgerIcon.classList.remove('hide');
  }
});

function toggleMenu() {
  nav.classList.toggle('off');
  hamburgerIcon.classList.toggle('opened');
  hamburgerIcon.setAttribute(
    'aria-expanded',
    hamburgerIcon.classList.contains('opened')
  );
}

hamburgerIcon.addEventListener('click', toggleMenu);
document.addEventListener('DOMContentLoaded', toggleBgClass('.photo00', 'bg1'));
document.addEventListener('DOMContentLoaded', toggleBgClass('.photo01', 'bg2'));
document.addEventListener('DOMContentLoaded', toggleBgClass('.photo02', 'bg3'));
document.addEventListener('DOMContentLoaded', toggleBgClass('.photo03', 'bg4'));

document.querySelector('.link0').addEventListener('click', () => {
  scrollToAboutSection(2000, '.wrapper');
});

document.querySelector('.link1').addEventListener('click', () => {
  scrollToAboutSection(2000, '.about');
});

document.querySelector('.link2').addEventListener('click', () => {
  scrollToAboutSection(2000, '.whatWeDo');
});

document.querySelector('.link3').addEventListener('click', () => {
  scrollToAboutSection(2000, '.leaderboard');
});
