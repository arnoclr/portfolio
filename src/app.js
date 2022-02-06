import "./animations";

import { logEvent, setUserProperties } from "firebase/analytics";
import { analytics } from "./firebase";

// disabled analytics by default if consent is not given
const consent = localStorage.getItem("__CONSENT__");

function hideCookieBanner() {
  document.querySelector('.ac-cookie-banner').style.display = 'none';
}

if (consent != "allowed") {
  window['ga-disable-G-G6TCXRC95X'] = true;
  console.log('Analytics disabled');
}

if (consent == "declined" || consent == "allowed") hideCookieBanner();

document.querySelector('.js-cookie-allow').addEventListener('click', () => {
  localStorage.setItem("__CONSENT__", "allowed");
  window['ga-disable-G-G6TCXRC95X'] = false;
  console.log('Analytics enabled');
  hideCookieBanner();
});

document.querySelector('.js-cookie-decline').addEventListener('click', () => {
  localStorage.setItem("__CONSENT__", "declined");
  hideCookieBanner();
});

// translations
const translatables = document.querySelectorAll('[fr]');

if (navigator.language.includes('fr')) {
  translatables.forEach(t => {
    t.textContent = t.getAttribute('fr');
    // remove the attribute
    t.removeAttribute('fr');
  });
}

// split testing user property
setUserProperties(analytics, { branch: process.env.BRANCH });

// events
document.querySelector('.ga-contact').addEventListener('click', () => {
  logEvent(analytics, "contact", {
    "placement": "header"
  });
});

document.querySelectorAll('.ga-bio').forEach(tool => {
  tool.addEventListener('click', () => {
    logEvent(analytics, "open_bio_link", {
      "name": tool.dataset.gaName
    });
  });
});

document.querySelectorAll('.ga-tool').forEach(tool => {
  tool.addEventListener('click', () => {
    logEvent(analytics, "open_tool", {
      "name": tool.dataset.gaName
    });
  });
});

function open(project) {
  const projectImg = document.querySelector(`[data-to="${project}"]`).querySelector('img');
  if (projectImg) {
    projectImg.click();
    // clean url
    window.history.replaceState({}, document.title, window.location.pathname);
  }
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