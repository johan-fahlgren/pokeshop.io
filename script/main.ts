import { pokeHandler } from "./logic.js";
import "./util.js";

const pHandler = new pokeHandler();
const pagination: HTMLElement | any = document.getElementById("pagination");
const productsContainer: HTMLElement | any =
  document.getElementById("Products");
const modalContainer: HTMLElement | any = document.getElementById("Modal");

printHeader();
printPokemonCards(pHandler.pokeUrl.href);

window.addEventListener("DOMContentLoaded", (event) => {
  const audio: any = document.querySelector("audio");
  audio.volume = 0.1;
  //audio.play();
  audio.loop = true;
});

function printHeader() {
  const headerContainer = document.getElementById("Header");

  const pageLogo = document.createElement("div");
  pageLogo.className = "pageLogo";

  const navContainer = document.createElement("div");
  navContainer.className = "navContainer";

  const audioControls = document.createElement("audio");
  audioControls.className = "audio";
  audioControls.src = "/audio/openingTheme.mp3";
  audioControls.setAttribute("type", "audio/mpeg");
  audioControls.controls = "controls";

  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "search");
  searchInput.setAttribute("placeholder", "Search Pokemon name or pokedex id.");
  searchInput.className = "searchInput";

  const submitBtn = document.createElement("button");
  submitBtn.innerText = "Search";
  submitBtn.className = "submitBtn";
  submitBtn.addEventListener("click", () => {
    searchHandler(searchInput.value);
  });

  headerContainer?.append(pageLogo, navContainer);
  navContainer.append(audioControls, searchInput, submitBtn);
}

//TODO Clear input.value after printModal()
async function searchHandler(searchValue: string | number) {
  const offsetNumber: any = await pHandler.searchPokemon(searchValue);

  if (offsetNumber === "NaN") {
    alert("The pokemon you are searching for doesn't exists. Try again!");
    return;
  }
  await printPokemonCards(
    `https://pokeapi.co/api/v2/pokemon?offset=${offsetNumber}&limit=12`
  );
  modalContainer.style.display = "block";
  printModal(
    0,    
    pHandler.speciesUrls[0],
    pHandler.pokemonObj[0].sprite,
    pHandler.pokemonObj[0].name
  );
}
//TODO - Fix missing abilities.
async function printPokemonCards(url: any) {
  pHandler.pokemonObj = [];
  pHandler.speciesUrls = [];
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
          <div class="circle"><img src="${pokemon.sprite}" /></div>
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
  AddEventInfoButton();
}

function AddEventInfoButton() {
  const allInfoButtons = document.querySelectorAll(".info_btn");

  allInfoButtons.forEach((infoBtn, index) => {
    infoBtn.addEventListener("click", () => {
      modalContainer.style.display = "block";
      console.log(index);
      printModal(
        index,
        pHandler.speciesUrls[index],
        pHandler.pokemonObj[index].sprite,
        pHandler.pokemonObj[index].name
      );
    });
  });
}

async function printModal(index:any, speciesUrl: any, image: string, name: string) {
  productsContainer.classList.add("modalOpen"); //TODO se til att allt utom modal blir suddigt

  pHandler.flavorTexts = [];
  //console.log(speciesUrl);
  await pHandler.fetchSpeciesData(speciesUrl);

  const closeDiv = document.createElement("div");
  closeDiv.className = "close_btn";
  closeDiv.textContent = "X";
  closeDiv.addEventListener("click", () => {
    modalContainer.style.display = "none";
    productsContainer.classList.remove("modalOpen");

    modalContainer.innerHTML = "";
  });

  //ModalBackground
  const modalBackgroundImage = document.createElement("div");
  modalBackgroundImage.className = "modalBackground";
  //modalBackgroundImage.src = "../images/pokedex.png";

  //Left Modal Div
  const modalDivLeft = document.createElement("div");
  modalDivLeft.className = "modalDivLeft";

  const modalImgDiv = document.createElement("img");
  modalImgDiv.src = image;

  //Right Modal Div
  const modalDivRight = document.createElement("div");
  modalDivRight.className = "modalDivRight";
  
  const modalHeadingDiv = document.createElement("div");
  modalHeadingDiv.className = "modalHeading";
  modalHeadingDiv.innerText = name.toUpperCase();

  const modalTextDiv = document.createElement("div");
  modalTextDiv.className = "modalText";
  modalTextDiv.innerText = pHandler.flavorTexts[0]; //bytte från flavorTexts[.slice(0,3)]

  const modalButtonsDiv=document.createElement("div");
  modalButtonsDiv.className="modalButtonsDiv";

  const modalPrevPokeBtn =document.createElement("button");
  modalPrevPokeBtn.innerText="<";
  modalPrevPokeBtn.addEventListener("click", ()=>{
    if(index===0){
      alert("No more PokeMons on this page.")
      return;
    }
    modalContainer.innerHTML="";
    printModal(index-1, pHandler.speciesUrls[index-1],
      pHandler.pokemonObj[index-1].sprite,
      pHandler.pokemonObj[index-1].name)
  });

  const modalNextPokeBtn =document.createElement("button");
  modalNextPokeBtn.innerText=">";
  modalNextPokeBtn.addEventListener("click", ()=>{
    if(index===11){
      alert("No more PokeMons on this page.")
      return;
    }
    modalContainer.innerHTML="";
    printModal(index+1, 
      pHandler.speciesUrls[index+1],
      pHandler.pokemonObj[index+1].sprite,
      pHandler.pokemonObj[index+1].name)
  });
  
  modalContainer.append(modalBackgroundImage);
  modalBackgroundImage.append(modalDivLeft, modalDivRight, closeDiv, modalButtonsDiv);
  modalDivLeft.append(modalImgDiv);
  modalDivRight.append(modalHeadingDiv, modalTextDiv);
  modalButtonsDiv.append(modalPrevPokeBtn, modalNextPokeBtn)
  //TODO fix this!
  /* modalContainer.addEventListener("click", function handler(event: any) {
    if (event.target.firstChild("modalBackground")) return;
      modalContainer.style.display = "none";
    
  }); */
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

  const btnFirstPage = document.createElement("button");
  btnFirstPage.id = "firstPage_btn";
  btnFirstPage.innerText = "<<";
  btnFirstPage.className = "btnActive";
  btnFirstPage.addEventListener("click", () => {
    printPokemonCards(`${pHandler.pokeUrl}&offset=0`);
  });

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

  const roundPageNumber = Math.round(pageNumber);
  const btnCurrent = document.createElement("button");
  btnCurrent.innerText = `${roundPageNumber + 1}`;
  btnCurrent.className = "btnCurrent";

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

  //TODO skapa rätt sida
  const btnLastPage = document.createElement("button");
  btnLastPage.id = "LastPage_btn";
  btnLastPage.innerText = ">>";
  btnLastPage.className = "btnActive";
  btnLastPage.addEventListener("click", () => {
    printPokemonCards(`${pHandler.pokeUrl}&offset=0`);
  });

  pagination?.append(
    btnFirstPage,
    btnPrevious,
    btnCurrent,
    btnNext,
    btnLastPage
  );
}
