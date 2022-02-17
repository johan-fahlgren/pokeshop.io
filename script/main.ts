import {pokeHandler} from "./logic.js"

const pHandler=new pokeHandler();

load();
async function load(){
await pHandler.fetchPokemonURL(pHandler.pokeUrl.href).then(()=>{
    console.log(pHandler.pokemonObj);
}).then(()=>{
    console.log(pHandler.pokemonObj);
});
}
//console.log(pHandler.pokemonObj);
/* await load();
//console.log(pokemonObj);
//printPokemonCards();
console.log(pokemonObj[0]);
async function load(){
     onPageLoad().then(()=>{
        console.log(pokemonObj[0]);
     });
    
} */

function printPokemonCards(){   
for (let pokemon of pHandler.pokemonObj){
    
    //console.log(pokemon);
}}