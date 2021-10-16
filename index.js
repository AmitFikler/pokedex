const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';
const searchPoke = document.getElementById("searchPoke");
const submitBtn = document.getElementById("submitBtn");
const pokedex = document.getElementById("pokedex");
const pokeInfo = document.getElementById("pokemonInfo");


// async functions 
async function getPokeInfo(pokemonName) {
    try {
        const response = await axios.get(`${pokemonUrl}${pokemonName}`);
        return getPokemonObj(response.data);
    } catch (error) {
        alert("the pockemon doesnt exist!");
        return;
    }
}

async function getTypes(type){
    let arrOfPoke = [];
    const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
    for (let i of response.data.pokemon){
        arrOfPoke.push(i.pokemon.name);
    }
    return(arrOfPoke);
}

// Create a Pokemon object from the data we received

function getPokemonObj(data) {
    return {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        type: getPokemonTypes(data),
        imageFront: data.sprites.front_default,
        imageBack: data.sprites.back_default
    }
}