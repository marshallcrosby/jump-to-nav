/*!
    * Jump to navigation v1.0.2
    * Need description.
    *
    * Copyright 2022 Marshall Crosby
    * https://marshallcrosby.com
*/


/* ------------------------------------------------------------------------------
    **TODO:
    ✓ 1. Query params
        • Allow custom Y location
        • Make nesting an option
        • Allow custom z-index
        • Allow external css
    ✓ 2. Click outside closes panel
    ✓ 3. CSS dynamic max-height
    4. Focus nav item on current section in view
    5. Add static site navigation
-------------------------------------------------------------------------------- */


let jumpToSections = document.querySelectorAll('[data-jtn-anchor]');

console.log(jumpToSections.length);

(function () {
    "use strict"


    if (jumpToSections.length > 0) {

        /* --------------------------------------------------------------------------
            Query params
        ---------------------------------------------------------------------------- */
    
        let scriptLinkage = document.getElementById('jump-to-nav-js');
        let smoothScroll = null;
        let topLocation = null;
        let zIndex = null;
        let nest = null;
        let css = null;
    
        if (scriptLinkage) {
            let urlParam = new URLSearchParams(scriptLinkage.getAttribute('src').split('?')[1]);
            
            smoothScroll = urlParam.get('smooth');
            topLocation = urlParam.get('top');
            zIndex = urlParam.get('z-index');
            nest = urlParam.get('nest');
            css = urlParam.get('css');
        }
    
    
        /* --------------------------------------------------------------------------
            Render nav css
        ---------------------------------------------------------------------------- */
    
        if (css !== 'external') {
            let textStyle = document.createElement('style');
            textStyle.setAttribute('id', 'jumpToNavStyle');
        
            let jumpToCSS = `//import jump-to-nav.css`;
        
            // Apply in page styles to style tag
            textStyle.textContent = jumpToCSS;
        
            // Add in page styles to head
            document.head.appendChild(textStyle);
        }
    
    
        /* --------------------------------------------------------------------------
            Create navigation element and populat it
        ---------------------------------------------------------------------------- */
        
        //
        // Render nav elements
        //
    
        let wrapperEl = document.createElement('div');
        wrapperEl.classList.add('jump-to-nav-wrapper');
    
        let HTML = `//import _jump-to-nav.html`;
        wrapperEl.innerHTML = HTML;
        document.body.appendChild(wrapperEl);

        console.log('test');
    
        if (topLocation !== null) {
            wrapperEl.style.top = topLocation;
        }
        
        if (zIndex !== null) {
            wrapperEl.style.zIndex = zIndex;
        }
    
    
        //
        // Setup elements and add li and links
        //
    
        let navEl = document.querySelector('.jump-to-nav__nav');
        let navList = document.createElement('ul');
    
        navEl.appendChild(navList);
    
        // let searchTermsArray = [];
        
        jumpToSections.forEach(function (item, index) {
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
    
            navList.appendChild(linkListItem);
    
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
        // Nest li(s) if jumpToSections is nested
        //
    
        if (nest !== null) {
            let linkChildren = navEl.querySelectorAll('[data-jtn-parent]');
    
            linkChildren.forEach(function(item, index) {
                let parentItem = navEl.querySelector('[data-jtn-id="' + item.getAttribute('data-jtn-parent') + '"]');
        
                parentItem.appendChild(item);
            });
        
        
            //
            // Add ul inside items with children
            //
            
            let nestedChildren = navEl.querySelectorAll('[data-jtn-id]');
            
            nestedChildren.forEach(function(item, index) {
                if (item.querySelector('[data-jtn-parent]')) {
                    var childUl = document.createElement('ul');
                    item.appendChild(childUl);
                }
            });
        
        
            //
            // Move unwrapped list items into ul
            //
        
            let unwrapListItems = navEl.querySelectorAll('[data-jtn-id] > [data-jtn-id]');
        
            unwrapListItems.forEach(function(item, index) {
                let siblingUl = item.parentNode.lastChild;
        
                siblingUl.appendChild(item);
            });
        }
    
    
        //
        // Add smooth scroll when using jump to nav
        //
    
        if (smoothScroll !== null) {
            let navAnchor = navEl.querySelectorAll('.jump-to-nav__item > a');
    
            navAnchor.forEach(function (item, index) {
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
    
        let maximizeButton = wrapperEl.querySelector('.jump-to-nav__maximize');
    
        maximizeButton.addEventListener('click', function () {
            wrapperEl.classList.add('jump-to-nav-wrapper--showing');
        });
    
        let minimizeButton = wrapperEl.querySelector('.jump-to-nav__minimize');
    
        minimizeButton.addEventListener('click', function () {
            wrapperEl.classList.remove('jump-to-nav-wrapper--showing');
        });
    
    
        //
        // Click outside
        //
        
        document.addEventListener('click', function (event) {
            let withinBoundaries = event.composedPath().includes(wrapperEl);
            
            if (wrapperEl.classList.contains('jump-to-nav-wrapper--showing')) {
                if (!withinBoundaries) {
                    minimizeButton.click();
                }
            }
        });
       
        setMaxHeight(wrapperEl);
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
        let panelHeader = document.querySelector('.jump-to-nav__header');
        let panelBody = document.querySelector('.jump-to-nav__body');
        let topLocation = parseInt(el.getBoundingClientRect().top);
        let jumpToHeaderHeight = parseInt(panelHeader.offsetHeight);
        let maxHeight = (topLocation + jumpToHeaderHeight) + 60;

        panelBody.style.maxHeight = 'calc(100vh - ' + maxHeight + 'px)';
    }
})();