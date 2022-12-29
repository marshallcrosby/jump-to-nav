/*!
    * Jump to navigation v1.5.2
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
        • Placement (✓ left, ✓ right, ✓ top, bottom, custom)
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
            position: null,
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
            param.position = urlParam.get('position');
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
        
            const jumpToCSS = `:root{--jtn-top-location:100px;--jtn-idle-width:40px;--jtn-base-font-size:16px;--jtn-small-font-size:12.5px;--jtn-ff-primary:"Helvetica Neue",Helvetica,Arial,sans-serif;--jtn-space-common:13px;--jtn-border-radius-small:7px;--jtn-border-radius-large:calc(var(--jtn-border-radius-small) * 2);--jtn-dialog-width:240px;--jtn-padding-y-common:10px;--jtn-padding-x-common:16px;--jtn-link-spacing:7px;--jtn-button-size:23px;--jtn-color-bg:#fff;--jtn-color-text:#333;--jtn-color-primary:#1f4de3;--jtn-gray-50:#f3f3f3;--jtn-gray-100:#e6e6e6;--jtn-gray-200:#cdcdcd;--jtn-color-border-common:rgba(0, 0, 0, 0.1);--jtn-color-highlight:rgba(0, 0, 0, .2);--jtn-transition-ease:cubic-bezier(1.000, 0.000, 0.025, 1.000);--jtn-transition-speed:350ms;--jtn-box-shadow-shallow:3px 5px 10px rgba(0, 0, 0, .13);--jtn-box-shadow-deep:3px 5px 25px rgba(0, 0, 0, .18);--jtn-filter-drop-shadow-deep:3px 5px 15px rgba(0, 0, 0, .18);--jtn-chevron-down:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")}.jump-to-nav{position:fixed;top:var(--jtn-top-location);right:18px;pointer-events:none;font-size:var(--jtn-base-font-size)!important;filter:drop-shadow(var(--jtn-filter-drop-shadow-deep))}.jump-to-nav *{-webkit-font-smoothing:auto}.jump-to-nav * :focus-visible{outline:0}.jump-to-nav *,.jump-to-nav :after,.jump-to-nav :before{box-sizing:border-box}.jump-to-nav .jump-to-nav__dialog{overflow:hidden;width:var(--jtn-dialog-width);height:auto;transition:-webkit-clip-path var(--jtn-transition-speed) var(--jtn-transition-ease);transition:clip-path var(--jtn-transition-speed) var(--jtn-transition-ease);transition:clip-path var(--jtn-transition-speed) var(--jtn-transition-ease),-webkit-clip-path var(--jtn-transition-speed) var(--jtn-transition-ease);color:var(--jtn-color-text);border-radius:var(--jtn-border-radius-large);background-color:var(--jtn-color-bg);font-family:var(--jtn-ff-primary);-webkit-clip-path:inset(0 0 calc(100% - var(--jtn-idle-width)) calc(100% - var(--jtn-idle-width)) round var(--jtn-border-radius-large));clip-path:inset(0 0 calc(100% - var(--jtn-idle-width)) calc(100% - var(--jtn-idle-width)) round var(--jtn-border-radius-large))}.jump-to-nav .jump-to-nav__dialog>:not(.jump-to-nav__maximize){visibility:hidden;transition:visibility var(--jtn-transition-speed) var(--jtn-transition-ease);transition-delay:var(--jtn-transition-speed);pointer-events:none}.jump-to-nav .jump-to-nav__dialog>:not(.jump-to-nav__maximize) a:focus,.jump-to-nav .jump-to-nav__dialog>:not(.jump-to-nav__maximize) button:focus{outline:0}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__maximize{position:absolute;top:0;right:0;display:flex;align-items:center;justify-content:center;width:var(--jtn-idle-width);height:var(--jtn-idle-width);cursor:pointer;pointer-events:auto;border:0;background-color:var(--jtn-color-bg)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__maximize svg{position:relative;right:1px;width:9px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__minimize{width:28px;height:28px;margin-left:auto;padding:0;margin-right:-7px;cursor:pointer;border:0;border-radius:30px;background-color:transparent}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__list,.jump-to-nav .jump-to-nav__dialog .jump-to-nav__nested-list{margin-bottom:0;padding-left:0;list-style-type:none;line-height:1.2}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__list{margin-top:0;margin-left:-10px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__nested-list.jump-to-nav__nested-list--showing{height:auto;overflow:visible}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__expand-button{min-width:var(--jtn-button-size);min-height:var(--jtn-button-size);cursor:pointer;justify-content:center;align-items:center;margin-left:auto;border-radius:50%;display:none}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__expand-button svg{width:12px;height:6px;margin-top:2px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__expand-button:focus-visible,.jump-to-nav .jump-to-nav__dialog .jump-to-nav__expand-button:hover{background-color:var(--jtn-gray-100);opacity:1}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__expand-button[aria-expanded=true]{transform:rotate(180deg)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__item{padding-left:10px;position:relative}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__item:has(.jump-to-nav__item--active)>.jump-to-nav__link{font-weight:500}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__link{display:block;text-decoration:none;color:var(--jtn-color-primary);font-size:var(--jtn-small-font-size);font-weight:400;padding-right:30px;margin-bottom:var(--jtn-link-spacing)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__link:hover span{text-decoration:underline}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__link:hover+.jump-to-nav__item-controls .jump-to-nav__copy-button{opacity:1}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__item-controls{position:absolute;right:-5px;top:-4px;width:auto;display:flex}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__item-controls:has(.jump-to-nav__expand-button){width:calc(var(--jtn-button-size) * 2 + 2px)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__copy-button{min-width:var(--jtn-button-size);min-height:var(--jtn-button-size);border:0;border-radius:50%;background-color:transparent;padding:0;display:flex;justify-content:center;align-items:center;cursor:pointer;opacity:0;transition:all .1s linear}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__copy-button svg{width:14px;height:14px;pointer-events:none}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__copy-button path{fill:var(--jtn-color-text)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__copy-button:focus,.jump-to-nav .jump-to-nav__dialog .jump-to-nav__copy-button:hover{background-color:var(--jtn-gray-100);opacity:1}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__copy-button:focus+.jump-to-nav__copy-bubble,.jump-to-nav .jump-to-nav__dialog .jump-to-nav__copy-button:hover+.jump-to-nav__copy-bubble{opacity:1}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__copy-bubble{position:absolute;background-color:var(--jtn-color-text);color:#fff;height:21px;font-size:9px;border-radius:23px;top:1px;right:calc(100% + 5px);font-weight:700;display:flex;justify-content:center;align-items:center;text-transform:uppercase;transition:opacity .1s linear;opacity:0;pointer-events:none;line-height:1;white-space:nowrap;padding-left:10px;padding-right:10px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__copy-bubble:after{position:absolute;left:calc(100% - 1px);top:calc(50% - 3.5px);content:"";width:0;height:0;border-style:solid;border-width:4px 0 4px 6.9px;border-color:transparent transparent transparent var(--jtn-color-text)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__header{display:flex;align-items:center;flex-wrap:wrap;min-height:50px;padding:var(--jtn-padding-y-common) var(--jtn-padding-x-common) 0 var(--jtn-padding-x-common);border-bottom:1px solid var(--jtn-color-border-common)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__body{padding:var(--jtn-padding-y-common) var(--jtn-padding-x-common);border-right:1px solid var(--jtn-color-bg);overflow:auto}.jump-to-nav .jump-to-nav__dialog [role=heading]{font-weight:700;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:antialiased}.jump-to-nav .jump-to-nav__dialog [role=heading][aria-level="1"]{font-size:17px}.jump-to-nav .jump-to-nav__dialog [role=heading][aria-level="2"]{margin-bottom:8px;font-size:14px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__item--active>.jump-to-nav__link{font-weight:700}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search{position:relative;flex:0 0 100%;width:100%;margin:var(--jtn-space-common) 0;font-size:var(--jtn-small-font-size)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search.jump-to-nav__search--loading{visibility:hidden}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search.jump-to-nav__search--has-value .jump-to-nav__search-clear{display:flex}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-icon{position:absolute;top:50%;left:12px;width:12px;height:12px;transform:translateY(-50%)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-icon path{fill:var(--jtn-color-text)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-clear{position:absolute;top:2px;right:2px;width:30px;height:calc(100% - 4px);background-color:var(--jtn-gray-50);background:linear-gradient(90deg,rgba(243,243,243,0) 0,var(--jtn-gray-50) 25%);display:none;align-items:center;justify-content:center;padding:0;cursor:pointer;border:0}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-clear svg{width:14px;height:14px}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-clear path{fill:var(--jtn-color-text)}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-input[type=text]{width:100%;margin:0;padding:var(--jtn-padding-y-common) 2px var(--jtn-padding-y-common) 32px;border:0;border-radius:var(--jtn-border-radius-small);background-color:var(--jtn-gray-50);box-shadow:none;font-family:var(--jtn-ff-primary);font-size:var(--jtn-small-font-size);line-height:1;font-weight:400}.jump-to-nav .jump-to-nav__dialog .jump-to-nav__search-input[type=text]:focus{outline-color:var(--jtn-color-primary)}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper{position:relative;flex:0 0 100%;width:100%}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper>ul{position:absolute;z-index:10;top:calc(100% + 5px);left:0;overflow:auto;width:100%;max-height:160px;margin:0;padding:0;list-style-type:none;border:1px solid var(--jtn-color-border-common);border-radius:var(--jtn-border-radius-small);background-color:var(--jtn-color-bg);box-shadow:var(--jtn-box-shadow-shallow)}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper li{padding:calc(var(--jtn-padding-x-common)/ 2) var(--jtn-padding-x-common);border-bottom:1px solid var(--jtn-gray-100);font-size:var(--jtn-small-font-size);font-weight:700;line-height:1.4}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper li:last-child{border-bottom:0}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper mark{padding:0;background-color:var(--jtn-gray-100)}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper[aria-expanded=true] li:first-child:not([aria-selected=true]):not(:only-child){background-color:var(--jtn-gray-50)}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper [aria-activedescendant*=autoComplete_result_]+ul li:not([aria-selected=true]):not(:only-child):first-child{background-color:transparent}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper [aria-selected=true]{color:var(--jtn-color-bg);background-color:var(--jtn-color-primary)}.jump-to-nav .jump-to-nav__dialog .autoComplete_wrapper [aria-selected=true] mark{color:var(--jtn-color-bg);background-color:var(--jtn-color-highlight)}.jump-to-nav .jump-to-nav__showonly{margin-bottom:var(--jtn-space-common)}.jump-to-nav .jump-to-nav__label{font-size:var(--jtn-small-font-size);margin-bottom:6px;display:block}.jump-to-nav .jump-to-nav__select{display:block;width:100%;padding:7.5px 33px 7.5px 10px;-moz-padding-start:calc(.75rem - 3px);font-weight:400;line-height:1;background-color:#fff;background-image:var(--jtn-chevron-down);background-repeat:no-repeat;background-position:right 8px center;background-size:16px 12px;border:1px solid var(--jtn-gray-100);border-radius:var(--jtn-border-radius-small);transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out;-webkit-appearance:none;-moz-appearance:none;appearance:none;font-size:var(--jtn-small-font-size)}.jump-to-nav.jump-to-nav--left{right:auto;left:18px}.jump-to-nav.jump-to-nav--left .jump-to-nav__maximize{right:auto;left:0;transition:visibility var(--jtn-transition-speed) var(--jtn-transition-ease);transition-delay:var(--jtn-transition-speed)}.jump-to-nav.jump-to-nav--left .jump-to-nav__chevron-icon{transform:rotate(180deg)}.jump-to-nav.jump-to-nav--left .jump-to-nav__dialog{-webkit-clip-path:inset(0 calc(100% - var(--jtn-idle-width)) calc(100% - var(--jtn-idle-width)) 0 round var(--jtn-border-radius-large));clip-path:inset(0 calc(100% - var(--jtn-idle-width)) calc(100% - var(--jtn-idle-width)) 0 round var(--jtn-border-radius-large))}.jump-to-nav.jump-to-nav--showing{pointer-events:auto}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog{-webkit-clip-path:inset(0 0 0 0 round var(--jtn-border-radius-large));clip-path:inset(0 0 0 0 round var(--jtn-border-radius-large))}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog>*{visibility:visible;transition-delay:0s;pointer-events:auto}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog>* a:focus,.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog>* button:focus{outline:auto}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog .jump-to-nav__maximize{left:9999px;visibility:hidden}.jump-to-nav.jump-to-nav--showing .jump-to-nav__dialog .jump-to-nav__minimize:hover{background-color:var(--jtn-gray-100)}.jump-to-nav .jump-to-nav--styled-scrollbar::-webkit-scrollbar-corner{background-color:transparent}.jump-to-nav .jump-to-nav--styled-scrollbar::-webkit-scrollbar{width:5px;height:5px}.jump-to-nav .jump-to-nav--styled-scrollbar::-webkit-scrollbar-track{background-color:transparent}.jump-to-nav .jump-to-nav--styled-scrollbar::-webkit-scrollbar-thumb{outline:0;background-color:var(--jtn-gray-100)}.jump-to-nav .jump-to-nav--styled-scrollbar::-webkit-scrollbar-thumb:hover{background-color:var(--jtn-gray-200)}.jump-to-nav.jump-to-nav--collapse-nested{--jtn-link-spacing:11px}.jump-to-nav.jump-to-nav--collapse-nested .jump-to-nav__nested-list{height:0;overflow:hidden}.jump-to-nav.jump-to-nav--collapse-nested .jump-to-nav__expand-button{display:flex}
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
    
        const HTML = `<div class="jump-to-nav__dialog"><div class="jump-to-nav__maximize" role="button" aria-label="Maximize menu" tabindex="0"><svg class="jump-to-nav__chevron-icon" width="8.5px" height="14.1px" viewBox="0 0 8.5 14.1" style="pointer-events: none;" aria-hidden="true"><style>.maximize-polygon {
                    fill: var(--jtn-color-text);
                }</style><polygon class="maximize-polygon" points="0,7.1 7.1,14.1 8.5,12.7 2.8,7.1 8.5,1.4 7.1,0 0,7.1 0,7.1 "></polygon></svg></div><div class="jump-to-nav__content"><div class="jump-to-nav__header"><div class="jump-to-nav__heading" role="heading" aria-level="1">On this page</div><div class="jump-to-nav__minimize" role="button" aria-label="Minimize menu" tabindex="0"><svg class="jump-to-nav__line-icon" viewBox="0 0 28 28" style="pointer-events: none;" aria-hidden="true"><style type="text/css">.minimize-line {
                            fill: none;
                            stroke: var(--jtn-color-text);
                            stroke-linecap: round;
                            stroke-linejoin: round;
                            stroke-miterlimit: 10;
                            stroke-width: 2px;
                        }</style><line class="minimize-line" x1="9" y1="14" x2="19" y2="14"/></svg></div><div class="jump-to-nav__search jump-to-nav__search--loading"><div class="jump-to-nav__input-wrapper"><input class="jump-to-nav__search-input" id="jumpToNavAutoComplete" type="text" placeholder="Search" autocomplete="off"></div><div class="jump-to-nav__search-clear" role="button" tabindex="0"><svg class="jump-to-nav__clear-icon" viewBox="0 0 320 512" aria-hidden="true" style="pointer-events: none;" aria-hidden="true"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg></div><svg class="jump-to-nav__search-icon" viewBox="0 0 512 512" aria-hidden="true" style="pointer-events: none;" aria-hidden="true"><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"/></svg></div><div class="jump-to-nav__showonly"><label class="jump-to-nav__label" for="jumpToNavShowOnlyLabel">Showing:</label> <select class="jump-to-nav__select" name="sort-by" id="jumpToNavShowOnlyLabel"><option value="showAll">All</option></select></div></div><div class="jump-to-nav__body jump-to-nav--styled-scrollbar"><nav class="jump-to-nav__nav"><div class="jump-to-nav__item-controls"><div class="jump-to-nav__copy-button" role="button" aria-label="Copy link" tabindex="0"><svg class="jump-to-nav__link-icon" viewBox="0 0 640 512" style="pointer-events: none;" aria-hidden="true"><path d="M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"/></svg></div><div class="jump-to-nav__copy-bubble">Copy Link</div></div></nav></div></div></div>`;
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

        if (param.position !== null) {
            let navPos = param.position.split(', ').join(',');

            if (navPos.includes('left')) {
                navWrapperEl.classList.add('jump-to-nav--left');
            }
            
            if (navPos.includes('bottom')) {
                navWrapperEl.classList.add('jump-to-nav--bottom');
            }
            
            if (navPos.includes('right')) {
                navWrapperEl.classList.add('jump-to-nav--right');
            }
            
            if (navPos.includes('top')) {
                navWrapperEl.classList.add('jump-to-nav--top');
            }
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
            
        jumpToElement.forEach((item) => {

            let options = null;
            options = {
                title: null
            };
    
            if (item.getAttribute('data-jtn-anchor') !== '') {
                const semiColonSplit = item.getAttribute('data-jtn-anchor').split(';');
                
                // Assign option values if any
                semiColonSplit.forEach((item, index) => {
                    if (semiColonSplit[index].split('title:')[1] !== undefined) {
                        options.title = jtnParseOption(semiColonSplit[index], 'title');
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
        });


        //
        // Apply controls div
        //

        const tempItemControls = navElement.querySelector('.jump-to-nav__item-controls');
        const navListItem = navList.querySelectorAll('li');

        if (param.linkCopy !== null || param.collapseNested !== null) {
            
            navListItem.forEach((item) => {
                item.appendChild(tempItemControls.cloneNode(true));
            });

            tempItemControls.remove();
        } else {
            tempItemControls.remove();
        }

        
        //
        // Add copy button to each anchor link
        //
        
        if (param.linkCopy !== null) {

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
    
                const childrenControls = navElement.querySelectorAll('.jump-to-nav__item--parent > .jump-to-nav__item-controls');
                
                childrenControls.forEach((item) => {
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

                navWrapperEl.classList.add('jump-to-nav--collapse-nested');
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

            // Active section. Can't use Bootstrap 5 scrollspy since it's buggy
            const sections = document.querySelectorAll('[data-jtn-anchor]');
            const jumpToMenu = document.querySelector('.jump-to-nav__nav');
            const menuLinks = jumpToMenu.querySelectorAll('a');
            const sectionMargin = 200;
            let currentActive = 0;
            
            const removeAllActive = () => {
                const currentActive = jumpToMenu.getElementsByClassName('jump-to-nav__item--active')[0];
                if (currentActive) {
                    currentActive.classList.remove('jump-to-nav__item--active');
                }
            };

            const makeActive = (link) => {
                const newActive = menuLinks[link];
                if (newActive) {
                    newActive.classList.add('jump-to-nav__item--active');
                }
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
        // Search with autocomplete
        //

        const searchEl = document.querySelector('.jump-to-nav__search');
        const searchInput = searchEl.querySelector('.jump-to-nav__search-input');
        const navItem = navElement.querySelectorAll('.jump-to-nav__item');

        if (param.search !== null || navItem.length >= parseInt(param.showSearchAfter) ) {

            // Thanks to autoComplete.js. Project repo: https://github.com/TarekRaafat/autoComplete.js
            (function (global, factory) {
              typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
              typeof define === 'function' && define.amd ? define(factory) :
              (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.autoComplete = factory());
            })(this, (function () { 'use strict';
            
              function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
            
                if (Object.getOwnPropertySymbols) {
                  var symbols = Object.getOwnPropertySymbols(object);
                  enumerableOnly && (symbols = symbols.filter(function (sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                  })), keys.push.apply(keys, symbols);
                }
            
                return keys;
              }
            
              function _objectSpread2(target) {
                for (var i = 1; i < arguments.length; i++) {
                  var source = null != arguments[i] ? arguments[i] : {};
                  i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
                    _defineProperty(target, key, source[key]);
                  }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                  });
                }
            
                return target;
              }
            
              function _typeof(obj) {
                "@babel/helpers - typeof";
            
                return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
                  return typeof obj;
                } : function (obj) {
                  return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                }, _typeof(obj);
              }
            
              function _defineProperty(obj, key, value) {
                if (key in obj) {
                  Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                  });
                } else {
                  obj[key] = value;
                }
            
                return obj;
              }
            
              function _toConsumableArray(arr) {
                return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
              }
            
              function _arrayWithoutHoles(arr) {
                if (Array.isArray(arr)) return _arrayLikeToArray(arr);
              }
            
              function _iterableToArray(iter) {
                if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
              }
            
              function _unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === "string") return _arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
              }
            
              function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
            
                for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
            
                return arr2;
              }
            
              function _nonIterableSpread() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
              }
            
              function _createForOfIteratorHelper(o, allowArrayLike) {
                var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
            
                if (!it) {
                  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
                    if (it) o = it;
                    var i = 0;
            
                    var F = function () {};
            
                    return {
                      s: F,
                      n: function () {
                        if (i >= o.length) return {
                          done: true
                        };
                        return {
                          done: false,
                          value: o[i++]
                        };
                      },
                      e: function (e) {
                        throw e;
                      },
                      f: F
                    };
                  }
            
                  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }
            
                var normalCompletion = true,
                    didErr = false,
                    err;
                return {
                  s: function () {
                    it = it.call(o);
                  },
                  n: function () {
                    var step = it.next();
                    normalCompletion = step.done;
                    return step;
                  },
                  e: function (e) {
                    didErr = true;
                    err = e;
                  },
                  f: function () {
                    try {
                      if (!normalCompletion && it.return != null) it.return();
                    } finally {
                      if (didErr) throw err;
                    }
                  }
                };
              }
            
              var select$1 = function select(element) {
                return typeof element === "string" ? document.querySelector(element) : element();
              };
              var create = function create(tag, options) {
                var el = typeof tag === "string" ? document.createElement(tag) : tag;
                for (var key in options) {
                  var val = options[key];
                  if (key === "inside") {
                    val.append(el);
                  } else if (key === "dest") {
                    select$1(val[0]).insertAdjacentElement(val[1], el);
                  } else if (key === "around") {
                    var ref = val;
                    ref.parentNode.insertBefore(el, ref);
                    el.append(ref);
                    if (ref.getAttribute("autofocus") != null) ref.focus();
                  } else if (key in el) {
                    el[key] = val;
                  } else {
                    el.setAttribute(key, val);
                  }
                }
                return el;
              };
              var getQuery = function getQuery(field) {
                return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement ? field.value : field.innerHTML;
              };
              var format = function format(value, diacritics) {
                value = String(value).toLowerCase();
                return diacritics ? value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC") : value;
              };
              var debounce = function debounce(callback, duration) {
                var timer;
                return function () {
                  clearTimeout(timer);
                  timer = setTimeout(function () {
                    return callback();
                  }, duration);
                };
              };
              var checkTrigger = function checkTrigger(query, condition, threshold) {
                return condition ? condition(query) : query.length >= threshold;
              };
              var mark = function mark(value, cls) {
                return create("mark", _objectSpread2({
                  innerHTML: value
                }, typeof cls === "string" && {
                  "class": cls
                })).outerHTML;
              };
            
              var configure = (function (ctx) {
                var name = ctx.name,
                    options = ctx.options,
                    resultsList = ctx.resultsList,
                    resultItem = ctx.resultItem;
                for (var option in options) {
                  if (_typeof(options[option]) === "object") {
                    if (!ctx[option]) ctx[option] = {};
                    for (var subOption in options[option]) {
                      ctx[option][subOption] = options[option][subOption];
                    }
                  } else {
                    ctx[option] = options[option];
                  }
                }
                ctx.selector = ctx.selector || "#" + name;
                resultsList.destination = resultsList.destination || ctx.selector;
                resultsList.id = resultsList.id || name + "_list_" + ctx.id;
                resultItem.id = resultItem.id || name + "_result";
                ctx.input = select$1(ctx.selector);
              });
            
              var eventEmitter = (function (name, ctx) {
                ctx.input.dispatchEvent(new CustomEvent(name, {
                  bubbles: true,
                  detail: ctx.feedback,
                  cancelable: true
                }));
              });
            
              var search = (function (query, record, options) {
                var _ref = options || {},
                    mode = _ref.mode,
                    diacritics = _ref.diacritics,
                    highlight = _ref.highlight;
                var nRecord = format(record, diacritics);
                record = String(record);
                query = format(query, diacritics);
                if (mode === "loose") {
                  query = query.replace(/ /g, "");
                  var qLength = query.length;
                  var cursor = 0;
                  var match = Array.from(record).map(function (character, index) {
                    if (cursor < qLength && nRecord[index] === query[cursor]) {
                      character = highlight ? mark(character, highlight) : character;
                      cursor++;
                    }
                    return character;
                  }).join("");
                  if (cursor === qLength) return match;
                } else {
                  var _match = nRecord.indexOf(query);
                  if (~_match) {
                    query = record.substring(_match, _match + query.length);
                    _match = highlight ? record.replace(query, mark(query, highlight)) : record;
                    return _match;
                  }
                }
              });
            
              var getData = function getData(ctx, query) {
                return new Promise(function ($return, $error) {
                  var data;
                  data = ctx.data;
                  if (data.cache && data.store) return $return();
                  return new Promise(function ($return, $error) {
                    if (typeof data.src === "function") {
                      return data.src(query).then($return, $error);
                    }
                    return $return(data.src);
                  }).then(function ($await_4) {
                    try {
                      ctx.feedback = data.store = $await_4;
                      eventEmitter("response", ctx);
                      return $return();
                    } catch ($boundEx) {
                      return $error($boundEx);
                    }
                  }, $error);
                });
              };
              var findMatches = function findMatches(query, ctx) {
                var data = ctx.data,
                    searchEngine = ctx.searchEngine;
                var matches = [];
                data.store.forEach(function (value, index) {
                  var find = function find(key) {
                    var record = key ? value[key] : value;
                    var match = typeof searchEngine === "function" ? searchEngine(query, record) : search(query, record, {
                      mode: searchEngine,
                      diacritics: ctx.diacritics,
                      highlight: ctx.resultItem.highlight
                    });
                    if (!match) return;
                    var result = {
                      match: match,
                      value: value
                    };
                    if (key) result.key = key;
                    matches.push(result);
                  };
                  if (data.keys) {
                    var _iterator = _createForOfIteratorHelper(data.keys),
                        _step;
                    try {
                      for (_iterator.s(); !(_step = _iterator.n()).done;) {
                        var key = _step.value;
                        find(key);
                      }
                    } catch (err) {
                      _iterator.e(err);
                    } finally {
                      _iterator.f();
                    }
                  } else {
                    find();
                  }
                });
                if (data.filter) matches = data.filter(matches);
                var results = matches.slice(0, ctx.resultsList.maxResults);
                ctx.feedback = {
                  query: query,
                  matches: matches,
                  results: results
                };
                eventEmitter("results", ctx);
              };
            
              var Expand = "aria-expanded";
              var Active = "aria-activedescendant";
              var Selected = "aria-selected";
              var feedback = function feedback(ctx, index) {
                ctx.feedback.selection = _objectSpread2({
                  index: index
                }, ctx.feedback.results[index]);
              };
              var render = function render(ctx) {
                var resultsList = ctx.resultsList,
                    list = ctx.list,
                    resultItem = ctx.resultItem,
                    feedback = ctx.feedback;
                var matches = feedback.matches,
                    results = feedback.results;
                ctx.cursor = -1;
                list.innerHTML = "";
                if (matches.length || resultsList.noResults) {
                  var fragment = new DocumentFragment();
                  results.forEach(function (result, index) {
                    var element = create(resultItem.tag, _objectSpread2({
                      id: "".concat(resultItem.id, "_").concat(index),
                      role: "option",
                      innerHTML: result.match,
                      inside: fragment
                    }, resultItem["class"] && {
                      "class": resultItem["class"]
                    }));
                    if (resultItem.element) resultItem.element(element, result);
                  });
                  list.append(fragment);
                  if (resultsList.element) resultsList.element(list, feedback);
                  open(ctx);
                } else {
                  close(ctx);
                }
              };
              var open = function open(ctx) {
                if (ctx.isOpen) return;
                (ctx.wrapper || ctx.input).setAttribute(Expand, true);
                ctx.list.removeAttribute("hidden");
                ctx.isOpen = true;
                eventEmitter("open", ctx);
              };
              var close = function close(ctx) {
                if (!ctx.isOpen) return;
                (ctx.wrapper || ctx.input).setAttribute(Expand, false);
                ctx.input.setAttribute(Active, "");
                ctx.list.setAttribute("hidden", "");
                ctx.isOpen = false;
                eventEmitter("close", ctx);
              };
              var goTo = function goTo(index, ctx) {
                var resultItem = ctx.resultItem;
                var results = ctx.list.getElementsByTagName(resultItem.tag);
                var cls = resultItem.selected ? resultItem.selected.split(" ") : false;
                if (ctx.isOpen && results.length) {
                  var _results$index$classL;
                  var state = ctx.cursor;
                  if (index >= results.length) index = 0;
                  if (index < 0) index = results.length - 1;
                  ctx.cursor = index;
                  if (state > -1) {
                    var _results$state$classL;
                    results[state].removeAttribute(Selected);
                    if (cls) (_results$state$classL = results[state].classList).remove.apply(_results$state$classL, _toConsumableArray(cls));
                  }
                  results[index].setAttribute(Selected, true);
                  if (cls) (_results$index$classL = results[index].classList).add.apply(_results$index$classL, _toConsumableArray(cls));
                  ctx.input.setAttribute(Active, results[ctx.cursor].id);
                  ctx.list.scrollTop = results[index].offsetTop - ctx.list.clientHeight + results[index].clientHeight + 5;
                  ctx.feedback.cursor = ctx.cursor;
                  feedback(ctx, index);
                  eventEmitter("navigate", ctx);
                }
              };
              var next = function next(ctx) {
                goTo(ctx.cursor + 1, ctx);
              };
              var previous = function previous(ctx) {
                goTo(ctx.cursor - 1, ctx);
              };
              var select = function select(ctx, event, index) {
                index = index >= 0 ? index : ctx.cursor;
                if (index < 0) return;
                ctx.feedback.event = event;
                feedback(ctx, index);
                eventEmitter("selection", ctx);
                close(ctx);
              };
              var click = function click(event, ctx) {
                var itemTag = ctx.resultItem.tag.toUpperCase();
                var items = Array.from(ctx.list.querySelectorAll(itemTag));
                var item = event.target.closest(itemTag);
                if (item && item.nodeName === itemTag) {
                  select(ctx, event, items.indexOf(item));
                }
              };
              var navigate = function navigate(event, ctx) {
                switch (event.keyCode) {
                  case 40:
                  case 38:
                    event.preventDefault();
                    event.keyCode === 40 ? next(ctx) : previous(ctx);
                    break;
                  case 13:
                    if (!ctx.submit) event.preventDefault();
                    if (ctx.cursor >= 0) select(ctx, event);
                    break;
                  case 9:
                    if (ctx.resultsList.tabSelect && ctx.cursor >= 0) select(ctx, event);
                    break;
                  case 27:
                    ctx.input.value = "";
                    close(ctx);
                    break;
                }
              };
            
              function start (ctx, q) {
                var _this = this;
                return new Promise(function ($return, $error) {
                  var queryVal, condition;
                  queryVal = q || getQuery(ctx.input);
                  queryVal = ctx.query ? ctx.query(queryVal) : queryVal;
                  condition = checkTrigger(queryVal, ctx.trigger, ctx.threshold);
                  if (condition) {
                    return getData(ctx, queryVal).then(function ($await_2) {
                      try {
                        if (ctx.feedback instanceof Error) return $return();
                        findMatches(queryVal, ctx);
                        if (ctx.resultsList) render(ctx);
                        return $If_1.call(_this);
                      } catch ($boundEx) {
                        return $error($boundEx);
                      }
                    }, $error);
                  } else {
                    close(ctx);
                    return $If_1.call(_this);
                  }
                  function $If_1() {
                    return $return();
                  }
                });
              }
            
              var eventsManager = function eventsManager(events, callback) {
                for (var element in events) {
                  for (var event in events[element]) {
                    callback(element, event);
                  }
                }
              };
              var addEvents = function addEvents(ctx) {
                var events = ctx.events;
                var run = debounce(function () {
                  return start(ctx);
                }, ctx.debounce);
                var publicEvents = ctx.events = _objectSpread2({
                  input: _objectSpread2({}, events && events.input)
                }, ctx.resultsList && {
                  list: events ? _objectSpread2({}, events.list) : {}
                });
                var privateEvents = {
                  input: {
                    input: function input() {
                      run();
                    },
                    keydown: function keydown(event) {
                      navigate(event, ctx);
                    },
                    blur: function blur() {
                      close(ctx);
                    }
                  },
                  list: {
                    mousedown: function mousedown(event) {
                      event.preventDefault();
                    },
                    click: function click$1(event) {
                      click(event, ctx);
                    }
                  }
                };
                eventsManager(privateEvents, function (element, event) {
                  if (!ctx.resultsList && event !== "input") return;
                  if (publicEvents[element][event]) return;
                  publicEvents[element][event] = privateEvents[element][event];
                });
                eventsManager(publicEvents, function (element, event) {
                  ctx[element].addEventListener(event, publicEvents[element][event]);
                });
              };
              var removeEvents = function removeEvents(ctx) {
                eventsManager(ctx.events, function (element, event) {
                  ctx[element].removeEventListener(event, ctx.events[element][event]);
                });
              };
            
              function init (ctx) {
                var _this = this;
                return new Promise(function ($return, $error) {
                  var placeHolder, resultsList, parentAttrs;
                  placeHolder = ctx.placeHolder;
                  resultsList = ctx.resultsList;
                  parentAttrs = {
                    role: "combobox",
                    "aria-owns": resultsList.id,
                    "aria-haspopup": true,
                    "aria-expanded": false
                  };
                  create(ctx.input, _objectSpread2(_objectSpread2({
                    "aria-controls": resultsList.id,
                    "aria-autocomplete": "both"
                  }, placeHolder && {
                    placeholder: placeHolder
                  }), !ctx.wrapper && _objectSpread2({}, parentAttrs)));
                  if (ctx.wrapper) ctx.wrapper = create("div", _objectSpread2({
                    around: ctx.input,
                    "class": ctx.name + "_wrapper"
                  }, parentAttrs));
                  if (resultsList) ctx.list = create(resultsList.tag, _objectSpread2({
                    dest: [resultsList.destination, resultsList.position],
                    id: resultsList.id,
                    role: "listbox",
                    hidden: "hidden"
                  }, resultsList["class"] && {
                    "class": resultsList["class"]
                  }));
                  addEvents(ctx);
                  if (ctx.data.cache) {
                    return getData(ctx).then(function ($await_2) {
                      try {
                        return $If_1.call(_this);
                      } catch ($boundEx) {
                        return $error($boundEx);
                      }
                    }, $error);
                  }
                  function $If_1() {
                    eventEmitter("init", ctx);
                    return $return();
                  }
                  return $If_1.call(_this);
                });
              }
            
              function extend (autoComplete) {
                var prototype = autoComplete.prototype;
                prototype.init = function () {
                  init(this);
                };
                prototype.start = function (query) {
                  start(this, query);
                };
                prototype.unInit = function () {
                  if (this.wrapper) {
                    var parentNode = this.wrapper.parentNode;
                    parentNode.insertBefore(this.input, this.wrapper);
                    parentNode.removeChild(this.wrapper);
                  }
                  removeEvents(this);
                };
                prototype.open = function () {
                  open(this);
                };
                prototype.close = function () {
                  close(this);
                };
                prototype.goTo = function (index) {
                  goTo(index, this);
                };
                prototype.next = function () {
                  next(this);
                };
                prototype.previous = function () {
                  previous(this);
                };
                prototype.select = function (index) {
                  select(this, null, index);
                };
                prototype.search = function (query, record, options) {
                  return search(query, record, options);
                };
              }
            
              function autoComplete(config) {
                this.options = config;
                this.id = autoComplete.instances = (autoComplete.instances || 0) + 1;
                this.name = "autoComplete";
                this.wrapper = 1;
                this.threshold = 1;
                this.debounce = 0;
                this.resultsList = {
                  position: "afterend",
                  tag: "ul",
                  maxResults: 5
                };
                this.resultItem = {
                  tag: "li"
                };
                configure(this);
                extend.call(this, autoComplete);
                init(this);
              }
            
              return autoComplete;
            
            }));
            
            
            let jtnSearchTermsTitle = [];
            let jtnSearchTermsID = [];

            function renderDataArrays(title, id) {
                jtnSearchTermsTitle = [];
                jtnSearchTermsID = [];
                
                document.querySelectorAll('[data-jtn-anchor]').forEach((item) => {
                    if ((item.offsetParent !== null)) {
                        const titleText = jtnParseOption(item.getAttribute('data-jtn-anchor'), 'title');
                
                        jtnSearchTermsTitle.push(titleText);
                        jtnSearchTermsID.push(item.id);
                    }
                });
            
                if (title !== null) {
                    return jtnSearchTermsTitle;
                } else if (id !== null) {
                    return jtnSearchTermsID;
                } else {
                    return false;
                }
            }

            var autoCompleteConstructor = function(refresh) {
                var autoCompleteJS = new autoComplete({
                    selector: "#jumpToNavAutoComplete",
                    placeHolder: 'Search',
                    data: {
                        src: renderDataArrays(true, null)
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
                                
                                const associatedLink = navWrapperEl.querySelector(`[href="#${renderDataArrays(null, true)[findIndex(autoCompleteJS.data.src, selection)]}"]`);

                                if (associatedLink.closest('.jump-to-nav__item--parent')) {
                                    const closestToggleClosedBtn = associatedLink.closest('.jump-to-nav__item--parent').querySelector('.jump-to-nav__expand-button[aria-expanded="false"]');
                                    if (closestToggleClosedBtn) {
                                        closestToggleClosedBtn.click();
                                    }
                                }

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

                if (refresh === 'refresh') {
                    // Remove events
                    autoCompleteJS.unInit();
                    
                    // Delete current autoComplete wrapper
                    navWrapperEl.querySelector('.autoComplete_wrapper').remove();
                    
                    // Reapply autocomplete input
                    navWrapperEl
                        .querySelector('.jump-to-nav__input-wrapper')
                        .innerHTML = `<input class="jump-to-nav__search-input" id="jumpToNavAutoComplete" type="text" placeholder="Search" autocomplete="off">`;
                    
                    // Re-run autocomplete initializer
                    autoCompleteConstructor();
                }
            }

            autoCompleteConstructor();
            
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
        } else {
            searchEl.remove();
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

        
        //
        // Group sorting
        //

        const showGroup = document.querySelectorAll('[data-jtn-group]');
        if (showGroup.length) {
            const showSelect = navWrapperEl.querySelector('.jump-to-nav__select');
    
            showGroup.forEach((item) => {
                const optionTitle = jtnParseOption(item.getAttribute('data-jtn-group'), 'title');
                const optionID = camelize('section' + optionTitle.replace(/[^a-z0-9]/gi, ' '));
                
                item.setAttribute('id', optionID);
                
                const option = document.createElement('option');
                option.value = optionID;
                option.innerText = optionTitle;
                showSelect.add(option);

                const childSection = item.querySelectorAll('[data-jtn-anchor]');
                childSection.forEach((itemChild) => {
                    navWrapperEl
                        .querySelector('[data-jump-id="' + itemChild.id + '"]')
                        .setAttribute('data-jtn-group-id', optionID);
                });
            });
    
            showSelect.addEventListener('change', function() {
                const showCurrentSectionID = this.value;
                
                showGroup.forEach((item) => {
                    item.style.display = '';
    
                    if (item.id !== showCurrentSectionID) {
                        item.style.display = 'none';
                    }
    
                    if (showCurrentSectionID === 'showAll') {
                        item.style.display = '';
                    }

                    const topLevelNavItems = navWrapperEl.querySelectorAll('[data-jtn-group-id]');
                    topLevelNavItems.forEach((itemNavItems) => {
                        itemNavItems.style.display = '';

                        if (itemNavItems.getAttribute('data-jtn-group-id') !== showCurrentSectionID) {
                            itemNavItems.style.display = 'none';
                        }

                        if (showCurrentSectionID === 'showAll') {
                            itemNavItems.style.display = '';
                        }
                    });
                });

                
                autoCompleteConstructor('refresh');
            });

        } else {
            navWrapperEl.querySelector('.jump-to-nav__showonly').remove();
        }


        //
        // Make div with role=button act like an actual button for a11y reasons
        //
        
        document.querySelectorAll('.jump-to-nav__maximize, .jump-to-nav__minimize, .jump-to-nav__search-clear, .jump-to-nav__copy-button, .jump-to-nav__expand-button')
            .forEach((item) => {
                item.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter' || event.code === 'Space') {
                        event.preventDefault();
                        this.click();
                    }
                });
            });


        //
        // Remove un-needed item controls
        //

        if (
            param.linkCopy === null &&
            param.collapseNested !== null
        ) {
            navWrapperEl.querySelectorAll('.jump-to-nav__item:not(.jump-to-nav__item--parent) .jump-to-nav__item-controls').forEach(item => item.remove())
        }
    }

    /* --------------------------------------------------------------------------
        Functions
    ---------------------------------------------------------------------------- */

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
    
    
    //
    // Parse options (function)
    //
    
    function jtnParseOption(splitOn, optionString) {
        return splitOn.split(optionString + ':')[1].trim();
    }
})();
//# sourceMappingURL=jump-to-nav.js.map