const translatables = document.querySelectorAll('[fr]');

if (navigator.language.includes('fr')) {
  translatables.forEach(t => {
    t.textContent = t.getAttribute('fr');
  });
}

const projectsBoxes = document.querySelectorAll('.js-project');
const slider = document.querySelector('.js-slider');
const pages = document.querySelector('.js-pages');

projectsBoxes.forEach(box => {
  let img = box.querySelector('img');

  img.addEventListener('click', e => {
    img.style.visibility = 'hidden';
    let placeholder = createPlaceholder(img);
    
    // animation
    setTimeout(() => {
      pages.classList.add('start');
      placeholder.style.top ='0px';
      placeholder.style.left ='0px';

      if (window.innerWidth > 768) {
        placeholder.style.height = window.innerHeight + 'px';
      } else {
        placeholder.style.height = '300px';
        placeholder.style.width = window.innerWidth + 'px';
      }
    }, 1);

    const page = document.getElementById(box.dataset.to)

    setTimeout(() => {
      pages.classList.add('middle');
      const offset = getOffset(img);
      page.querySelector('.projects-details__page-content').style.transformOrigin = `${window.innerHeight / offset.top}% ${window.innerWidth / offset.left}%`;
    }, 10);

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
    }, 1000);
  });
})

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