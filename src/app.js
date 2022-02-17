import "./animations";

// translations
const translatables = document.querySelectorAll('[fr]');

if (navigator.language.includes('fr')) {
  translatables.forEach(t => {
    t.textContent = t.getAttribute('fr');
    // remove the attribute
    t.removeAttribute('fr');
  });
}

// play videos only on hover
const videos = document.querySelectorAll('video');

videos.forEach(video => {
  video.addEventListener("mouseover", function() {
    this.play();
  });
  
  video.addEventListener("mouseleave", function() {
    this.pause();
  });
});

// ckech if project is present in session storage
let project = sessionStorage.getItem('js-opened-project');

// check if project is passed in url
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('open'))
  project = project || "p:" + urlParams.get('open');

if (project) open(project);

// check if is the first of april
const date = new Date();
const isFirstApril = date.getMonth() === 3 && date.getDate() === 1;

if (isFirstApril) {
  document.body.classList.add('js-april');
}