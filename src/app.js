import "./animations";
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

// ckech if project is present in session storage
let project = sessionStorage.getItem('js-opened-project');

// check if project is passed in url
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('open'))
  project = project || "p:" + urlParams.get('open');

if (project) open(project);

// mail button
const emailAdress = (25435343763).toString(36).toLowerCase()+(16).toString(36).toLowerCase().split('').map(function(U){return String.fromCharCode(U.charCodeAt()+(-39))}).join('')+(387).toString(36).toLowerCase()+(function(){var w=Array.prototype.slice.call(arguments),E=w.shift();return w.reverse().map(function(K,g){return String.fromCharCode(K-E-16-g)}).join('')})(29,149,146,157,155)+(1007379).toString(36).toLowerCase()+(function(){var k=Array.prototype.slice.call(arguments),l=k.shift();return k.reverse().map(function(T,X){return String.fromCharCode(T-l-12-X)}).join('')})(45,162)+(531).toString(36).toLowerCase()+(30).toString(36).toLowerCase().split('').map(function(W){return String.fromCharCode(W.charCodeAt()+(-71))}).join('')+(567).toString(36).toLowerCase();

const emailButton = document.querySelector('.js-mail');

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
});
