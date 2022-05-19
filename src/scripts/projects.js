import { illusory } from "illusory";

const projectsBoxes = document.querySelectorAll('.js-project');
const projects = document.querySelector('.js-projects');
const slider = document.querySelector('.js-slider');
const pages = document.querySelector('.js-pages');
const projectsContent = document.querySelectorAll('.js-page-content');

let seconds = 0;
let lastHref = "";
let disabledPushState = false;
let openedImg = null;
let openedProjectName = null;

const projectsImages = [];

const writeUrl = (projectName = null) => {
  if (disabledPushState) return;
  lastHref = window.location.href;
  let url = "?utm_source=copy_url";
  if (projectName) {
    url += "&open=" + projectName.replace("p:", "");
  }
  window.history.pushState({}, '', url);
}

const logProjectViewEvent = (projectName, seconds = 0) => {
  if (seconds == 0) {
    writeUrl(projectName);
  }
}

const incrementSeconds = () => {
  seconds++;
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const closeProject = async () => {
  if (openedProjectName == null) return;

  // analytics
  logProjectViewEvent(openedProjectName, seconds);

  // clear url
  writeUrl();

  sessionStorage.removeItem('js-opened-project');
  
  // animation
  const page = document.getElementById(openedProjectName)
  document.body.style.overflow = '';

  let {finished, cancel} = illusory(page, openedImg, {
    duration: '.25s',
    easing: 'cubic-bezier(.45,-0.01,0,.9)',
    compositeOnly: true,
    includeChildren: false
  });

  openedProjectName = null;
  const canceled = await finished;
  
  pages.style.display = 'none';
}

projectsBoxes.forEach(box => {
  let img = box.querySelector('img');

  projectsImages.push(img);

  box.addEventListener('click', async e => {
    e.preventDefault();
    openedImg = img;

    // store project name in session storage
    openedProjectName = box.dataset.to;
    sessionStorage.setItem('js-opened-project', openedProjectName);
    logProjectViewEvent(openedProjectName);

    // start timer and log open event
    seconds = 0;
    var cancelTimer = setInterval(incrementSeconds, 1000);

    // animation
    const page = document.getElementById(box.dataset.to);
    pages.style.display = 'flex';
    page.scrollIntoView({behavior: 'instant'});

    let {finished, cancel} = illusory(openedImg, page, {
      duration: '.3s',
      easing: 'cubic-bezier(.45,-0.01,0,.9)',
      compositeOnly: true,
      includeChildren: false
    });

    const canceled = await finished;

    document.body.style.overflow = 'hidden';
  })
})

let backBtn = document.querySelector('.js-close-pages');

pages.addEventListener('scroll', () => {
  let openedProject = Math.round(pages.scrollLeft / window.innerWidth);

  openedImg = projectsImages[openedProject];

  // retrive name of new project
  let viewboxProjectName = projectsBoxes[openedProject].dataset.to;

  if (viewboxProjectName != openedProjectName) {
    logProjectViewEvent(openedProjectName, seconds);
    openedProjectName = viewboxProjectName;
    seconds = 0;
    logProjectViewEvent(openedProjectName);
  }
})

projectsContent.forEach(page => {
  const caroussel = page.querySelector('.js-projectcaroussel');

  page.addEventListener('scroll', e => {
    if (page.scrollTop > 80) {
      caroussel.classList.add('scrolled');
    } else {
      caroussel.classList.remove('scrolled');
    }
  })
})

const nextBtns = document.querySelectorAll('.js-next-project');

nextBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    pages.scrollTo({
      top: 0,
      left: pages.scrollLeft + window.innerWidth,
      behavior: 'smooth'
    });
  });
})

backBtn.addEventListener('click', e => {
  e.preventDefault();
  closeProject();
})

document.addEventListener('keydown', e => {
  if (e.key === "Escape") {
    closeProject();
  }
});

window.onpopstate = history.onpushstate = function(e) {
  const href = window.location.href;
  const urlParams = new URLSearchParams(href);
  const projectName = urlParams.get('open');

  disabledPushState = true;

  console.log(projectName);

  closeProject();

  console.log(projectName);

  if (projectName) {
    const projectId = "p:" + projectName;
    sleep(600);
    document.querySelector(`[data-to='${projectId}']`).click();
  }

  lastHref = href;
  disabledPushState = false;
}

// log event and read time when user finished read project details
projectsContent.forEach(content => {
  content.addEventListener('scroll', e => {
    if (content.offsetHeight + content.scrollTop >= content.scrollHeight) {
      logProjectViewEvent(openedProjectName, seconds);
      seconds = 0;
    }
  });
})