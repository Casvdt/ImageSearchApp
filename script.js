const accesKey = "Nff6R1YdMewZK328mLY_sTR6Zp6kXXutO-AIKyoWXmY";
const formEl= document.querySelector("form");
const inputEl= document.getElementById("search-input");
const searchResultsEl= document.querySelector(".search-results");
const showMoreBtn= document.querySelector(".show-more-button");

let inputData="";
let page=1;

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
        page=1;
        searchImages();
    });

    showMoreBtn.addEventListener("click", ()=>{
        searchImages();
    });