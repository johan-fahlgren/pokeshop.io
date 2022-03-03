interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprite: string;
  abilities: [];
  type: string;
  speciesUrl: URL;
  price: number;
}

export class pokeHandler {
  pokemonObj: Pokemon[];
  pokemonList: URL[];
  speciesUrls: any[];
  flavorTexts: any[];
  cartItems: any[];
  prices: any[];
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
    this.pokemonList = [];
    this.flavorTexts = [];
    this.speciesUrls = [];
    this.cartItems = [];
    this.prices = ["99", "129", "159", "179", "199"];
    this.lastPageUrl = "https://pokeapi.co/api/v2/pokemon?offset=886&limit=12";
    this.offsetUrl = "https://pokeapi.co/api/v2/pokemon?offset=898&limit=12";

    /* POKEMON-API URL SETUP */
    this.pokeUrl = new URL("https://pokeapi.co");
    this.pokeUrl.pathname = "/api/v2/pokemon";
    this.pokeUrl.searchParams.set("limit", "12");
  }

  // Fetches a list with Pokemon URLs, and saves next and previous offset URLs.
  async fetchPokemonURL(pokeAPIUrl: string) {
    try {
      let urlData = await fetch(pokeAPIUrl).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw "Something went wrong, status: " + response.status;
        }
      });
      this.getNextPage = urlData.next;
      this.getPreviousPage = urlData.previous;
      this.pokemonList = urlData.results;
    } catch (error) {
      return error;
    }
    return this.getPokemonData(this.pokemonList);
  }

  // Iterates trough PokemonURLs and creates new pokemon objects.
  async getPokemonData(pokemonList: any[]) {
    for (let pokemon of pokemonList) {
      let pokemonData = await fetch(pokemon.url).then((response) => {
        return response.json();
      });
      const newPokemon: Pokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        height: pokemonData.height,
        weight: pokemonData.weight,
        sprite: pokemonData.sprites.other["official-artwork"].front_default,
        abilities: pokemonData.abilities,
        type: pokemonData.types[0].type.name,
        speciesUrl: pokemonData.species.url,
        price: this.getPrice(),
      };
      this.pokemonObj.push(newPokemon);
    }
  }
  // Fetches pokemon descriptions and iterates to get only english desc.
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

  // Returns pokemonId if user searches with name or number
  async getPokemonId(value: number | string) {
    if (typeof value !== "number") {
      const onePokeUrl = new URL("https://pokeapi.co");
      onePokeUrl.pathname = `/api/v2/pokemon/${value.toLowerCase()}`;

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

  // Dummy function to set random price on pokemons.
  getPrice(): number {
    return parseInt(
      this.prices[Math.floor(Math.random() * this.prices.length)]
    );
  }

  // Updates shopping cart button with current quantity.
  totalCartQty() {
    let totalQty: Number = 0;

    for (let item of this.cartItems) {
      totalQty += item.quantity;
    }

    return totalQty;
  }
}
