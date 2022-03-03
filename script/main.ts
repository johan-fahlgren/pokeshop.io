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

// initialize PokeShop function.
function onLoad() {
  printHeader();
  printPokemonCards(pHandler.pokeUrl.href);
  popupCart.style.display = "none";

  const productText = document.createElement("div");
  productText.className = "productsText";
  mainElement?.prepend(productText);

  window.addEventListener("DOMContentLoaded", (event) => {
    const audio: any = document.querySelector("audio");
    audio.volume = 0.1;
    audio.play();
    audio.loop = true;
  });
}

//Creates DOM-elements in header
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
  audioControls.controls = true;

  const searchInputDiv = document.createElement("div");
  searchInputDiv.className = "searchInputDiv";
  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "search");
  searchInput.setAttribute("placeholder", "Search Pokémon name or pokeDex id.");
  searchInput.className = "searchInput";
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchHandler(searchInput.value);
    }
  });

  const submitBtn = document.createElement("button");
  submitBtn.className = "submitBtn";
  submitBtn.addEventListener("click", () => {
    searchHandler(searchInput.value);
  });

  const cartBtn = document.createElement("button");
  cartBtn.className = "cart_btn";
  cartBtn.addEventListener("click", () => {
    if (popupCart.style.display != "block") {
      printPopupCart();
    } else {
      popupCart.style.display = "none";
    }
  });

  const cartQty = document.createElement("div");
  cartQty.className = "cartQty";

  headerContainer?.append(pageLogo, navContainer);
  navContainer.append(audioControls, searchInputDiv, cartBtn);
  cartBtn.append(cartQty);
  searchInputDiv.append(searchInput, submitBtn);
}

//Takes searchValue and calls for printPokemonCards() and printModal()
//TODO Clear input.value after printModal().
async function searchHandler(searchValue: string | number) {
  const offsetNumber: number = await pHandler.getPokemonId(searchValue);

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
//Creates DOM-elements for pokemon/product cards
async function printPokemonCards(url: string) {
  pHandler.pokemonObj = [];
  pHandler.speciesUrls = [];
  productsContainer.innerHTML = "";
  pagination.innerHTML = "";

  let result = await pHandler.fetchPokemonURL(url);

  //Handle potential API-fetch problems.
  if (result !== undefined) {
    alert(
      "We're experiencing some problems right now. Our programming elves are working night and day to solve the problem. Please try again later!"
    );
  }

  let pokemonId = 0;

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
          <div class="price"><b>${pokemon.price} SEK</b></div>
          <div class="cardButtons">
            <button class="info_btn" id="info_btn${pokemonId}">
              More info
            </button>
            <button class="AddToCart_btn" id="cart_btn${pokemonId}">
              Add to cart
            </button>
          </div>
        </div>
      </div>`;

    pokemonId++;

    productsContainer?.append(productCard);
    pHandler.speciesUrls.push(pokemon.speciesUrl);
  });

  printPagination(url);
  AddEventInfoButton();
  AddEventAddToCartButton();
}

// Adds Click EventListeners to all "More info" buttons.
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

// Creates DOM-element for popup modal (More Info button).
async function printModal(
  index: any,
  speciesUrl: any,
  image: string,
  name: string
) {
  const productsHeadingElement: HTMLElement | any =
    document.querySelector(".productsText");
  productsContainer.classList.add("modalOpen");
  pagination.classList.add("modalOpen");
  productsHeadingElement?.classList.add("modalOpen");
  pHandler.flavorTexts = [];

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
  modalTextDiv.innerText = pHandler.flavorTexts[0];

  //Buttons to walk to previous and next pokemon in Pokedex
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
  modalElement.addEventListener(
    "click",
    function handler(this: any, event: any) {
      if (event.target.closest(".modalBackground") != null) return;
      modalElement.style.display = "none";
      productsContainer.classList.remove("modalOpen");
      pagination.classList.remove("modalOpen");
      productsHeadingElement.classList.remove("modalOpen");
      this.removeEventListener("click", handler);
    }
  );
}

// Creates pagination DOM
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

// Adds click EventListeners to "Add to cart" button
function AddEventAddToCartButton() {
  const allAddToCartButtons: NodeList =
    document.querySelectorAll(".AddToCart_btn");
  const cartQty: HTMLElement | null = document.querySelector(".cartQty");

  //TODO - LocalStorage implementation?
  allAddToCartButtons.forEach((cartBtn, index) => {
    cartBtn.addEventListener("click", () => {
      const newPokemon = pHandler.pokemonObj[index].deepCopy();

      if (pHandler.cartItems.length == 0) {
        pHandler.cartItems.push({
          pokemon: newPokemon,
          quantity: 1,
        });
        cartQty.innerHTML = `${pHandler.totalCartQty()}`;
        cartQty.classList.add("style");
        printPopupCart();
      } else {
        let i = pHandler.cartItems.findIndex(
          (obj) => obj.pokemon.name == newPokemon.name
        );
        if (i !== -1) {
          pHandler.cartItems[i].quantity += 1;
          let totalSum: number =
            parseInt(pHandler.cartItems[i].quantity) *
            parseInt(pHandler.pokemonObj[index].price);
          pHandler.cartItems[i].pokemon.price = totalSum;
          cartQty.innerHTML = `${pHandler.totalCartQty()}`;
        } else {
          pHandler.cartItems.push({
            pokemon: newPokemon,
            quantity: 1,
          });
          cartQty.innerHTML = `${pHandler.totalCartQty()}`;
        }
      }
      printPopupCart();
    });
  });
}

//TODO - Show total number of  same item.
// Creates cart modal DOM element
function printPopupCart() {
  popupCart.style.display = "block";
  let totalPriceCart: any = 0;
  popupCart.innerHTML = `<h2>Your PokéShop Cart</h2>
                      <h3>Added to Cart:</h3>`;

  for (let item of pHandler.cartItems) {
    popupCart.innerHTML += `<div>
      
      <div><p>${item.pokemon.name.toUpperCase()}</p></div>
      <div><p> Qty: ${item.quantity}</p></div>
      <div><p>${item.pokemon.price} SEK </p></div>
    </div>
  `;
    totalPriceCart += parseInt(item.pokemon.price);
  }
  popupCart.innerHTML += `<div>
<div><p><b>Total Sum:</p></div>
<div><p>${parseInt(totalPriceCart)} SEK</b></p></div>`;
}
