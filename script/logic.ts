"use strict";

const typeColor = {
    bug: "#26de81",
    dragon: "#ffeaa7",
    electric: "#fed330",
    fairy: "#FF0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#EFB549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190FF",
    Steel: "#b8b8d0" ,
    Dark: "#705848";
  };


/* POKEAPI URL SETUP */
const pokeUrl:any = new URL("https://pokeapi.co");
pokeUrl.pathname = "/api/v2/pokemon";
pokeUrl.searchParams.set("limit", 12);



export function onPageLoad () {
    
fetchPokemonURL(pokeUrl);

}


function fetchPokemonURL (pokeUrl) {    
fetch(pokeUrl)
.then((response) => {
if(response.ok)
{
    return response.json();
}
else
{
    throw "Something went wrong, status: " + response.status;
}
    
})
.then((urlData) => {       
    const getNextPage:string = urlData.next; 
    const getPreviousPage:string = urlData.previous;
    const pokemonList:object[] = urlData.results;         
    //paginationData(getNextPage, getPreviousPage);
    getPokemonData(pokemonList);
})
.catch((err) => console.log(err));
}  



function getPokemonData(pokemonList){

    const pokemonsObj = [];

    for(let pokemon of pokemonList){        
        fetch(pokemon.url)
        .then((response) => {        
            return response.json();})
        .then((pokemonData) => {         

            const pokemon = {
            id: pokemonData.id,
            name: pokemonData.name,
            height: pokemonData.height,
            weight: pokemonData.weight,
            sprite: pokemonData.sprites.front_default,
            abilities: pokemonData.abilities,
            type: pokemonData.types[0].type.name 
            };   
               
            pokemonsObj.push(pokemon);

        }) 

    }
    return pokemonsObj;   

}

function paginationData(getNextPage, getPreviousPage){

    //console.log(getNextPage);
    //console.log(getPreviousPage);

    throw new Error("function not implemented");
    return undefined;
};