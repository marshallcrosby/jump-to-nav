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