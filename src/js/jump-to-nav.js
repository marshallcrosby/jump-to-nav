/*!
    * Jump to navigation v1.1.9
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
        • Placement (left, right, top, bottom, custom)
    ✓ 2. Click outside closes panel
    ✓ 3. CSS dynamic max-height
    ✓ 4. Focus nav item on current section in view
    5. Add static site navigation
    ✓ 6. Dynamic IDs if none
    7. Better verbiage/names
    8. Direction of menu opening
-------------------------------------------------------------------------------- */



(function () {
    "use strict"
    
    window.addEventListener('load', function () {
        const jumpToElement = document.querySelectorAll('[data-jtn-anchor]');

        if (jumpToElement !== null) {
    
            /* --------------------------------------------------------------------------
                Query params
            ---------------------------------------------------------------------------- */
    
            const scriptLinkage = document.getElementById('jump-to-nav-js') || document.querySelector('script[src*=jump-to-nav]');
            
            const param = {
               activeSections: null,
               smoothScroll: null,
               topLocation: null,
               bottomLocation: null,
               autoClose: null,
               heading: null,
               zIndex: null,
               align: null,
               nest: null,
               css: null
            }
        
            if (scriptLinkage) {
                const urlParam = new URLSearchParams(scriptLinkage.getAttribute('src').split('?')[1]);
                
                param.activeSections = urlParam.get('active-section');
                param.smoothScroll = urlParam.get('smooth');
                param.topLocation = urlParam.get('top');
                param.bottomLocation = urlParam.get('bottom');
                param.autoClose = urlParam.get('auto-close');
                param.heading = urlParam.get('heading');
                param.zIndex = urlParam.get('z-index');
                param.align = urlParam.get('align');
                param.nest = urlParam.get('nest');
                param.css = urlParam.get('css');
            }
        
        
            /* --------------------------------------------------------------------------
                Render nav css
            ---------------------------------------------------------------------------- */
        
            if (param.css !== 'external') {
                const embeddedStyleTag = document.createElement('style');
                embeddedStyleTag.setAttribute('id', 'jumpToNavStyle');
            
                const jumpToCSS = `//import jump-to-nav.css`;
            
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
        
            const HTML = `//import _jump-to-nav.html`;
            navWrapperEl.innerHTML = HTML;
            document.body.appendChild(navWrapperEl);
    
            if (param.topLocation !== null) {
                navWrapperEl.style.top = param.topLocation;
            }
            
            if (param.bottomLocation !== null) {
                navWrapperEl.style.top = 'auto';
                navWrapperEl.style.bottom = param.bottomLocation;
            }
            
            if (param.zIndex !== null) {
                navWrapperEl.style.zIndex = param.zIndex;
            }
    
    
            //
            // Alignment
            //
    
            if (param.align !== null) {
                const alignment = param.align.split(',');
    
                if (alignment !== '') {
                    alignment.forEach((item) => {
                        navWrapperEl.classList.add('jump-to-nav-wrapper--align-' + item);
                    });
                }
            }
    
    
            //
            // Set custom heading if param is set
            //
    
            if (param.heading !== null) {
                const headingEl = navWrapperEl.querySelector('.jump-to-nav__heading');
    
                headingEl.textContent = param.heading;
            }
        
        
            //
            // Setup elements and add li and links
            //
        
            const navItem = document.querySelector('.jump-to-nav__nav');
            const navList = document.createElement('ul');
            navList.classList.add('jump-to-nav__list');
        
            navItem.appendChild(navList);
        
            // let searchTermsArray = [];
            
            jumpToElement.forEach((item, index) => {
    
                let options = null;
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
                
                // Assign id if none is found
                if (!item.hasAttribute('id')) {
                    let titleClean = options.title.replace(/[^a-z0-9]/gi, ' ');
                    let titleReady = camelize(titleClean);
                    item.setAttribute('id', titleReady);
                }
    
                const linkID = item.getAttribute('id');
                const linkListItem = document.createElement('li');
                
                linkListItem.classList.add('jump-to-nav__item');
                linkListItem.setAttribute('data-jump-id', linkID);
                    
                const linkTitleText = (options.title !== null) ? options.title : linkID;
                const linkATag = `
                    <a class="jump-to-nav__link" href="#${ linkID }">${ linkTitleText }</a>
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
            // Nest li(s) if jumpToElement is nested
            //
        
            if (param.nest !== null) {
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
                        childUl.classList.add('jump-to-nav__nested-list')
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
        
            if (param.smoothScroll !== null) {
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
        
    
            //       
            // Run max height function
            //
            setMaxHeight(navWrapperEl);
    
    
            //
            // Run active section function
            //
    
            if (param.activeSections !== null) {
                activeSection('[data-jtn-anchor]', '.jump-to-nav-wrapper');
            }
    
    
            //
            // Click outside
            //
    
            if (param.autoClose !== null) {
                document.addEventListener('click', function (event) {
                    const withinBoundaries = event.composedPath().includes(navWrapperEl);
                    
                    if (navWrapperEl.classList.contains('jump-to-nav-wrapper--showing')) {
                        if (!withinBoundaries) {
                            minimizeButton.click();
                        }
                    }
                });
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
            const jumpToElement = document.querySelectorAll(sectionsEl);
            const navItem = document.querySelector(navEl);
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            }
            
            const observer = new IntersectionObserver( (items, observer) => {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].isIntersecting) {
                        navItem.querySelector('[data-jump-id="' + items[i].target.getAttribute('id') + '"]').classList.add('jump-to-nav__item--active');
                    } else {
                        navItem.querySelector('[data-jump-id="' + items[i].target.getAttribute('id') + '"]').classList.remove('jump-to-nav__item--active');
                    }
                }
            }, options);
    
            for (let i = 0; i < jumpToElement.length; i++) {
                observer.observe(jumpToElement[i]);
            }
        }
    
        //
        // Camel case string
        //
    
        function camelize(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
            if (+match === 0) return "";
                return index === 0 ? match.toLowerCase() : match.toUpperCase();
            });
        }
    });
})();