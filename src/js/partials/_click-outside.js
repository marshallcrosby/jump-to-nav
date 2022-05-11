//
// Click outside
//

document.addEventListener('click', function (event) {
    const withinBoundaries = event.composedPath().includes(wrapperEl);
    
    if (wrapperEl.classList.contains('jump-to-nav-wrapper--showing')) {
        if (!withinBoundaries) {
            minimizeButton.click();
        }
    }
});