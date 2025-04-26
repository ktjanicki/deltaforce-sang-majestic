const hamburgerIcon = document.querySelector('.hamburgerIcon');
const desktopWindowSize = window.matchMedia('(min-width: 1150px)');
const navBar = document.querySelector('nav');

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

// scrool

function scrollToSection(section) {
  const duration = 2000;
  const targetSection = document.querySelector(section);

  if (!targetSection) {
    console.error(`Sekcja ${section} nie została znaleziona.`);
    return;
  }

  const startPosition = window.scrollY;
  const targetPosition =
    targetSection.getBoundingClientRect().top + window.scrollY;
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
  toggleMobileMenu();
}

//toggle navbar

function navBarControl(navSelector, hamburgerSelector, mediaQuery) {
  let lastScrollTop = 0;
  const nav = navSelector;
  const hamburgerIcon = hamburgerSelector;
  const isDesktop = () => mediaQuery.matches;

  if (!nav || !hamburgerIcon) return;

  const handleScroll = () => {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    if (!isDesktop()) return;

    nav.classList.toggle('off', currentScroll > lastScrollTop);
    lastScrollTop = Math.max(0, currentScroll);
  };

  const handleResize = (e) => {
    if (e.matches) {
      nav.classList.remove('off');
      hamburgerIcon.classList.add('hide');
    } else {
      nav.classList.add('off');
      hamburgerIcon.classList.remove('hide');
    }
  };

  window.toggleMobileMenu = () => {
    nav.classList.toggle('off');
    hamburgerIcon.classList.toggle('opened');
    hamburgerIcon.setAttribute(
      'aria-expanded',
      hamburgerIcon.classList.contains('opened')
    );
  };

  if (isDesktop()) {
    nav.classList.remove('off');
    hamburgerIcon.classList.add('hide');
  }

  window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
  mediaQuery.addEventListener('change', handleResize);
  hamburgerIcon.addEventListener('click', window.toggleMobileMenu);
}

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

const apiURL =
  'https://script.google.com/macros/s/AKfycbwLWQuNCG-pDztv0PGJCzFRwsGRrZPbES044NFgp9wUXEqj3gTxhC6TAgvmyUfcPKCoaA/exec';
const form = document.forms['contact-form'];
const submitBtn = document.querySelector('.submitButton');
const robotCheck = document.getElementById('robotCheck');
const messageField = document.getElementById('message');

function validateForm() {
  const allFieldsValid = [
    ...document.querySelectorAll('input, select, textarea')
  ].every((field) => field.checkValidity());
  const isHuman = robotCheck.value === 'human';

  messageField.disabled = !allFieldsValid || !isHuman;
  submitBtn.disabled = !allFieldsValid || !isHuman;
}

form.addEventListener('input', (event) => {
  const field = event.target;
  const container = field.parentElement;
  const icon = container.querySelector('.icon');
  const errorMessage = container.nextElementSibling;

  if (field.checkValidity()) {
    container.classList.add('valid');
    container.classList.remove('invalid');
    errorMessage.textContent = '';
  } else {
    container.classList.add('invalid');
    container.classList.remove('valid');
    errorMessage.textContent = field.title;
  }

  icon.style.display = 'inline';
  validateForm();
});

robotCheck.addEventListener('change', validateForm);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity() || robotCheck.value !== 'human') {
    alert('Proszę poprawnie wypełnić formularz.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Wysyłanie...';

  try {
    await fetch(apiURL, { method: 'POST', body: new FormData(form) });
    alert('Twoje podanie zostało wysłane!');
    form.reset();
  } catch (error) {
    console.error('Błąd!', error.message);
  } finally {
    validateForm();
    submitBtn.textContent = 'Wyślij';
  }
});

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', updateFavicons);

document.addEventListener('DOMContentLoaded', () => {
  const tasks = [
    { func: toggleBgClass, args: ['.photo00', 'bg1'] },
    { func: toggleBgClass, args: ['.photo01', 'bg2'] },
    { func: toggleBgClass, args: ['.photo02', 'bg3'] },
    { func: toggleBgClass, args: ['.photo03', 'bg4'] },
    { func: toggleBgClass, args: ['.photo04', 'bg5'] },
    { func: navBarControl, args: [navBar, hamburgerIcon, desktopWindowSize] },
    { func: updateFavicons, args: [] }
  ];

  tasks.forEach(({ func, args }) => func(...args));

  const links = {
    link1: '.about',
    link2: '.whatWeDo',
    link3: '.leaderboard',
    link4: '.recruitment'
  };

  Object.entries(links).forEach(([linkClass, targetSection]) => {
    document.querySelector(`.${linkClass}`)?.addEventListener('click', () => {
      scrollToSection(targetSection);
    });
  });
});
