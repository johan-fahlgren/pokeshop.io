export class pokeHandler {
  pokemonObj: any[];
  speciesUrls: any[];
  flavorTexts: any[];
  pokeUrl: URL;
  lastPageUrl: string;
  offsetUrl: string;

  getNextPage: string = "";
  getPreviousPage: string = "";
  

  typeColor: any = {
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
    steel: "#b8b8d0",
    dark: "#705848",
  };

  constructor() {
    this.pokemonObj = [];
    this.flavorTexts = [];
    this.speciesUrls = [];
    this.lastPageUrl="https://pokeapi.co/api/v2/pokemon?offset=886&limit=12";
    this.offsetUrl="https://pokeapi.co/api/v2/pokemon?offset=898&limit=12";
    

    /* POKEMON-API URL SETUP */
    this.pokeUrl = new URL("https://pokeapi.co");
    this.pokeUrl.pathname = "/api/v2/pokemon";
    this.pokeUrl.searchParams.set("limit", "12");

    
  
  }

  async fetchPokemonURL(pokeUrl: string) {
    let urlData = await fetch(pokeUrl).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw "Something went wrong, status: " + response.status;
      }
    });
    console.log(pokeUrl)
    console.log(this.offsetUrl)
    console.log(this.lastPageUrl)
    console.log(urlData.next)

    this.getNextPage = urlData.next;
    this.getPreviousPage = urlData.previous;

    const pokemonList: any[] = urlData.results;
    return this.getPokemonData(pokemonList);
  }

  async getPokemonData(pokemonList: any[]) {
    for (let pokemon of pokemonList) {
      let pokemonData = await fetch(pokemon.url).then((response) => {
        return response.json();
      });
      const newPokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        height: pokemonData.height,
        weight: pokemonData.weight,
        sprite: pokemonData.sprites.other["official-artwork"].front_default,
        abilities: pokemonData.abilities,
        type: pokemonData.types[0].type.name,
        speciesUrl: pokemonData.species.url,
      };
      this.pokemonObj.push(newPokemon);
    }
  }

  async fetchSpeciesData(speciesUrl: any) {
    let speciesData = await fetch(speciesUrl).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw "Something went wrong, status: " + response.status;
      }
    });

    //TODO - Spara bara tre entrys
    speciesData.flavor_text_entries.forEach((entry: any) => {
      if (entry.language.name == "en") {
        this.flavorTexts.push(entry.flavor_text);
      }
    });
  }

  async searchPokemon(value: string | number) {
    const onePokeUrl = new URL("https://pokeapi.co");
    onePokeUrl.pathname = `/api/v2/pokemon/${value}`;

    if (typeof value !== "number") {
      let pokemonId = await fetch(onePokeUrl.href).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.status;
        }
      });
      value = pokemonId.id;
    }

    return `${value - 1}`;
  }
}
