/*!
    * Jump to navigation v1.0.0
    * Need description.
    *
    * Copyright 2022 Marshall Crosby
    * https://marshallcrosby.com
*/


/* --------------------------------------------------------------------------
    **TODO:
    ✓ 1. Query params
        • Allow custom Y location
        • Make nesting an option
        • Allow custom z-index
    ✓ 2. Click outside closes panel
    3. CSS dynamic max-height
    4. Focus nav item on current section in view
    5. Add static site navigation
---------------------------------------------------------------------------- */


(function () {
    "use strict"


    /* --------------------------------------------------------------------------
        Get query params if any
    ---------------------------------------------------------------------------- */

    let scriptLinkage = document.getElementById('jump-to-nav-js');
    let topLocation = null;
    let nest = null;
    let zIndex = null;
    let smoothScroll = null;

    if (scriptLinkage) {
        let urlParam = new URLSearchParams(scriptLinkage.getAttribute('src').split('?')[1]);
        topLocation = urlParam.get('top');
        nest = urlParam.get('nest');
        zIndex = urlParam.get('z-index');
        smoothScroll = urlParam.get('smooth');
    }


    /* --------------------------------------------------------------------------
        Create navigation element and populated it
    ---------------------------------------------------------------------------- */
    
    //
    // Render nav elements
    //

    let jumpToWrapperEl = document.createElement('div');
    jumpToWrapperEl.classList.add('jump-to-nav-wrapper');

    let jumpToHTML = `//import _jump-to-nav.html`;
    jumpToWrapperEl.innerHTML = jumpToHTML;
    document.body.appendChild(jumpToWrapperEl);

    if (topLocation !== null) {
        jumpToWrapperEl.style.top = topLocation;
    }
    
    if (zIndex !== null) {
        jumpToWrapperEl.style.zIndex = zIndex;
    }


    //
    // Render nav css
    //

    let textStyle = document.createElement('style');
    textStyle.setAttribute('id', 'jumpToNavStyle');

    let jumpToCSS = `//import jump-to-nav.css`;

    // Apply in page styles to style tag
    textStyle.textContent = jumpToCSS;

    // Add in page styles to head
    document.head.appendChild(textStyle);


    //
    // Setup elements and add li and links
    //

    let jumpToNavEl = document.querySelector('.jump-to-nav__nav');
    let styleguidNavList = document.createElement('ul');

    jumpToNavEl.appendChild(styleguidNavList);

    let jumpToSection = document.querySelectorAll('[data-jtn-anchor]');
    // let searchTermsArray = [];
    
    jumpToSection.forEach(function (item, index) {
        let linkID = item.getAttribute('id');
        let linkListItem = document.createElement('li');
        let options = null;
        
        linkListItem.classList.add('jump-to-nav__item');
        linkListItem.setAttribute('data-jtn-id', linkID);

        options = {
            title: null
        };

        if (item.getAttribute('data-jtn-anchor') !== '') {
            let semiColonSplit = item.getAttribute('data-jtn-anchor').split(';');
            
            // Assign option values if any
            semiColonSplit.forEach(function (item, index) {
                if (semiColonSplit[index].split('title:')[1] !== undefined) {
                    options.title = parseOption(semiColonSplit[index], 'title');
                }
            });          
        }

        let linkTitleText = (options.title !== null) ? options.title : linkID;
        let linkATag = `
            <a href="#${ linkID }">${ linkTitleText }</a>
        `;

        linkListItem.innerHTML = linkATag;

        styleguidNavList.appendChild(linkListItem);

        if (item.parentElement.closest('[data-jtn-anchor]')) {
            let parentListItem = item.parentElement.closest('[data-jtn-anchor]');
            parentListItem.setAttribute('data-jtn-has-child', 'true');
            linkListItem.setAttribute('data-jtn-parent', parentListItem.getAttribute('id'));    
        }

        // let searchTermsObj = {};
        // searchTermsObj['title'] = linkTitleText;
        // searchTermsObj['id'] = linkID;
        // searchTermsArray.push(searchTermsObj);
    });


    //
    // Nest li(s) if section is nested
    //

    if (nest !== null) {
        let jumpToLinkChildren = jumpToNavEl.querySelectorAll('[data-jtn-parent]');

        jumpToLinkChildren.forEach(function(item, index) {
            let parentItem = jumpToNavEl.querySelector('[data-jtn-id="' + item.getAttribute('data-jtn-parent') + '"]');
    
            parentItem.appendChild(item);
        });
    
    
        //
        // Add ul inside items with children
        //
        
        let jumpToNestedChildren = jumpToNavEl.querySelectorAll('[data-jtn-id]');
        
        jumpToNestedChildren.forEach(function(item, index) {
            if (item.querySelector('[data-jtn-parent]')) {
                var childUl = document.createElement('ul');
                item.appendChild(childUl);
            }
        });
    
    
        //
        // Move unwrapped list items into ul
        //
    
        let unwrappedListItems = jumpToNavEl.querySelectorAll('[data-jtn-id] > [data-jtn-id]');
    
        unwrappedListItems.forEach(function(item, index) {
            let siblingUl = item.parentNode.lastChild;
    
            siblingUl.appendChild(item);
        });
    }


    //
    // Add smooth scroll when using jump to nav
    //

    if (smoothScroll !== null) {
        let jumpToNavAnchor = jumpToNavEl.querySelectorAll('.jump-to-nav__item > a');

        jumpToNavAnchor.forEach(function (item, index) {
            item.addEventListener('click', function (event) {
                document.documentElement.classList.add('js-jump-to-nav-smooth-scroll');
                
                setTimeout(function () {
                    document.documentElement.classList.remove('js-jump-to-nav-smooth-scroll');
                }, 400);
            });
        });
    }

    

    //
    // Maximize / minimize buttons
    //

    let maximizeButton = jumpToWrapperEl.querySelector('.jump-to-nav__maximize');

    maximizeButton.addEventListener('click', function () {
        jumpToWrapperEl.classList.add('jump-to-nav-wrapper--showing');
    });

    let minimizeButton = jumpToWrapperEl.querySelector('.jump-to-nav__minimize');

    minimizeButton.addEventListener('click', function () {
        jumpToWrapperEl.classList.remove('jump-to-nav-wrapper--showing');
    });


    //
    // Click outside
    //
    
    document.addEventListener('click', function(event) {
        let withinBoundaries = event.composedPath().includes(jumpToWrapperEl);
        
        if (jumpToWrapperEl.classList.contains('jump-to-nav-wrapper--showing')) {
            if (!withinBoundaries) {
                minimizeButton.click();
            }
        }
    });


    //
    // Set height for overflow scrolling if needed
    //

    function setMaxHeight(el) {
        let panelHeader = document.querySelector('.jump-to-nav__header');
        let panelBody = document.querySelector('.jump-to-nav__body');
        let topLocation = parseInt(el.getBoundingClientRect().top);
        let jumpToHeaderHeight = parseInt(panelHeader.offsetHeight);
        let maxHeight = (topLocation + jumpToHeaderHeight) + 40;

        panelBody.style.maxHeight = 'calc(100vh - ' + maxHeight + 'px)';
    }

    setMaxHeight(jumpToWrapperEl);

    
    /* --------------------------------------------------------------------------
        Functions
    ---------------------------------------------------------------------------- */

    //
    // Parse options (function)
    //

    function parseOption(splitOn, optionString) {
        return splitOn.split(optionString + ':')[1].trim();
    }
})();
