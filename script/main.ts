import { pokeHandler } from "./logic.js";
import "./util.js";

const pHandler = new pokeHandler();
printPokemonCards(pHandler.pokeUrl.href);

window.addEventListener("DOMContentLoaded", event => {
  const audio = document.querySelector("audio");
  audio.volume = 0.1;
  audio.play();
  audio.loop = true;
});



//TODO - Fix missing abilities. 
async function printPokemonCards(url: any) {
  await pHandler.fetchPokemonURL(url);
  const productsContainer = document.getElementById("Products");

  for (let pokemon of pHandler.pokemonObj) {   
    const themeColor = pHandler.typeColor[pokemon.type];
    const productCard = document.createElement("div");
    productCard.className="cardContainer";
    productCard.innerHTML=/* HTML */ 
    `
    <div class="card"> 
    <div class="cardHeader">
    <span>${pokemon.name.toUpperCase()}</span>
    <span>#${pokemon.id}</span>
    </div>
    <div class="cardImage" style="background-color: ${themeColor}">
    <img src="${pokemon.sprite}">
    </div>

    <div class="cardBody">
    <div class="pokeDetails">
    <span><b>Height:</b> ${pokemon.height}</span>
    <span><b>Weight:</b> ${pokemon.weight}</span>
    </div>
    <div class="pokeDetails2">
    <div><b>Type:</b> ${pokemon.type.firstLetterUpper()}</div>
    <div><b>Abilities:</b> ${pokemon.abilities[0].ability.name.firstLetterUpper()}</div> 
    </div> 
    <div class="price"><b>199 SEK</b></div>
    </div>    
    <div class="cardButtons">
    <button>More info</button>
    <button>Add to cart</button>
    </div>
    </div>`;


    productsContainer?.append(productCard);
  }

  /* ONCLICK */
  // fwd_btn.onClick = () => {
  // printPokemonCards(pHandler.getNextPage)};
}
