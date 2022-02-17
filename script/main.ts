/* POKEAPI URL SETUP */
const pokeUrl = new URL("https://pokeapi.co");
pokeUrl.pathname = "/api/v2/";
pokeUrl.searchParams.set("pokemon", 1118);

fetch(pokeUrl)
.then((response) => {
    console.log(response);
    if(response.ok)
    {
        return response.json();
    }
    else
    {
        throw "Something went wrong, status: " + response.status;
    }
    
})
.then((jsonContent) =>{
    console.log(jsonContent);

})
.catch((err) => console.log(err));