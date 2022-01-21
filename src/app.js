import './animations';

const translatables = document.querySelectorAll('[fr]');

if (navigator.language.includes('fr')) {
  translatables.forEach(t => {
    t.textContent = t.getAttribute('fr');
  });
}

// lazy load images
var observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0.0) {
        let img = entry.target;
        if (!img.hasAttribute('loaded')) {
          // find the noscript tag just below the image
          const noscript = img.nextElementSibling;

          // find image source
          const HTML = noscript.innerText;
          const src = HTML.match(/src="(.*?)"/)[1];

          img.setAttribute('src', src);
          img.setAttribute('loaded', true);
        }
      }
    });
  },
  {}
)

const images = document.querySelectorAll('.js-lazy');

images.forEach(img => {
  observer.observe(img);
});

// check if project is passed in url
const urlParams = new URLSearchParams(window.location.search);
const project = urlParams.get('open');

if (project) {
  const projectImg = document.querySelector(`[data-to="p:${project}"]`).querySelector('img');
  if (projectImg) {
    projectImg.click();
    // clean url
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// check if is the first of april
const date = new Date();
const isFirstApril = date.getMonth() === 3 && date.getDate() === 1;

if (isFirstApril) {
  document.body.classList.add('js-april');
}