import { logEvent, setUserProperties } from "firebase/analytics";
import { analytics } from "./firebase";

const projectsBoxes = document.querySelectorAll('.js-project');
const projects = document.querySelector('.js-projects');
const slider = document.querySelector('.js-slider');
const pages = document.querySelector('.js-pages');
const projectsContent = document.querySelectorAll('.projects-details__page-content');

let seconds = 0;

let openedImg = null;
let openedProjectName = null;

const projectsImages = [];

projectsBoxes.forEach(box => {
  let img = box.querySelector('img');

  projectsImages.push(img);

  box.addEventListener('click', e => {
    e.preventDefault();
    openedImg = img;
    img.style.visibility = 'hidden';
    let placeholder = createPlaceholder(img);

    // store project name in session storage
    openedProjectName = box.dataset.to;
    sessionStorage.setItem('js-opened-project', openedProjectName);
    logProjectViewEvent(openedProjectName);

    // start timer and log open event
    seconds = 0;
    var cancelTimer = setInterval(incrementSeconds, 1000);
    
    // animation
    pages.classList.add('start');
    placeholder.offsetHeight;
    endPlaceholder(placeholder, true);

    const page = document.getElementById(box.dataset.to)
    
    pages.classList.add('middle');
    const offset = getOffset(img);

    // remove placeholder after animation
    setTimeout(() => {
      pages.classList.add('end');
      placeholder.remove();
      document.querySelector('html').style.overflow = 'hidden';
      page.scrollIntoView({behavior: 'instant'});
    }, 301);

    // unhide image
    setTimeout(() => {
      img.style.visibility = 'visible';
      page.querySelector('.projects-details__page-content').style.transform = "none";
    }, 700);
  });
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
  const caroussel = page.querySelector('.projectcaroussel');

  page.addEventListener('scroll', e => {
    if (page.scrollTop > 0) {
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

document.addEventListener('keydown', e =>{
	if (e.key === "Escape") {
		closeProject();
	}
});

function closeProject() {

  // analytics
  logProjectViewEvent(openedProjectName, seconds);

  // ui
  sessionStorage.removeItem('js-opened-project');
  let placeholder = createPlaceholder(openedImg);
  let placeholderRef = {
    width: placeholder.style.width,
    height: placeholder.style.height,
    top: placeholder.style.top,
    left: placeholder.style.left
  };

  endPlaceholder(placeholder, false);
  pages.classList.remove('end');
  openedImg.style.visibility = 'hidden';
  
  const page = document.getElementById(openedProjectName)
  page.querySelector('.projects-details__page-content').style.transform = "";

  placeholder.style.top = placeholderRef.top;
  placeholder.style.left = placeholderRef.left;
  placeholder.style.height = placeholderRef.height;
  placeholder.style.width = placeholderRef.width;

  setTimeout(() => {
    pages.classList.remove('start');
    pages.classList.remove('middle');
    placeholder.remove();
    openedImg.style.visibility = 'visible';
    document.querySelector('html').style.overflow = 'auto';
  }, 300);
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

function endPlaceholder(placeholder, transition) {
  // disable timing animation when place image at the first position and then reenable it
  !transition && placeholder.classList.add('js-notransition');

  placeholder.style.top ='0px';
  placeholder.style.left ='0px';

  if (window.innerWidth > 768) {
    placeholder.style.height = window.innerHeight + 'px';
  } else {
    placeholder.style.height = '300px';
    placeholder.style.width = window.innerWidth + 'px';
  }

  placeholder.offsetHeight;
  placeholder.classList.remove('js-notransition');
}

function createPlaceholder(img) {
  const placeholder = document.createElement('img');

  placeholder.classList.add('js-placeholder')
  placeholder.width = img.width;
  placeholder.height = img.height;

  const position = getOffset(img);
  placeholder.style.top = position.top + 'px'
  placeholder.style.left = position.left - slider.scrollLeft + 'px'

  placeholder.src = img.src

  img.parentNode.insertBefore(placeholder, img);

  return placeholder;
}

function logProjectViewEvent(projectName, seconds = 0) {
  projectName = projectName.substring(2);

  if (seconds > 7) {
    logEvent(analytics, 'project_view', {
      project_name: projectName,
      seconds: seconds
    });
    console.log(projectName, seconds)
  } else if (seconds == 0) {
    logEvent(analytics, 'project_open', {
      project_name: projectName
    })
    console.log(projectName, 0)
  }
}

function incrementSeconds() {
  seconds++;
}

function getOffset(el) {
  let x = 0
  let y = 0
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      x += el.offsetLeft - el.scrollLeft
      y += el.offsetTop - el.scrollTop
      el = el.offsetParent
  }
  // remove scroll offset
  x -= window.scrollX
  y -= window.scrollY

  return { top: y, left: x }
}