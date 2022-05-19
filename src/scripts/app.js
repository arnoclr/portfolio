import "./projects";
import { showPhoneNumber } from "./tel";

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

// mail button
const emailAdress = "bonjour@arnocellarier.fr";
const emailButton = document.querySelector('.js-mail');

// remove referrer copy_url if page is reloaded
if (sessionStorage.getItem('__active_session')) {
  // rebuild url without utm_source
  const url = new URL(window.location.href);
  url.searchParams.delete('utm_source');
  window.history.replaceState({}, '', url.href);
}

let referrer = "direct";
if (document.referrer) {
  let url = document.referrer; 
  referrer = url.match(/:\/\/(.[^/]+)/)[1];
}

const UTM_VERSION_NAME_STORAGE = "__utm_v1";
const timestamp = + new Date();

let tsGap;
if (localStorage.getItem(UTM_VERSION_NAME_STORAGE) != null) {
  const currentUtmData = JSON.parse(localStorage.getItem(UTM_VERSION_NAME_STORAGE));
  tsGap = timestamp - currentUtmData.ts / 1000;
} else {
  tsGap = Infinity;
}

const urlParams = new URLSearchParams(window.location.search);

let utmData = {
  s: urlParams.get('utm_source') || urlParams.get('u') || referrer,
  ts: timestamp
}

// si l'ancien referrer a été inscrit il y a plus d'un mois, on remplace par le nouveau
if (tsGap > timestamp + 60 * 60 * 24 * 30 && utmData.s != "direct") {
  localStorage.setItem(UTM_VERSION_NAME_STORAGE, JSON.stringify(utmData));
}

if (localStorage.getItem(UTM_VERSION_NAME_STORAGE) != null) {
  utmData = JSON.parse(localStorage.getItem(UTM_VERSION_NAME_STORAGE));
}

const utmSource = utmData.s;
const utmString = `Web Request #${btoa(utmSource)}`;

const emailString = `mailto:${emailAdress}?subject=${encodeURIComponent(utmString)}`;
emailButton.setAttribute('href', emailString);

// check if is the first of april
const date = new Date();
const isFirstApril = date.getMonth() === 3 && date.getDate() === 1;

if (isFirstApril) {
  document.body.classList.add('js-april');
}

window.addEventListener('DOMContentLoaded', () => {
  if (/[\?|\&]tel/.test(window.location.href)) {
    showPhoneNumber();
  }

  // clean url
  setTimeout(() => {
    // replace utm source in url
    const url = new URL(window.location.href);
    url.searchParams.set('utm_source', 'copy_url');
    window.history.replaceState(null, null, url.toString());
  }, 250);

  // open project passed in url
  if (urlParams.has('open')) {
    const projectId = "p:" + urlParams.get('open');
    document.querySelector(`[data-to='${projectId}']`).click();
  }
  
  sessionStorage.setItem('__active_session', 0);
});
