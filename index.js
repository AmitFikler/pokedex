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


submitBtn.addEventListener("click",async ()=> {
    let pokemonName = searchPoke.value.toLowerCase();
    updateDom(await getPokeInfo(pokemonName));
})



function updateDom(obj) {
    const pokeDiv =
    `<div id="pokeInfo">
        <span id="pokeId">${obj.id}</span> <br>
        <span id="pokeName">${obj.name}</span> <br>
        <span id="pokeHeight">height: ${obj.height}</span>
        <span id="pokeWeight">weight: ${obj.weight}</span> <br>
        type: <span id="pokeType">${obj.type}</span> <br>
    </div>
    <div id="poke-img">
        <img src="styles/images/pokeballgif.gif" id="pokeballImg" class="pokemonImg">  
    </div>`
    pokeInfo.innerHTML = pokeDiv; //there is pokeball gif
    changeToPokemon(obj);
    handleTypeClick(document.querySelectorAll(".types"));
    handleClickNameEvent();
}

function handleOverEvent(obj){
    document.getElementById("pokeImg").addEventListener("mouseenter", (e)=>{
        e.target.setAttribute("src", obj.imageBack) ;
    })
    document.getElementById("pokeImg").addEventListener("mouseleave", (e)=>{
        e.target.setAttribute("src", obj.imageFront) ;
    })
}

function handleClickNameEvent(){
    document.getElementById("pokeName").addEventListener("click",(e)=>{
        const name = e.target.innerText;
        searchPoke.value = name;
    })
}