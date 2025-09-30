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
        image.alt= result.alt_description;
        const imageLink= document.createElement("a");
        imageLink.href= result.links.html;
        imageLink.target= "_blank";
        imageLink.textContent= result.alt_description;

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(imageLink);
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