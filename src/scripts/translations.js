const isFrench = () => {
    return navigator.language.includes('fr');
}

const translateDocument = () => {
    const translatables = document.querySelectorAll('[fr]');

    if (isFrench()) {
        translatables.forEach(t => {
            t.textContent = t.getAttribute('fr');
            // remove the attribute
            t.removeAttribute('fr');
        });
    }
}

export { isFrench, translateDocument };