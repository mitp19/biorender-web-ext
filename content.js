const targetNode = document.querySelector('body');


// Add lightbox with display none.
createImageBox();

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.id.includes("twitter-widget-54")) {
                    addImageModals();
                }
            })
        }
        if (mutation.type == "attributes" && mutation.target.id == "twitter-widget-53") {
            addImageModals();
        }
    }
};

// Setting up observer:
const config = { attributes: true, childList: true, subtree: true };
// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
// Start observing the target node for configured mutations
observer.observe(targetNode, config);

function addImageModals() {
    let twitterWidgets = document.getElementsByTagName("twitter-widget");
    for (let tweet of twitterWidgets) {
        try {
            let div = document.querySelector(`#${tweet.id}`).shadowRoot.querySelector(`#${tweet.id} > div > div > blockquote > div.Tweet-body.e-entry-content > div.Tweet-card > article > div`)
            if (div) {
                addEventListToAnchors(div);
            }
            else {
                div = document.querySelector(`#${tweet.id}`).shadowRoot.querySelector(`#${tweet.id} > div > div > blockquote > div.Tweet-body.e-entry-content > div.Tweet-card > div > a > div.QuotedTweet-media > article > div`)
                if (div) {
                    let anchorRemove = document.querySelector(`#${tweet.id}`).shadowRoot.querySelector(`#${tweet.id} > div > div > blockquote > div.Tweet-body.e-entry-content > div.Tweet-card > div > a`);
                    
                    anchorRemove.href = "#";
                    anchorRemove.onclick = function(e) {
                        e.preventDefault()
                    }
                    addEventListToEmbeddedImages(div)
                }
            }
        }
        catch (error) {
            console.log("error", error)
        }

    }
}

function addEventListToAnchors(div) {
    let anchors = div.getElementsByTagName("a");
    for (let anchor of anchors) {
        if (anchor.getElementsByTagName("img")[0]) {
            let img = anchor.getElementsByTagName("img")[0];
            if (!img.src.includes("tweet_video")) {
                anchor.href = "#";
                anchor.onclick = function(e) {
                    e.preventDefault();
                    let url = new URL(img.src);
                    let newSrc = `${url.origin}${url.pathname}?format=jpg`
                    triggerModal(newSrc);
                    return false;
                }
            }
        }

    }
}


function triggerModal(newSrc) {
    lightbox(newSrc, newSrc)
}

const hideOverlay = () => {
    let overlay = document.querySelector('.overlayContainer');
    let largeImage = document.querySelector('.largeImage');
    overlay.removeEventListener('click', hideOverlay, false);
    overlay.classList.remove('opacity');
    
    setTimeout(function() {
      largeImage.removeAttribute('src');
      largeImage.removeAttribute('alt');
      overlay.classList.remove('display');
    }, 400);
}

function createImageBox() {
    let divOverlayContainer = document.createElement("div");
    divOverlayContainer.className = "overlayContainer"
    let divImageBox = document.createElement("div");
    divImageBox.className = "imageBox"
    let divRelativeContainer = document.createElement('div');
    divRelativeContainer.className = "relativeContainer";
    let img = document.createElement('img');
    img.className = "largeImage";
    divImageBox.appendChild(divRelativeContainer);
    divRelativeContainer.appendChild(img);
    divOverlayContainer.appendChild(divImageBox);
    document.body.appendChild(divOverlayContainer);
}

  
function lightbox(href, alt) {
    let overlay = document.querySelector('.overlayContainer');
    let largeImage = document.querySelector('.largeImage');
    largeImage.setAttribute('src', href);
    largeImage.setAttribute('alt', alt);
    overlay.classList.add('display');
    setTimeout(function() { overlay.classList.add('opacity'); }, 25);
    setTimeout(function() { overlay.addEventListener('click', hideOverlay, false); }, 400);
  }


  function addEventListToEmbeddedImages(div) {
    let images = div.getElementsByTagName("img");
    for (let image of images) {
        image.onclick = function(e) {
            e.preventDefault();
            let url = new URL(image.src);
            let newSrc = `${url.origin}${url.pathname}?format=jpg`
            triggerModal(newSrc);
        }
    }
  }