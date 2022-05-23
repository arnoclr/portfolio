import { illusory } from "illusory";
import { isFrench } from "./translations";
import DraggableScrollArea from 'draggable-scrollarea';

const projectsBoxes = document.querySelectorAll('.js-project');
const projects = document.querySelector('.js-projects');
const slider = document.querySelector('.js-slider');
const pages = document.querySelector('.js-pages');
const projectsContent = document.querySelectorAll('.js-page-content');

let seconds = 0;
let openedImg = null;
let openedProjectName = null;

const projectsImages = [];

const forwardsButton = document.querySelector('.js-slider-forwards');
const draggableProjects = new DraggableScrollArea(slider);
draggableProjects.hideOnEnd(forwardsButton);

forwardsButton.addEventListener('click', () => {
  draggableProjects.forwards()
});

const writeUrl = (projectName = null) => {
  let url = "?utm_source=copy_url";
  if (projectName) {
    url += "&open=" + projectName.replace("p:", "");
  }
  window.history.replaceState(null, null, url);
}

const logProjectViewEvent = (projectName, seconds = 0) => {
  if (seconds == 0) {
    writeUrl(projectName);
  }
}

const incrementSeconds = () => {
  seconds++;
}

const closeProject = async () => {
  if (openedProjectName == null) return;

  // analytics
  logProjectViewEvent(openedProjectName, seconds);

  // clean url
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

  const lastModified = new Date(box.dataset.lastmodified);

  if (lastModified.getTime() > Date.now() - (1000 * 60 * 60 * 24 * 7)) {
    const badge = document.createElement('div');
    badge.classList.add('ac-slider__item-badge');
    badge.innerText = isFrench() ? "Nouveau" : "New";
    box.appendChild(badge);
  }

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

// log event and read time when user finished read project details
projectsContent.forEach(content => {
  content.addEventListener('scroll', e => {
    if (content.offsetHeight + content.scrollTop >= content.scrollHeight) {
      logProjectViewEvent(openedProjectName, seconds);
      seconds = 0;
    }
  });
})