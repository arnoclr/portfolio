import { illusory } from "illusory";

const boxes = document.querySelectorAll('.js-box');

boxes.forEach(boxWrapper => {
    const boxButton = boxWrapper.querySelector('div');
    const boxThumbnail = boxWrapper.querySelector('img');
    const boxContent = boxWrapper.querySelector('aside');
    const boxBackdrop = boxWrapper.querySelector('.ac-box-backdrop');
    const closeButtons = boxWrapper.querySelectorAll('.js-box-close');

    let isOpened = false;

    const closeBox = async () => {
        if (!isOpened) return;

        isOpened = false;

        boxBackdrop.style.opacity = 0;
        boxThumbnail.style.visibility = 'visible';

        const { finished, cancel } = illusory(boxContent, boxThumbnail, {
            duration: '.35s',
            cubicBezier: 'cubic-bezier(.4,.01,.21,.97)',
            zIndex: 10
        });

        await finished;

        boxContent.style.display = 'none';
        boxBackdrop.style.display = 'none';
    };

    const openBox = async () => {
        if (isOpened) return;

        isOpened = true;

        boxContent.style.display = 'block';
        boxBackdrop.style.display = 'block';
        boxBackdrop.clientHeight;
        boxBackdrop.style.opacity = 1;
        boxContent.clientHeight;

        const { finished, cancel } = illusory(boxThumbnail, boxContent, {
            duration: '.35s',
            cubicBezier: 'cubic-bezier(.4,.01,.21,.97)',
            zIndex: 10
        });

        await finished;

        boxThumbnail.style.visibility = 'hidden';
    };

    closeButtons.forEach(closeButton => {
        closeButton.addEventListener('click', closeBox);
    });

    boxButton.addEventListener('click', openBox);
    boxBackdrop.addEventListener('click', closeBox);

    document.addEventListener('keydown', e => {
        // TODO: fix double close
        if (e.key === 'Escape') {
            closeBox();
        }
    });

});