/*!
    * Jump to navigation v1.1.0
    * Need description.
    *
    * Copyright 2022 Marshall Crosby
    * https://marshallcrosby.com
*/


/* ------------------------------------------------------------------------------
    **TODO:
    1. Query params
        ✓ • Allow custom Y location
        ✓ • Make nesting an option
        ✓ • Allow custom z-index
        ✓ • Allow external css
        • Placement (left, right, top, bottom)
    ✓ 2. Click outside closes panel
    ✓ 3. CSS dynamic max-height
    ✓ 4. Focus nav item on current section in view
    5. Add static site navigation
    ✓ 6. Dynamic IDs if none
    7. Better verbiage/names
-------------------------------------------------------------------------------- */


const jumpToSections = document.querySelectorAll('[data-jtn-anchor]');

(function () {
    "use strict"

    if (jumpToSections.length > 0) {

        /* --------------------------------------------------------------------------
            Query params
        ---------------------------------------------------------------------------- */
    
        let scriptLinkage = document.getElementById('jump-to-nav-js');
        let activeSections = null;
        let smoothScroll = null;
        let topLocation = null;
        let heading = null;
        let zIndex = null;
        let nest = null;
        let css = null;
    
        if (scriptLinkage) {
            const urlParam = new URLSearchParams(scriptLinkage.getAttribute('src').split('?')[1]);
            
            activeSections = urlParam.get('active-section');
            smoothScroll = urlParam.get('smooth');
            topLocation = urlParam.get('top');
            heading = urlParam.get('heading');
            zIndex = urlParam.get('z-index');
            nest = urlParam.get('nest');
            css = urlParam.get('css');
        }
    
    
        /* --------------------------------------------------------------------------
            Render nav css
        ---------------------------------------------------------------------------- */
    
        if (css !== 'external') {
            const embeddedStyleTag = document.createElement('style');
            embeddedStyleTag.setAttribute('id', 'jumpToNavStyle');
        
            const jumpToCSS = `.js-jump-to-nav-smooth-scroll{scroll-behavior:smooth!important}.jump-to-nav-wrapper{--jtn-idle-width:40px;--jtn-base-font-size:16px;--jtn-ff-primary:"Helvetica Neue",Helvetica,Arial,sans-serif;--jtn-common-space:.8125em;--jtn-border-radius:.75em;--jtn-bg-color:#fff;--jtn-text-color:#333;--jtn-link-color:#1f4de3;--jtn-gray-100:#ededed;--jtn-gray-200:#d4d4d4;--jtn-color-border-common:rgba(0, 0, 0, 0.05);--jtn-ease:cubic-bezier(0.19, 1, 0.22, 1);--jtn-transition-speed:400ms;--jtn-box-shadow-deep:3px 5px 25px rgba(0, 0, 0, .18)}.jump-to-nav-wrapper{position:fixed;top:6.25em;right:.9375em;font-size:var(--jtn-base-font-size)!important;filter:drop-shadow(3px 5px 15px rgba(0, 0, 0, .18))}.jump-to-nav-wrapper .jump-to-nav{overflow:hidden;width:15em;height:auto;transition:-webkit-clip-path var(--jtn-transition-speed) var(--jtn-ease);transition:clip-path var(--jtn-transition-speed) var(--jtn-ease);transition:clip-path var(--jtn-transition-speed) var(--jtn-ease),-webkit-clip-path var(--jtn-transition-speed) var(--jtn-ease);color:var(--jtn-text-color);border-radius:var(--jtn-border-radius);background-color:var(--jtn-bg-color);font-family:var(--jtn-ff-primary);-webkit-clip-path:inset(0 0 calc(100% - var(--jtn-idle-width)) calc(100% - var(--jtn-idle-width)) round var(--jtn-border-radius));clip-path:inset(0 0 calc(100% - var(--jtn-idle-width)) calc(100% - var(--jtn-idle-width)) round var(--jtn-border-radius))}.jump-to-nav-wrapper .jump-to-nav>:not(.jump-to-nav__maximize){visibility:hidden;transition:visibility var(--jtn-transition-speed) var(--jtn-ease);transition-delay:var(--jtn-transition-speed);pointer-events:none}.jump-to-nav-wrapper .jump-to-nav>:not(.jump-to-nav__maximize) a:focus,.jump-to-nav-wrapper .jump-to-nav>:not(.jump-to-nav__maximize) button:focus{outline:0}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__maximize{position:absolute;top:0;right:0;display:flex;align-items:center;justify-content:center;width:var(--jtn-idle-width);height:var(--jtn-idle-width);cursor:pointer;border:0;background-color:var(--jtn-bg-color)}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__maximize svg{position:relative;right:1px;width:.5625em}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__minimize{width:28px;height:28px;margin-left:auto;padding:0;cursor:pointer;border:0;border-radius:30px;background-color:transparent}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__minimize:hover{background-color:var(--jtn-gray-100)}.jump-to-nav-wrapper .jump-to-nav a{display:inline-block;margin-bottom:.5em;color:var(--jtn-link-color);font-size:.75em;text-decoration:none}.jump-to-nav-wrapper .jump-to-nav ul{margin-bottom:0;padding-left:0;list-style-type:none}.jump-to-nav-wrapper .jump-to-nav ul li{padding-left:.625em}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__nav>ul{margin-top:0;margin-left:-.625em}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__header{display:flex;align-items:center;min-height:3.125em;padding:0 .9375em 0 1.25em;border-bottom:1px solid var(--jtn-color-border-common)}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__body{padding:.625em 1.25em;border-right:1px solid #fff}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__body::-webkit-scrollbar-corner{background-color:transparent}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__body::-webkit-scrollbar{width:5px;height:5px}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__body::-webkit-scrollbar-track{background-color:transparent}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__body::-webkit-scrollbar-thumb{outline:0;background-color:var(--jtn-gray-100)}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__body::-webkit-scrollbar-thumb:hover{background-color:var(--jtn-gray-200)}.jump-to-nav-wrapper .jump-to-nav [role=heading]{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:antialiased;font-weight:700}.jump-to-nav-wrapper .jump-to-nav [role=heading][aria-level="1"]{font-size:1.0625em}.jump-to-nav-wrapper .jump-to-nav [role=heading][aria-level="2"]{margin-bottom:.5em;font-size:.875em}.jump-to-nav-wrapper .jump-to-nav .jump-to-nav__item--active{font-weight:700}.jump-to-nav-wrapper.jump-to-nav-wrapper--showing .jump-to-nav{-webkit-clip-path:inset(0 0 0 0 round var(--jtn-border-radius));clip-path:inset(0 0 0 0 round var(--jtn-border-radius))}.jump-to-nav-wrapper.jump-to-nav-wrapper--showing .jump-to-nav>*{visibility:visible;transition-delay:0s;pointer-events:auto}.jump-to-nav-wrapper.jump-to-nav-wrapper--showing .jump-to-nav>* a:focus,.jump-to-nav-wrapper.jump-to-nav-wrapper--showing .jump-to-nav>* button:focus{outline:auto}.jump-to-nav-wrapper.jump-to-nav-wrapper--showing .jump-to-nav .jump-to-nav__maximize{display:none}.jump-to-nav-wrapper.jump-to-nav-wrapper--showing .jump-to-nav .jump-to-nav__body{overflow:auto}
`;
        
            // Apply in page styles to style tag
            embeddedStyleTag.textContent = jumpToCSS;
        
            // Add in page styles to head
            document.head.appendChild(embeddedStyleTag);
        }
    
    
        /* --------------------------------------------------------------------------
            Create navigation element and populate it
        ---------------------------------------------------------------------------- */
        
        //
        // Render nav elements
        //
    
        const navWrapperEl = document.createElement('div');
        navWrapperEl.classList.add('jump-to-nav-wrapper');
    
        const HTML = `<div class="jump-to-nav"><button class="jump-to-nav__maximize" type="button" aria-label="Maximize"><svg aria-hidden="true" width="8.5px" height="14.1px" viewBox="0 0 8.5 14.1" xml:space="preserve" style="pointer-events: none;"><style>.maximize-polygon {
                    fill: var(--jtn-text-color);
                }</style><polygon class="maximize-polygon" points="0,7.1 7.1,14.1 8.5,12.7 2.8,7.1 8.5,1.4 7.1,0 0,7.1 0,7.1 "></polygon></svg></button><div class="jump-to-nav__content"><div class="jump-to-nav__header"><div class="jump-to-nav__heading" role="heading" aria-level="1">On this page</div><button class="jump-to-nav__minimize" type="button" aria-label="Minimize"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" xml:space="preserve" style="pointer-events: none;"><style type="text/css">.minimize-line {
                            fill: none;
                            stroke: var(--jtn-text-color);
                            stroke-linecap: round;
                            stroke-linejoin: round;
                            stroke-miterlimit: 10;
                            stroke-width: 2px;
                        }</style><line class="minimize-line" x1="9" y1="14" x2="19" y2="14"/></svg></button></div><div class="jump-to-nav__body"><nav class="jump-to-nav__nav"></nav></div></div></div>`;
        navWrapperEl.innerHTML = HTML;
        document.body.appendChild(navWrapperEl);

        if (topLocation !== null) {
            navWrapperEl.style.top = topLocation;
        }
        
        if (zIndex !== null) {
            navWrapperEl.style.zIndex = zIndex;
        }


        //
        // Set custom heading if param is set
        //

        if (heading !== null) {
            const headingEl = navWrapperEl.querySelector('.jump-to-nav__heading');

            headingEl.textContent = heading;
        }
    
    
        //
        // Setup elements and add li and links
        //
    
        const navItem = document.querySelector('.jump-to-nav__nav');
        const navList = document.createElement('ul');
    
        navItem.appendChild(navList);
    
        // let searchTermsArray = [];
        
        jumpToSections.forEach((item, index) => {
            
            // Assign id if none is found
            if (!item.hasAttribute('id')) {
                item.setAttribute('id', 'jumpToSection' + index);
            }

            const linkID = item.getAttribute('id');
            const linkListItem = document.createElement('li');
            let options = null;
            
            linkListItem.classList.add('jump-to-nav__item');
            linkListItem.setAttribute('data-jump-id', linkID);
    
            options = {
                title: null
            };
    
            if (item.getAttribute('data-jtn-anchor') !== '') {
                const semiColonSplit = item.getAttribute('data-jtn-anchor').split(';');
                
                // Assign option values if any
                semiColonSplit.forEach(function (item, index) {
                    if (semiColonSplit[index].split('title:')[1] !== undefined) {
                        options.title = parseOption(semiColonSplit[index], 'title');
                    }
                });          
            }
    
            const linkTitleText = (options.title !== null) ? options.title : linkID;
            const linkATag = `
                <a href="#${ linkID }">${ linkTitleText }</a>
            `;
    
            linkListItem.innerHTML = linkATag;
    
            navList.appendChild(linkListItem);
    
            if (item.parentElement.closest('[data-jtn-anchor]')) {
                let parentListItem = item.parentElement.closest('[data-jtn-anchor]');
                parentListItem.setAttribute('data-jump-has-child', 'true');
                linkListItem.setAttribute('data-jump-parent', parentListItem.getAttribute('id'));    
            }
    
            // let searchTermsObj = {};
            // searchTermsObj['title'] = linkTitleText;
            // searchTermsObj['id'] = linkID;
            // searchTermsArray.push(searchTermsObj);
        });
    
    
        //
        // Nest li(s) if jumpToSections is nested
        //
    
        if (nest !== null) {
            const linkChildren = navItem.querySelectorAll('[data-jump-parent]');
    
            linkChildren.forEach((item, index) => {
                const parentItem = navItem.querySelector('[data-jump-id="' + item.getAttribute('data-jump-parent') + '"]');
        
                parentItem.appendChild(item);
            });
        
        
            //
            // Add ul inside items with children
            //
            
            const nestedChildren = navItem.querySelectorAll('[data-jump-id]');
            
            nestedChildren.forEach((item, index) => {
                if (item.querySelector('[data-jump-parent]')) {
                    var childUl = document.createElement('ul');
                    item.appendChild(childUl);
                }
            });
        
        
            //
            // Move unwrapped list items into ul
            //
        
            const unwrapListItems = navItem.querySelectorAll('[data-jump-id] > [data-jump-id]');
        
            unwrapListItems.forEach((item, index) => {
                const siblingUl = item.parentNode.lastChild;
        
                siblingUl.appendChild(item);
            });
        }
    
    
        //
        // Add smooth scroll when using jump to nav
        //
    
        if (smoothScroll !== null) {
            const navAnchor = navItem.querySelectorAll('.jump-to-nav__item > a');
    
            navAnchor.forEach((item, index) => {
                item.addEventListener('click', function (event) {
                    document.documentElement.classList.add('js-jump-to-nav-smooth-scroll');
                    
                    setTimeout(() => {
                        document.documentElement.classList.remove('js-jump-to-nav-smooth-scroll');
                    }, 400);
                });
            });
        }
    
    
        //
        // Maximize / minimize buttons
        //
    
        const maximizeButton = navWrapperEl.querySelector('.jump-to-nav__maximize');
    
        maximizeButton.addEventListener('click', function () {
            navWrapperEl.classList.add('jump-to-nav-wrapper--showing');
        });
    
        const minimizeButton = navWrapperEl.querySelector('.jump-to-nav__minimize');
    
        minimizeButton.addEventListener('click', function () {
            navWrapperEl.classList.remove('jump-to-nav-wrapper--showing');
        });
    
        // //=require partials/_click-outside.js
       
        // Run max height function
        setMaxHeight(navWrapperEl);

        // Run active section function
        if (activeSections !== null) {
            activeSection('[data-jtn-anchor]', '.jump-to-nav-wrapper');
        }
    }

    /* --------------------------------------------------------------------------
        Functions
    ---------------------------------------------------------------------------- */

    //
    // Parse options (function)
    //

    function parseOption(splitOn, optionString) {
        return splitOn.split(optionString + ':')[1].trim();
    }


    //
    // Set height for overflow scrolling if needed
    //

    function setMaxHeight(el) {
        const panelHeader = document.querySelector('.jump-to-nav__header');
        const panelBody = document.querySelector('.jump-to-nav__body');
        const topLocation = parseInt(el.getBoundingClientRect().top);
        const jumpToHeaderHeight = parseInt(panelHeader.offsetHeight);
        const maxHeight = (topLocation + jumpToHeaderHeight) + 60;

        panelBody.style.maxHeight = 'calc(100vh - ' + maxHeight + 'px)';
    }


    //
    // Set active class on nav item if section is in view
    //

    function activeSection(sectionsEl, navEl) {
        const jumpToSections = document.querySelectorAll(sectionsEl);
        const navItem = document.querySelector(navEl);
        const options = {
            root: null,
            threshold: .3,
            rootMargin: '10px'
        }
        
        const observer = new IntersectionObserver( (items, observer) => {
            items.forEach(item => {
                if (item.isIntersecting) {
                    navItem.querySelector('[data-jump-id="' + item.target.getAttribute('id') + '"]').classList.add('jump-to-nav__item--active');
                } else {
                    navItem.querySelector('[data-jump-id="' + item.target.getAttribute('id') + '"]').classList.remove('jump-to-nav__item--active');
                }
            })
        }, options);
        
        jumpToSections.forEach(section => {
            observer.observe(section);
        });
    }
})();
//# sourceMappingURL=jump-to-nav.js.map