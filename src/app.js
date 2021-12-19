const translatables = document.querySelectorAll('[fr]');

if (navigator.language.includes('fr')) {
  translatables.forEach(t => {
    t.textContent = t.getAttribute('fr');
  });
}

const projectsBoxes = document.querySelectorAll('.js-project');
const slider = document.querySelector('.js-slider');

projectsBoxes.forEach(box => {
  let img = box.querySelector('img');

  img.addEventListener('click', e => {
    console.log(box, img)
    let placeholder = createPlaceholder(img);
    // animation
    setTimeout(() => {
      placeholder.style.height = window.innerHeight + 'px';
      placeholder.style.top ='0px';
      placeholder.style.left ='0px';
    }, 1);  
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

  placeholder.src = img.src.replace(/\?.+/, '');

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