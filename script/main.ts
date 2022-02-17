import { pokeHandler } from "./logic.js";

const pHandler = new pokeHandler();
printPokemonCards(pHandler.pokeUrl.href);
    


async function printPokemonCards(url) {
  await pHandler.fetchPokemonURL(url)   

  for (let pokemon of pHandler.pokemonObj) {
    console.log(pokemon);
  }





  /* ONCLICK */
  // fwd_btn.onClick = () => {
  // printPokemonCards(pHandler.getNextPage)};
  
}
