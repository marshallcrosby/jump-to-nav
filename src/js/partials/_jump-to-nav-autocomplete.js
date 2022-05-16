/* --------------------------------------------------------------------------
    Search autocomplete
    * https://tarekraafat.github.io/autoComplete.js/
---------------------------------------------------------------------------- */
let autoCompleteCDNJS = 'https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/autoComplete.min.js';
let autoCompleteCDNCSS = 'https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/css/autoComplete.min.css';

// loadExternalCss(autoCompleteCDNCSS);
// loadExternalJs(autoCompleteCDNJS, autoCompleteReady);

function autoCompleteReady() {
    let autoCompleteJS = new autoComplete(
        {
            selector: "#autoComplete",
            placeHolder: "Search for Food...",
            data: {
                src: searchTermsArray,
                keys: ['title', 'id'],
                cache: true,
            },
            resultsList: {
                element: (list, data) => {
                    if (!data.results.length) {
                        // Create "No Results" message element
                        const message = document.createElement('div');
                        // Add class to the created element
                        message.setAttribute('class', 'no_result');
                        // Add message text content
                        message.innerHTML = `<span>Found No Results for '${data.query}'</span>`;
                        // Append message element to the results list
                        list.prepend(message);
                    }
                },
                noResults: true,
            },
            resultItem: {
                highlight: true,
            }
        }
    );
}

function loadExternalJs(scriptSrc, callback) {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    
    script.src = scriptSrc;
    
    head.appendChild(script);
    script.onload = callback;
}

// Run after getting beautify-html/highlight.io external assets
function loadExternalCss(url, callback) {
    let head = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');
        
    link.id = 'highlightJsCss';
    link.rel = 'stylesheet';
    link.href = url;
    
    link.onreadystatechange = callback;
    link.onload = callback;
    head.appendChild(link);
}