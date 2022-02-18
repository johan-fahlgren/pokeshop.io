import { pokeHandler } from "./logic.js";
import "./util.js";

const pHandler = new pokeHandler();
printPokemonCards(pHandler.pokeUrl.href);

async function printPokemonCards(url: any) {
  await pHandler.fetchPokemonURL(url);
  const productsContainer = document.getElementById("Products");

  for (let pokemon of pHandler.pokemonObj) {
    const productCard = document.createElement("div");
    productCard.className="cardContainer";
    productCard.innerHTML=/* HTML */ 
    `
    <div class="card"> 
    <div class="cardHeader">
    <span>${pokemon.name.toUpperCase()}</span>
    <span>#${pokemon.id}</span>
    </div>
    <div class="cardImage">
    <img src="${pokemon.sprite}">
    </div>

    <div class="cardBody">
    <div>Type: ${pokemon.type.firstLetterUpper()}</div>
    </div>
    <div class="cardButtons">
    cardButtons
    </div>
    </div>`;


    productsContainer?.append(productCard);
  }

  /* ONCLICK */
  // fwd_btn.onClick = () => {
  // printPokemonCards(pHandler.getNextPage)};
}
