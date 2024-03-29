/*!
    * Jump to navigation v1.3.1
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
    
    const jumpToElement = document.querySelectorAll('[data-jtn-anchor]');

    if (jumpToElement.length) {

        /* --------------------------------------------------------------------------
            Query params
        ---------------------------------------------------------------------------- */

        const scriptLinkage = document.getElementById('jump-to-nav-js') || document.querySelector('script[src*=jump-to-nav]');
        
        const param = {
            activeSections: null,
            topLocation: null,
            bottomLocation: null,
            autoClose: null,
            heading: null,
            zIndex: null,
            search: null,
            align: null,
            nest: null,
            css: null
        }
    
        if (scriptLinkage) {
            const urlParam = new URLSearchParams(scriptLinkage.getAttribute('src').split('?')[1]);
            
            param.activeSections = urlParam.get('active-section');
            param.topLocation = urlParam.get('top');
            param.bottomLocation = urlParam.get('bottom');
            param.autoClose = urlParam.get('auto-close');
            param.heading = urlParam.get('heading');
            param.zIndex = urlParam.get('z-index');
            param.search = urlParam.get('search');
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
        
            const jumpToCSS = `:root{--jtn-idle-width:40px;--jtn-base-font-size:16px;--jtn-small-font-size:12.5px;--jtn-ff-primary:"Helvetica Neue",Helvetica,Arial,sans-serif;--jtn-space-common:13px;--jtn-border-radius-small:4px;--jtn-border-radius-large:12px;--jtn-dialog-width:240px;--jtn-padding-y-common:10px;--jtn-padding-x-common:16px;--jtn-color-bg:#fff;--jtn-color-text:#333;--jtn-color-primary:#1f4de3;--jtn-gray-50:#f3f3f3;--jtn-gray-100:#e6e6e6;--jtn-gray-200:#cdcdcd;--jtn-color-border-common:rgba(0, 0, 0, 0.1);--jtn-color-highlight:rgba(0, 0, 0, .2);--jtn-transition-ease:cubic-bezier(0.85, 0, 0.15, 1);--jtn-transition-speed:200ms;--jtn-box-shadow-shallow:3px 5px 10px rgba(0, 0, 0, .13);--jtn-box-shadow-deep:3px 5px 25px rgba(0, 0, 0, .18);--jtn-filter-drop-shadow-deep:3px 5px 15px rgba(0, 0, 0, .18)}.jump-to-nav{position:fixed;top:100px;right:18px;pointer-events:none;font-size:var(--jtn-base-font-size)!important;filter:drop-shadow(var(--jtn-filter-drop-shadow-deep))}.jump-to-nav *{-webkit-font-smoothing:auto}.jump-to-nav *,.jump-to-nav :after,.jump-to-nav :before{box-sizing:border-box}.jump-to-nav .jump-to-nav__dialog{overflow:hidden;width:var(--jtn-dialog-width);height:auto;transition:-webkit-clip-path var(--jtn-transition-speed) var(--jtn-transition-ease);transition:clip-path var(--jtn-transition-speed) var(--jtn-transition-ease);transition:clip-path var(--jtn-transition-speed) var(--jtn-transition-ease),-webkit-clip-path var(--jtn-transition-speed) var(--jtn-transition-ease);color:var(--jtn-color-text);border-radius:var(--jtn-border-radius-large);background-color:var(--jtn-color-bg);font-family:var(--jtn-ff-primary);-webkit-clip-path:inset(0 0 calc(100% - var(--jtn-idle-width)) calc(100% - var(--jtn-idle-width)) round var(--jtn-border-radius-large));clip-path:inset(0 0 calc(100% - var(--jtn-idle-width)) calc(100% - var(--jtn-idle-width)) round var(--jtn-border-radius-large))}.jump-to-nav .jump-to-nav__dialog>:not(.jump-to-nav__maximize){visibility:hidden;transition:visibility var(--jtn-transition-speed) var(--jtn-transition-ease);transition-delay:var(--jtn-transition-speed);pointer-events:none}.jump-to-nav .jump-to-nav__dialog>:not(.jump-to-nav__maximize) a:focus,.jump-to-nav .jump-to-nav__dialog>:not(.jump-to-nav__maximize) button:focus{outline:0}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__maximize{position:absolute;top:0;right:0;display:flex;align-items:center;justify-content:center;width:var(--jtn-idle-width);height:var(--jtn-idle-width);cursor:pointer;pointer-events:auto;border:0;background-color:var(--jtn-color-bg)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__maximize svg{position:relative;right:1px;width:9px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__minimize{width:28px;height:28px;margin-left:auto;padding:0;cursor:pointer;border:0;border-radius:30px;background-color:transparent}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__minimize:hover{background-color:var(--jtn-gray-100)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__link{display:inline-block;margin-bottom:8px;text-decoration:none;color:var(--jtn-color-primary);font-size:var(--jtn-small-font-size);font-weight:400}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__list,.jump-to-nav .jump-to-nav__dialog .jump-to-nav__nested-list{margin-bottom:0;padding-left:0;list-style-type:none;line-height:1.2}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__list{margin-top:0;margin-left:-10px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__item{padding-left:10px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__item:has(.jump-to-nav__item--active)>.jump-to-nav__link{font-weight:500}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__header{display:flex;align-items:center;flex-wrap:wrap;min-height:50px;padding:var(--jtn-padding-y-common) var(--jtn-padding-x-common) 0 var(--jtn-padding-x-common);border-bottom:1px solid var(--jtn-color-border-common)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__body{padding:var(--jtn-padding-y-common) var(--jtn-padding-x-common);border-right:1px solid var(--jtn-color-bg)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__body::-webkit-scrollbar-corner{background-color:transparent}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__body::-webkit-scrollbar{width:5px;height:5px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__body::-webkit-scrollbar-track{background-color:transparent}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__body::-webkit-scrollbar-thumb{outline:0;background-color:var(--jtn-gray-100)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__body::-webkit-scrollbar-thumb:hover{background-color:var(--jtn-gray-200)}.jump-to-nav .jump-to-nav__dialog [role=heading]{font-weight:700;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:antialiased}.jump-to-nav .jump-to-nav__dialog [role=heading][aria-level="1"]{font-size:17px}.jump-to-nav .jump-to-nav__dialog [role=heading][aria-level="2"]{margin-bottom:8px;font-size:14px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__item--active>.jump-to-nav__link{font-weight:700}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search{position:relative;flex:0 0 100%;width:100%;margin:var(--jtn-space-common) 0;font-size:var(--jtn-small-font-size)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search.jump-to-nav__search--loading{visibility:hidden}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-icon{position:absolute;top:50%;left:13px;width:12px;height:12px;transform:translateY(-50%)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-icon path{fill:var(--jtn-color-text)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-input[type=text]{width:100%;margin:0;padding:var(--jtn-padding-y-common) 0 var(--jtn-padding-y-common) 32px;border:0;border-radius:var(--jtn-border-radius-small);background-color:var(--jtn-gray-50);box-shadow:none;font-family:var(--jtn-ff-primary);font-size:var(--jtn-small-font-size);line-height:1}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-input[type=text]:focus{outline-color:var(--jtn-color-primary)}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper{position:relative;flex:0 0 100%;width:100%}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper>ul{position:absolute;z-index:10;top:calc(100% + 5px);left:0;overflow:auto;width:100%;max-height:160px;margin:0;padding:0;list-style-type:none;border:1px solid var(--jtn-color-border-common);border-radius:var(--jtn-border-radius-small);background-color:var(--jtn-color-bg);box-shadow:var(--jtn-box-shadow-shallow)}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper li{padding:calc(var(--jtn-padding-x-common)/ 2) var(--jtn-padding-x-common);border-bottom:1px solid var(--jtn-gray-100);font-size:var(--jtn-small-font-size);font-weight:700;line-height:1.4}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper li:last-child{border-bottom:0}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper mark{padding:0;background-color:var(--jtn-gray-100)}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper [aria-selected=true]{color:var(--jtn-color-bg);background-color:var(--jtn-color-primary)}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper [aria-selected=true] mark{color:var(--jtn-color-bg);background-color:var(--jtn-color-highlight)}.jump-to-nav.jump-to-nav--showing{pointer-events:auto}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog{-webkit-clip-path:inset(0 0 0 0 round var(--jtn-border-radius-large));clip-path:inset(0 0 0 0 round var(--jtn-border-radius-large))}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog>*{visibility:visible;transition-delay:0s;pointer-events:auto}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog>* a:focus,.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog>* button:focus{outline:auto}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog .jump-to-nav__maximize{display:none}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog .jump-to-nav__body{overflow:auto}
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
        navWrapperEl.classList.add('jump-to-nav');
    
        const HTML = `<div class="jump-to-nav__dialog"><button class="jump-to-nav__maximize" type="button" aria-label="Maximize"><svg aria-hidden="true" width="8.5px" height="14.1px" viewBox="0 0 8.5 14.1" xml:space="preserve" style="pointer-events: none;"><style>.maximize-polygon {
                    fill: var(--jtn-color-text);
                }</style><polygon class="maximize-polygon" points="0,7.1 7.1,14.1 8.5,12.7 2.8,7.1 8.5,1.4 7.1,0 0,7.1 0,7.1 "></polygon></svg></button><div class="jump-to-nav__content"><div class="jump-to-nav__header"><div class="jump-to-nav__heading" role="heading" aria-level="1">On this page</div><button class="jump-to-nav__minimize" type="button" aria-label="Minimize"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" xml:space="preserve" style="pointer-events: none;"><style type="text/css">.minimize-line {
                            fill: none;
                            stroke: var(--jtn-color-text);
                            stroke-linecap: round;
                            stroke-linejoin: round;
                            stroke-miterlimit: 10;
                            stroke-width: 2px;
                        }</style><line class="minimize-line" x1="9" y1="14" x2="19" y2="14"/></svg></button><div class="jump-to-nav__search jump-to-nav__search--loading"><input id="autoComplete" class="jump-to-nav__search-input" type="text" placeholder="Search" autocomplete="off"> <svg class="jump-to-nav__search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg></div></div><div class="jump-to-nav__body"><nav class="jump-to-nav__nav"></nav></div></div></div>`;
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
                    navWrapperEl.classList.add('jump-to-nav--align-' + item);
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
    
        let searchTermsTitle = [];
        let searchTermsID = [];
        
        jumpToElement.forEach((item, index) => {

            let options = null;
            options = {
                title: null
            };
    
            if (item.getAttribute('data-jtn-anchor') !== '') {
                const semiColonSplit = item.getAttribute('data-jtn-anchor').split(';');
                
                // Assign option values if any
                semiColonSplit.forEach((item, index) => {
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
    
            searchTermsTitle.push(linkTitleText);
            searchTermsID.push(linkID);

        });


        //
        // Link clicks. Use scrollIntoView instead of browser default so I can hyjack the focus to the search element (if need-be).
        //

        const jumpToLink = navWrapperEl.querySelectorAll('.jump-to-nav__link');
        jumpToLink.forEach((item) => {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                const targetID = item.getAttribute('href').replace('#', '');
                document.getElementById(targetID).scrollIntoView({
                    behavior: 'smooth'
                });
                history.pushState(null, null, `#${targetID}`);
            });
        });


        const searchEl = document.querySelector('.jump-to-nav__search');
        if (param.search !== null) {
            // Thanks to autoComplete.js and js CDN. Project repo: https://github.com/TarekRaafat/autoComplete.js
            const autoCompleteLinkage = `https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/autoComplete.min.js`;
            const script = document.createElement('script');
            script.onload = function () {
                const autoCompleteJS = new autoComplete({
                    placeHolder: 'Search',
                    data: {
                        src: searchTermsTitle
                    },
                    resultItem: {
                        highlight: true,
                    },
                    events: {
                        input: {
                            focus() {
                                if (autoCompleteJS.input.value.length) {
                                    autoCompleteJS.start();
                                }
                            },
                            selection(event) {
                                const feedback = event.detail;
                                
                                const selection = feedback.selection.value;
                                autoCompleteJS.input.value = selection;
                                autoCompleteJS.input.select();
                                
                                const associatedLink = navWrapperEl.querySelector(`[href="#${searchTermsID[findIndex(autoCompleteJS.data.src, selection)]}"]`)
                                associatedLink.click();
                            },
                            keyup(event) {
                                if (event.key === 'Enter' && !navWrapperEl.querySelector(`[aria-selected="true"]`)) {
                                    const firstSuggestion = navWrapperEl.querySelector(`#autoComplete_result_0`);
                                    firstSuggestion.click();
                                    autoCompleteJS.input.select();
                                }
                            },
                        },
                    },
                });
                searchEl.classList.remove('jump-to-nav__search--loading');
            };
            script.src = autoCompleteLinkage;
            document.head.appendChild(script);
        } else {
            searchEl.remove();
        }

    
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
        // Maximize / minimize buttons
        //
    
        const maximizeButton = navWrapperEl.querySelector('.jump-to-nav__maximize');
    
        maximizeButton.addEventListener('click', function () {
            navWrapperEl.classList.add('jump-to-nav--showing');
        });
    
        const minimizeButton = navWrapperEl.querySelector('.jump-to-nav__minimize');
    
        minimizeButton.addEventListener('click', function () {
            navWrapperEl.classList.remove('jump-to-nav--showing');
        });
    

        //       
        // Run max height function
        //
        setMaxHeight(navWrapperEl);


        //
        // Run active section function
        //

        if (param.activeSections !== null) {
            activeSection('[data-jtn-anchor]', '.jump-to-nav');
        }


        //
        // Click outside
        //

        if (param.autoClose !== null) {
            document.addEventListener('click', function (event) {
                const withinBoundaries = event.composedPath().includes(navWrapperEl);
                
                if (navWrapperEl.classList.contains('jump-to-nav--showing')) {
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
            rootMargin: '0px 0px -20% 0px',
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


    //
    // Find index of array item
    //

    function findIndex(arr, searchValue ){
        for (let i = 0; i < arr.length; ++i) {
            if (arr[i] === searchValue) {
                return i;
            }
            }
        }
})();
//# sourceMappingURL=jump-to-nav.js.map