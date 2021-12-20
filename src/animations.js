const projectsBoxes = document.querySelectorAll('.js-project');
const slider = document.querySelector('.js-slider');
const pages = document.querySelector('.js-pages');

let openedImg = null;

projectsBoxes.forEach(box => {
  let img = box.querySelector('img');

  img.addEventListener('click', e => {
    e.preventDefault();
    openedImg = img;
    img.style.visibility = 'hidden';
    let placeholder = createPlaceholder(img);
    
    // animation
    setTimeout(() => {
      pages.classList.add('start');
      endPlaceholder(placeholder);
    }, 1);

    const page = document.getElementById(box.dataset.to)

    setTimeout(() => {
      pages.classList.add('middle');
      const offset = getOffset(img);
      // page.querySelector('.projects-details__page-content').style.transformOrigin = `${window.innerHeight / offset.top}% ${window.innerWidth / offset.left}%`;
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

let backBtn = document.querySelector('.js-close-pages');

backBtn.addEventListener('click', e => {
  let placeholder = createPlaceholder(openedImg);
  let placeholderRef = {
    width: placeholder.style.width,
    height: placeholder.style.height,
    top: placeholder.style.top,
    left: placeholder.style.left
  };
  endPlaceholder(placeholder);
  pages.classList.remove('end');
  openedImg.style.visibility = 'hidden';

  setTimeout(() => {
    placeholder.style.top = placeholderRef.top;
    placeholder.style.left = placeholderRef.left;
    placeholder.style.height = placeholderRef.height;
    placeholder.style.width = placeholderRef.width;
  }, 1);

  setTimeout(() => {
    pages.classList.remove('start');
    pages.classList.remove('middle');
    placeholder.remove();
    openedImg.style.visibility = 'visible';
    document.querySelector('html').style.overflow = 'auto';
  }, 300);
})

function endPlaceholder(placeholder) {
  placeholder.style.top ='0px';
  placeholder.style.left ='0px';

  if (window.innerWidth > 768) {
    placeholder.style.height = window.innerHeight + 'px';
  } else {
    placeholder.style.height = '300px';
    placeholder.style.width = window.innerWidth + 'px';
  }
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