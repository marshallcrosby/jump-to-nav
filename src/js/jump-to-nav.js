/*!
    * Jump to navigation v1.3.8
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
    9. Polish up a11y
-------------------------------------------------------------------------------- */



(function () {
    "use strict"
    
    const jumpToElement = document.querySelectorAll('[data-jtn-anchor]');

    if (jumpToElement.length) {

        Element.prototype.setAttributes = function (attrs) {
            for(let key in attrs) {
                this.setAttribute(key, attrs[key]);
            }
        };

        /* --------------------------------------------------------------------------
            Query params
        ---------------------------------------------------------------------------- */

        const scriptLinkage = document.getElementById('jump-to-nav-js') || document.querySelector('script[src*=jump-to-nav]');
        
        const param = {
            collapseNested: null,
            activeSections: null,
            topLocation: null,
            linkCopy: null,
            bottomLocation: null,
            autoClose: null,
            heading: null,
            zIndex: null,
            search: null,
            showSearchAfter: null,
            searchFocus: null,
            align: null,
            nest: null,
            css: null
        }
    
        if (scriptLinkage) {
            const urlParam = new URLSearchParams(scriptLinkage.getAttribute('src').split('?')[1]);
            
            param.collapseNested = urlParam.get('collapse-nested');
            param.activeSections = urlParam.get('active-section');
            param.topLocation = urlParam.get('top');
            param.linkCopy = urlParam.get('link-copy');
            param.bottomLocation = urlParam.get('bottom');
            param.autoClose = urlParam.get('auto-close');
            param.heading = urlParam.get('heading');
            param.zIndex = urlParam.get('z-index');
            param.search = urlParam.get('search');
            param.showSearchAfter = urlParam.get('show-search-after');
            param.searchFocus = urlParam.get('search-focus');
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
        navWrapperEl.classList.add('jump-to-nav');
    
        const HTML = `//import _jump-to-nav.html`;
        navWrapperEl.innerHTML = HTML;
        document.body.appendChild(navWrapperEl);

        if (param.topLocation !== null) {
            document.documentElement.style.setProperty('--jtn-top-location', param.topLocation);
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
    
        const navElement = document.querySelector('.jump-to-nav__nav');
        const navList = document.createElement('ul');
        navList.classList.add('jump-to-nav__list');
    
        navElement.appendChild(navList);
    
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
                <a class="jump-to-nav__link" href="#${ linkID }">
                    <span>${linkTitleText}</span>
                </a>
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
        // Add copy button to each anchor link
        //

        const itemControls = navElement.querySelector('.jump-to-nav__item-controls');
        
        if (param.linkCopy !== null) {
            const navListItem = navList.querySelectorAll('li');
            
            navListItem.forEach((item) => {
                item.appendChild(itemControls.cloneNode(true));
            });
            
            itemControls.remove();

            const linkCopyButtonEl = navList.querySelectorAll('.jump-to-nav__copy-button');

            linkCopyButtonEl.forEach((item) => {
                item.addEventListener('click', () => {
                    const linkHash = item.closest('.jump-to-nav__item').querySelector('.jump-to-nav__link').getAttribute('href');
                    const currentUrl = window.location.href.split('#');
                   
                    navigator.clipboard.writeText(currentUrl[0] + linkHash);
                    item.closest('.jump-to-nav__item').querySelector('.jump-to-nav__copy-bubble').innerText = 'Copied';
                });

                item.addEventListener('mouseout', function () {
                    let itemBubble = item.closest('.jump-to-nav__item').querySelector('.jump-to-nav__copy-bubble');
                    let itemBubbleText = itemBubble.innerText.toLowerCase();
                    
                    if (itemBubbleText.includes('copied')) {
                        setTimeout(function () {
                            itemBubble.innerText = 'Copy link';
                        }, 100);
                    }
                });
            });
        } else {
            navElement.querySelectorAll('.jump-to-nav__copy-button, .jump-to-nav__copy-bubble').forEach(item => item.remove());
        }

        
        const searchEl = document.querySelector('.jump-to-nav__search');
        const searchInput = searchEl.querySelector('.jump-to-nav__search-input');
        const navItem = navElement.querySelectorAll('.jump-to-nav__item');

        if (param.search !== null || navItem.length >= parseInt(param.showSearchAfter) ) {
            
            // Thanks to autoComplete.js. Project repo: https://github.com/TarekRaafat/autoComplete.js
            const autoCompleteLinkage = `https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/autoComplete.min.js`;
            const script = document.createElement('script');
            
            script.onload = function () {
                const autoCompleteJS = new autoComplete({
                    selector: "#jumpToNavAutoComplete",
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
                
                searchInput.addEventListener('input', () => {
                    if (searchInput && searchInput.value) {
                        searchEl.classList.add('jump-to-nav__search--has-value');
                    } else {
                        searchEl.classList.remove('jump-to-nav__search--has-value');
                    }
                });

                const searchClear = searchEl.querySelector('.jump-to-nav__search-clear');
                searchClear.addEventListener('click', () => {
                    searchInput.value = '';
                    searchEl.classList.remove('jump-to-nav__search--has-value');
                    searchInput.focus();
                })

                searchEl.classList.remove('jump-to-nav__search--loading');
            };
            script.src = autoCompleteLinkage;
            document.head.appendChild(script);
        } else {
            searchEl.remove();
        }

        //
        // Link clicks. Use scrollIntoView instead of browser default so I can hyjack the focus to the search element (if need-be).
        //

        const jumpToLink = navWrapperEl.querySelectorAll('.jump-to-nav__link');
        
        jumpToLink.forEach((item) => {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                const targetID = item.getAttribute('href').replace('#', '');
                
                scrollParentToChild(document.querySelector('.jump-to-nav__body'), item);

                document.getElementById(targetID).scrollIntoView({
                    behavior: 'smooth'
                });

                history.pushState(null, null, `#${targetID}`);
                
                if (searchEl) {
                    searchInput.value = item.innerText;
                    searchEl.classList.add('jump-to-nav__search--has-value');
                }

            });
        });

    
        //
        // Nest li(s) if jumpToElement is nested
        //
    
        if (param.nest !== null) {
            const linkChildren = navElement.querySelectorAll('[data-jump-parent]');
    
            linkChildren.forEach((item, index) => {
                const parentItem = navElement.querySelector('[data-jump-id="' + item.getAttribute('data-jump-parent') + '"]');
                parentItem.classList.add('jump-to-nav__item--parent');
        
                parentItem.appendChild(item);
            });
        
        
            //
            // Add ul inside items with children
            //
            
            const nestedChildren = navElement.querySelectorAll('[data-jump-id]');
            
            nestedChildren.forEach((item, index) => {
                if (item.querySelector('[data-jump-parent]')) {
                    
                    const childUl = document.createElement('ul');
                    childUl.classList.add('jump-to-nav__nested-list')
                    item.appendChild(childUl);
                }
            });
        
        
            //
            // Move unwrapped list items into ul
            //
        
            const unwrapListItems = navElement.querySelectorAll('[data-jump-id] > [data-jump-id]');
        
            unwrapListItems.forEach((item, index) => {
                const siblingUl = item.parentNode.lastChild;
        
                siblingUl.appendChild(item);
            });


            if (param.collapseNested !== null) {

                //
                // Children expand button
                //

                const navListItem = navList.querySelectorAll('li');
            
                navListItem.forEach((item) => {
                    item.appendChild(itemControls.cloneNode(true));
                });
    
                const childrenControls = navElement.querySelectorAll('.jump-to-nav__item--parent > .jump-to-nav__item-controls');
                
                childrenControls.forEach((item, index) => {
                    const expandButton = document.createElement('div');
                    expandButton.classList.add('jump-to-nav__expand-button');
                    expandButton.setAttributes({
                        'role': 'button',
                        'aria-label': 'Show',
                        'aria-expanded': 'false',
                        'tabindex': '0'
                    });
                    expandButton.innerHTML = /* html */`
                        <svg version="1.1" x="0px" y="0px" viewBox="0 0 14.1 8.5" style="enable-background:new 0 0 14.1 8.5;" xml:space="preserve">
                            <polygon points="7.1,8.5 14.1,1.4 12.7,0 7.1,5.7 1.4,0 0,1.4 7.1,8.5 "/>
                        </svg>
                    `;
                    item.appendChild(expandButton);
    
                    expandButton.addEventListener('click', function () {
                        if (this.getAttribute('aria-expanded') === 'false') {
                            this.setAttribute('aria-expanded', 'true');
                            this
                                .closest('.jump-to-nav__item')
                                .querySelector('.jump-to-nav__nested-list')
                                .classList.add('jump-to-nav__nested-list--showing');
                        } else {
                            this.setAttribute('aria-expanded', 'false');
                            this
                                .closest('.jump-to-nav__item')
                                .querySelector('.jump-to-nav__nested-list')
                                .classList.remove('jump-to-nav__nested-list--showing');
                        }
                    });
                });
            }
        }
    
    
        //
        // Maximize / minimize buttons
        //
    
        const maximizeButton = navWrapperEl.querySelector('.jump-to-nav__maximize');
    
        maximizeButton.addEventListener('click', function () {
            navWrapperEl.classList.add('jump-to-nav--showing');

            if (param.searchFocus !== null) {
                setTimeout(function () {
                    searchInput.value = '';
                    searchInput.focus();
                }, 100);
            }
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
            // activeSection('[data-jtn-anchor]', '.jump-to-nav');

            const sections = document.querySelectorAll('[data-jtn-anchor]');
            const menu_links = document.querySelectorAll('.jump-to-nav__nav a');
            const sectionMargin = 200;
            let currentActive = 0;

            const makeActive = (link) => {
                menu_links[link].parentNode.classList.add('jump-to-nav__item--active');
            };

            const removeActive = (link) => {
                menu_links[link].parentNode.classList.remove('jump-to-nav__item--active');
            };

            const removeAllActive = () => {
                [...Array(sections.length).keys()].forEach((link) => removeActive(link));
            };
            
            // listen for scroll events
            window.addEventListener('scroll', () => {
                const current = sections.length - [...sections].reverse().findIndex((section) => window.scrollY >= section.offsetTop - sectionMargin) - 1;

                if (current !== currentActive) {
                    removeAllActive();
                    currentActive = current;
                    makeActive(current);
                }
            });
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

        if (param.collapseNested !== null) {
            navWrapperEl.classList.add('jump-to-nav--collapse-nested');
        }


        //
        // Make div with role=button act like an actual button for a11y reasons
        //
        
        document.querySelectorAll('div[role="button"]').forEach((item) => {
            item.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.code === 'Space') {
                    event.preventDefault();
                    this.click();
                }
            });
        });
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
        const navElement = document.querySelector(navEl);
        const options = {
            root: null,
            rootMargin: '0px 0px -20%',
            threshold: 0.5
        }
        
        const observer = new IntersectionObserver( (items, observer) => {
            for (let i = 0; i < items.length; i++) {
                if (!items[i].isIntersecting) {
                    navElement.querySelector('[data-jump-id="' + items[i].target.getAttribute('id') + '"]').classList.remove('jump-to-nav__item--active');
                } else {
                    navElement.querySelector('[data-jump-id="' + items[i].target.getAttribute('id') + '"]').classList.add('jump-to-nav__item--active');
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


    //
    // Scroll to inside div
    //

    function scrollParentToChild(parent, child) {
        const parentRect = parent.getBoundingClientRect();
        const childRect = child.getBoundingClientRect();
        
        const parentViewableArea = {
            height: parent.clientHeight,
            width: parent.clientWidth
        };
      
        const isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);
      
        if (!isViewable) {
            const scrollTop = childRect.top - parentRect.top;
            const scrollBottom = childRect.bottom - parentRect.bottom;
            
            if (Math.abs(scrollTop) < Math.abs(scrollBottom)) {
                parent.scrollTop += scrollTop - 60;
            } else {
                parent.scrollTop += scrollBottom + 60;
            }
        }
    }
})();