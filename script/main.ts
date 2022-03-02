import { pokeHandler } from "./logic.js";
import "./util.js";

const pHandler = new pokeHandler();
const mainElement = document.querySelector("main");
const pagination: HTMLElement | any = document.getElementById("pagination");
const productsContainer: HTMLElement | any =
  document.getElementById("Products");
const modalElement: HTMLElement | any = document.getElementById("Modal");
const popupCart: HTMLElement | any = document.getElementById("PopupCart");

onLoad();

function onLoad() {
  printHeader();
  printPokemonCards(pHandler.pokeUrl.href);
  popupCart.style.display = "none";

  const productText = document.createElement("div");
  productText.className = "productsText";
  mainElement?.prepend(productText);
}

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

  const searchInputDiv = document.createElement("div");
  searchInputDiv.className = "searchInputDiv";
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "search");
  searchInput.setAttribute("placeholder", "Search Pokémon name or pokedex id.");
  searchInput.className = "searchInput";
  searchInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
      searchHandler(searchInput.value);
    }
  });

  const submitBtn = document.createElement("button");
  submitBtn.className = "submitBtn";
  submitBtn.addEventListener("click", () => {
    searchHandler(searchInput.value);
  });

  //TODO - Add on click event
  //Cart Button
  const cartBtn = document.createElement("button");
  cartBtn.className = "cart_btn";

  headerContainer?.append(pageLogo, navContainer);
  navContainer.append(audioControls, searchInputDiv, cartBtn);

  searchInputDiv.append(searchInput, submitBtn);
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
  modalElement.style.display = "block";
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

  let result = await pHandler.fetchPokemonURL(url);

  //Handle potential API-fetch problems. 
  if(result !== undefined){
    alert("We're experiencing some problems right now. Our programming elves are working night and day to solve the problem. Please try again later!")
  }

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
            <button class="AddToCart_btn" id="cart_btn${pokemonid}">
              Add to cart
            </button>
          </div>
        </div>
      </div>`;

    pokemonid++;

    productsContainer?.append(productCard);
    pHandler.speciesUrls.push(pokemon.speciesUrl);
  });

  printPagination(url);
  AddEventInfoButton();
  AddEventAddToCartButton();
}

function AddEventInfoButton() {
  const allInfoButtons = document.querySelectorAll(".info_btn");

  allInfoButtons.forEach((infoBtn, index) => {
    infoBtn.addEventListener("click", () => {
      modalElement.style.display = "block";
      printModal(
        index,
        pHandler.speciesUrls[index],
        pHandler.pokemonObj[index].sprite,
        pHandler.pokemonObj[index].name
      );
    });
  });
}

async function printModal(
  index: any,
  speciesUrl: any,
  image: string,
  name: string
) {
  const productsHeadingElement = document.querySelector(".productsText");
  productsContainer.classList.add("modalOpen");
  pagination.classList.add("modalOpen");
  productsHeadingElement?.classList.add("modalOpen");
  pHandler.flavorTexts = [];
  //console.log(speciesUrl);
  await pHandler.fetchSpeciesData(speciesUrl);

  const closeDiv = document.createElement("div");
  closeDiv.className = "close_btn";
  closeDiv.textContent = "X";
  closeDiv.addEventListener("click", () => {
    modalElement.style.display = "none";
    productsContainer.classList.remove("modalOpen");
    pagination.classList.remove("modalOpen");
    productsHeadingElement.classList.remove("modalOpen");

    modalElement.innerHTML = "";
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

  const modalButtonsDiv = document.createElement("div");
  modalButtonsDiv.className = "modalButtonsDiv";

  const modalPrevPokeBtn = document.createElement("button");
  modalPrevPokeBtn.innerText = "<";
  modalPrevPokeBtn.addEventListener("click", () => {
    if (index === 0) {
      alert("No more PokeMons on this page.");
      return;
    }
    modalElement.innerHTML = "";
    printModal(
      index - 1,
      pHandler.speciesUrls[index - 1],
      pHandler.pokemonObj[index - 1].sprite,
      pHandler.pokemonObj[index - 1].name
    );
  });

  const modalNextPokeBtn = document.createElement("button");
  modalNextPokeBtn.innerText = ">";
  modalNextPokeBtn.addEventListener("click", () => {
    if (index === 11) {
      alert("No more PokeMons on this page.");
      return;
    }
    modalElement.innerHTML = "";
    printModal(
      index + 1,
      pHandler.speciesUrls[index + 1],
      pHandler.pokemonObj[index + 1].sprite,
      pHandler.pokemonObj[index + 1].name
    );
  });

  modalElement.append(modalBackgroundImage);
  modalBackgroundImage.append(
    modalDivLeft,
    modalDivRight,
    closeDiv,
    modalButtonsDiv
  );
  modalDivLeft.append(modalImgDiv);
  modalDivRight.append(modalHeadingDiv, modalTextDiv);
  modalButtonsDiv.append(modalPrevPokeBtn, modalNextPokeBtn);

  //Removes modal on click outside of modalBackground
  modalElement.addEventListener("click", function handler(event: any) {
    if (event.target.closest(".modalBackground") != null) return;
    modalElement.style.display = "none";
    productsContainer.classList.remove("modalOpen");
    pagination.classList.remove("modalOpen");
    productsHeadingElement.classList.remove("modalOpen");
    this.removeEventListener("click", handler);
  });
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

  //First page button
  const btnFirstPage = document.createElement("button");
  btnFirstPage.id = "firstPage_btn";
  btnFirstPage.innerText = "<<";

  if (url != pHandler.pokeUrl) {
    btnFirstPage.className = "btnActive";
    btnFirstPage.addEventListener("click", () => {
      printPokemonCards(`${pHandler.pokeUrl}&offset=0`);
    });
  }

  //Previous page button
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

  //Current page button
  const roundPageNumber = Math.round(pageNumber);
  const btnCurrent = document.createElement("button");
  btnCurrent.innerText = `${roundPageNumber + 1}`;
  btnCurrent.className = "btnCurrent";

  //Next page button
  const btnNext = document.createElement("button");
  btnNext.id = "next_btn";
  btnNext.innerText = "Next";
  if (url != pHandler.lastPageUrl) {
    btnNext.addEventListener("click", () => {
      if (pHandler.getNextPage !== null) {
        printPokemonCards(pHandler.getNextPage);
      }
    });
    if (pHandler.getNextPage !== null) {
      btnNext.setAttribute("class", "btnActive");
    }
  }

  // Last page button
  const btnLastPage = document.createElement("button");
  btnLastPage.id = "LastPage_btn";
  btnLastPage.innerText = ">>";

  if (url != pHandler.lastPageUrl) {
    btnLastPage.className = "btnActive";
    btnLastPage.addEventListener("click", () => {
      printPokemonCards(pHandler.lastPageUrl);
    });
  }

  //Appending pagination elements
  pagination?.append(
    btnFirstPage,
    btnPrevious,
    btnCurrent,
    btnNext,
    btnLastPage
  );
}
function AddEventAddToCartButton() {
  const allAddToCartButtons = document.querySelectorAll(".AddToCart_btn");

  //TODO - only send pokemonObj.
  //TODO - Stack same pokemon in cart.
  //TODO - Show number of items in cart.
  //TODO - LocalStorage implementation?
  allAddToCartButtons.forEach((cartBtn, index) => {
    cartBtn.addEventListener("click", () => {
      popupCart.style.display = "block";
      pHandler.cartItems.push({
        pokeName: pHandler.pokemonObj[index].name,
        price: "199",
      });
      printPopupCart();
    });
  });
}

//TODO - Show total number of  same item.
function printPopupCart() {
  let totalPriceCart: any = 0;
  popupCart.innerHTML = `<h2>Your PokéShop Cart</h2>
                      <h3>Added to Cart:</h3>`;
  console.log(pHandler.cartItems);
  for (let cartItem of pHandler.cartItems) {
    popupCart.innerHTML += `<div>
      <div><p>${cartItem.pokeName.toUpperCase()}</p></div>
      <div><p>${cartItem.price} SEK </p></div>
    </div>
  `;
    totalPriceCart += parseInt(cartItem.price);
  }
  popupCart.innerHTML += `<div>
<div><p><b>Total Sum:</p></div>
<div><p>${parseInt(totalPriceCart)} SEK</b></p></div>`;
}
