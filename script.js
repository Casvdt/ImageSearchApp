const accesKey = "Nff6R1YdMewZK328mLY_sTR6Zp6kXXutO-AIKyoWXmY";
const formEl= document.querySelector("form");
const inputEl= document.getElementById("search-input");
const searchResultsEl= document.querySelector(".search-results");
const showMoreBtn= document.querySelector(".show-more-button");

let inputData="";
let page=1;

// Track downloads per Unsplash API guidelines
function trackDownload(result) {
    try {
        const downloadLocation = result && result.links && result.links.download_location;
        if (!downloadLocation) return;
        const url = downloadLocation.includes("?")
            ? `${downloadLocation}&client_id=${accesKey}`
            : `${downloadLocation}?client_id=${accesKey}`;
        // Fire-and-forget; do not block navigation
        fetch(url).catch(() => {});
    } catch (e) {
        // no-op
    }

}

// Modal elements and state
const modalEl = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-image");
const modalDownloadBtn = document.getElementById("modal-download");
const modalViewLink = document.getElementById("modal-view");
let currentResult = null;

function openModal(result) {
    currentResult = result;
    // Use a larger preview for modal
    const previewUrl = (result.urls && (result.urls.regular || result.urls.small)) || result.urls?.small;
    modalImg.src = previewUrl;
    modalImg.alt = result.alt_description || result.description || "Unsplash Image";
    const photoPageUrl = `${result.links.html}?utm_source=ImageSearchApp&utm_medium=referral`;
    modalViewLink.href = photoPageUrl;
    modalEl.setAttribute("aria-hidden", "false");
    modalEl.classList.add("open");
}

function closeModal() {
    modalEl.classList.remove("open");
    modalEl.setAttribute("aria-hidden", "true");
    // Clear to avoid showing old image briefly next open
    modalImg.src = "";
    currentResult = null;
}

async function searchImages(){
    inputData= inputEl.value;
    const url=`https://api.unsplash.com/search/photos?page=${page}&query=${encodeURIComponent(inputData)}&client_id=${accesKey}`;
    const response= await fetch(url);
    const data= await response.json();

    const results= data.results;
    if(page===1){
        searchResultsEl.innerHTML="";
    }
    results.map((result)=>{
        const imageWrapper= document.createElement("div");
        imageWrapper.classList.add("search-result");
        const image = document.createElement("img");
        image.src= result.urls.small;
        image.alt= result.alt_description || result.description || "Unsplash Image";
        const imageLink= document.createElement("a");
        // Add Unsplash referral parameters per API guidelines
        const photoPageUrl = `${result.links.html}?utm_source=ImageSearchApp&utm_medium=referral`;
        imageLink.href= photoPageUrl;
        imageLink.target= "_blank";
        imageLink.rel = "noopener noreferrer";
        imageLink.textContent= result.alt_description || "View on Unsplash";

        // Open modal on image click; keep link for viewing on Unsplash
        image.addEventListener("click", () => openModal(result));

        // Build attribution: "Photo by <Photographer> on Unsplash"
        const photographerName = (result.user && (result.user.name || [result.user.first_name, result.user.last_name].filter(Boolean).join(" "))) || "Unsplash Contributor";
        const photographerUsername = result.user && result.user.username;
        const profileUrl = photographerUsername
            ? `https://unsplash.com/@${photographerUsername}?utm_source=ImageSearchApp&utm_medium=referral`
            : `https://unsplash.com/?utm_source=ImageSearchApp&utm_medium=referral`;
        const unsplashUrl = `https://unsplash.com/?utm_source=ImageSearchApp&utm_medium=referral`;

        const attribution = document.createElement("p");
        attribution.classList.add("attribution");
        attribution.innerHTML = `Photo by <a href="${profileUrl}" target="_blank" rel="noopener noreferrer">${photographerName}</a> on <a href="${unsplashUrl}" target="_blank" rel="noopener noreferrer">Unsplash</a>`;

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
        imageWrapper.appendChild(attribution);
        searchResultsEl.appendChild(imageWrapper);
    });

    page++;
    if(page>1){
        showMoreBtn.style.display="block";
        showMoreBtn.textContent= "Show More";
    }
}

 formEl.addEventListener("submit", (event)=>{
        event.preventDefault();
        page = 1;
        searchImages();
    });

    showMoreBtn.addEventListener("click", ()=>{
        searchImages();
    });

// Modal interactions
document.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.hasAttribute && target.hasAttribute("data-close")) {
        closeModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl.classList.contains("open")) {
        closeModal();
    }
});

if (modalDownloadBtn) {
    modalDownloadBtn.addEventListener("click", async () => {
        if (!currentResult) return;
        // Track download and then open the download link in a new tab
        trackDownload(currentResult);
        const directDownload = currentResult.links && currentResult.links.download;
        if (directDownload) {
            window.open(directDownload, "_blank", "noopener,noreferrer");
        }
    });
}