const images = document.querySelectorAll('img.js-lazy');

console.log(images);

const loadingImage = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.src = entry.target.nextElementSibling.src;
            observer.unobserve(entry.target);
        }
    });
};

const imgObserver = new IntersectionObserver(loadingImage, {
    root: null,
    threshold: 0.15,
});

images.forEach(image => {
    imgObserver.observe(image);
});