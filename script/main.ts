import { pokeHandler } from "./logic.js";
import "./util.js";

const pHandler = new pokeHandler();
const pagination: HTMLElement | any = document.getElementById("pagination");
const productsContainer: HTMLElement | any =
  document.getElementById("Products");
const modalContainer: HTMLElement | any =
  document.getElementById("Modal");

printPokemonCards(pHandler.pokeUrl.href);

window.addEventListener("DOMContentLoaded", (event) => {
  const audio: any = document.querySelector("audio");
  audio.volume = 0.1;
  //audio.play();
  audio.loop = true;
});

//TODO - Fix missing abilities.
async function printPokemonCards(url: any) {
  pHandler.pokemonObj = [];
  productsContainer.innerHTML = "";
  pagination.innerHTML = "";
  await pHandler.fetchPokemonURL(url);
  let pokemonid = 0;

  await pHandler.pokemonObj.forEach((pokemon) => {
    const themeColor = pHandler.typeColor[pokemon.type];
    const productCard = document.createElement("div");
    productCard.className = "cardContainer";
    productCard.innerHTML =
      /* HTML */
      ` <div class="card">
        <div class="cardHeader">
          <span>${pokemon.name.toUpperCase()}</span>
          <span>#${pokemon.id}</span>
        </div>
        <div class="cardImage" style="background-color: ${themeColor}">
          <img src="${pokemon.sprite}" />
        </div>

        <div class="cardBody">
          <div class="pokeDetails">
            <span><b>Height:</b> ${pokemon.height}</span>
            <span><b>Weight:</b> ${pokemon.weight}</span>
          </div>
          <div class="pokeDetails2">
            <div><b>Type:</b> ${pokemon.type.firstLetterUpper()}</div>
            <div>
              <b>Abilities:</b>
              ${pokemon.abilities[0].ability.name.firstLetterUpper()}
            </div>
          </div>
          <div class="price"><b>199 SEK</b></div>
          <div class="cardButtons">
            <button class="info_btn" id="info_btn${pokemonid}">
              More info
            </button>
            <button id="cart_btn${pokemonid}">Add to cart</button>
          </div>
        </div>
      </div>`;

    pokemonid++;

    productsContainer?.append(productCard);
    pHandler.speciesUrls.push(pokemon.speciesUrl);
  });

  printPagination(url);

  const allInfoButtons = document.querySelectorAll(".info_btn");

  allInfoButtons.forEach((infoBtn, index) => {
    infoBtn.addEventListener("click", () => {
      
      productsContainer.classList.add("modalOpen");
      printModal(pHandler.speciesUrls[index], pHandler.pokemonObj[index].sprite);
    });
  });
}

async function printModal(speciesUrl: any, image:string) {
  pHandler.flavorTexts = [];
  console.log(speciesUrl);
  await pHandler.fetchSpeciesData(speciesUrl);
  
  const modalBackgroundImage=document.createElement("img");
  modalBackgroundImage.className="modalBackground";
  modalBackgroundImage.src="../images/pokedex.png"
  
  const modalDiv=document.createElement("div");
  modalDiv.className="modalDiv";

  const modalImgDiv=document.createElement("img");
  modalImgDiv.className="modalImg";
  modalImgDiv.src=image;

  const modalTextContainer=document.createElement("div");
  modalTextContainer.className="modalTextContainer";

  const modalHeadingDiv=document.createElement("div");
  modalHeadingDiv.className="modalHeading";
  modalHeadingDiv.innerText=pHandler.pokemonName.toUpperCase(); 

  const modalTextDiv=document.createElement("div");
  modalTextDiv.className="modalText";
  modalTextDiv.innerText=pHandler.flavorTexts[0]; //bytte från flavorTexts[.slice(0,3)]

  

  
  modalContainer.append(modalBackgroundImage, modalDiv);
  modalDiv.append(modalImgDiv, modalTextContainer);
  modalTextContainer.append(modalHeadingDiv, modalTextDiv);
  

}

function printPagination(url: any) {
  const startPosition = 41;
  const endPosition = url.search("&");
  let pageNumber = 0;
  if (endPosition !== -1) {
    pageNumber = url.slice(startPosition, endPosition) / 12;
  } else {
    console.warn("endPosition not found, but don't worry!");
  }
  const btnNext = document.createElement("button");
  btnNext.id = "next_btn";
  btnNext.innerText = "Next";
  btnNext.addEventListener("click", () => {
    if (pHandler.getNextPage !== null) {
      printPokemonCards(pHandler.getNextPage);
    }
  });
  if (pHandler.getNextPage !== null) {
    btnNext.setAttribute("class", "btnActive");
  }

  const btnCurrent = document.createElement("button");
  btnCurrent.innerText = `${pageNumber + 1}`;
  btnCurrent.className = "btnCurrent";

  const btnPrevious = document.createElement("button");
  btnPrevious.id = "prev_btn";
  btnPrevious.innerText = "Previous";
  btnPrevious.onclick = () => {
    if (pHandler.getPreviousPage !== null) {
      printPokemonCards(pHandler.getPreviousPage);
    }
  };

  if (pHandler.getPreviousPage !== null) {
    btnPrevious.setAttribute("class", "btnActive");
  }

  pagination?.append(btnPrevious);
  pagination?.append(btnCurrent);
  pagination?.append(btnNext);
}
