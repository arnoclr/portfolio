const translatables = document.querySelectorAll('[fr]');

if (navigator.language.includes('fr')) {
  translatables.forEach(t => {
      t.textContent = t.getAttribute('fr');
  });
}