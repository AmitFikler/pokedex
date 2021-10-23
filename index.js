
const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';
const searchPoke = document.getElementById("searchPoke");
const submitBtn = document.getElementById("submitBtn");
const pokedex = document.getElementById("pokedex");
const pokeInfo = document.getElementById("pokemonInfo");
const usernameInput = document.getElementById("username")
const catchListBtn = document.getElementById("catchListBtn")


let username = ""
usernameInput.addEventListener("keyup",()=>{
    username = usernameInput.value
})

catchListBtn.addEventListener("click",async () =>{
    let listId = await getPokemonsCatch()
    await showPokemons(listId)
    handleClickCatch()
})

async function showPokemons(arr) {
    document.getElementById("catch-pokemons").innerHTML = ""
    for (let id of arr){
        saveCatch(await getPokeInfo(id))
    }
}



async function getPokemonsCatch(){
    try {
        const response = await axios.get(`http://localhost:8080/pokemon/list`,
        {headers: {username: username}})
        return response.data
    } catch (error) {
        console.error(error)
    }
}

// async functions 
async function getPokeInfo(pokemonName) {
    try {
        if (typeof pokemonName === "number"){
        const response = await axios.get(`http://localhost:8080/pokemon/get/${pokemonName}`,
        {headers: {username: username}})
        return response.data
        }
        if (typeof pokemonName === "string") {
            const response = await axios.get(`http://localhost:8080/pokemon/query?name=${pokemonName}`,
            {headers: {username: username}})
            return response.data
        }
    } catch (error) {
        alert(error);
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


submitBtn.addEventListener("click",async ()=> {
    let pokemonName = searchPoke.value.toLowerCase();
    showPokemon(await getPokeInfo(pokemonName));
})



function showPokemon(obj) {
    const pokeDiv =
    `<div id="pokeInfo">
        <span id="pokeId">${obj.id}</span> <br>
        <span id="pokeName">${obj.name}</span> <br>
        <span id="pokeHeight">height: ${obj.height}</span>
        <span id="pokeWeight">weight: ${obj.weight}</span> <br>
        type: <span id="pokeType">${obj.types}</span> <br>
        abilities: <span id="pokeType">${obj.abilities}</span> <br>
    </div>
    <div id="poke-img">
        <img src="./images/pokeballgif.gif" id="pokeballImg" class="pokemonImg">  
    </div>
    <div>
        <button id = "catch-btn">Catch</button>
        <button id= "release-btn" >release</button>
    </div>
    `
    pokeInfo.innerHTML = pokeDiv; //there is pokeball gif
    changeFromPokeballToPoke(obj);
    handleTypeClick(document.querySelectorAll(".types"));
    handleClickNameEvent();
    console.log(document.getElementById("pokeId").innerText)
    document.getElementById("catch-btn").addEventListener("click",()=>{
        catchPokemon(document.getElementById("pokeId").innerText,obj)
    })
    document.getElementById("release-btn").addEventListener("click",()=>{
        releasePokemon(document.getElementById("pokeId").innerText)
    })
}


async function catchPokemon(pokemonId,obj){
    try {
        const response = await axios.put(`http://localhost:8080/pokemon/catch/${pokemonId}`,"",
        {headers:  {username: username}})
        saveCatch(obj)
        console.log(response)
    } catch (error) {
        console.error(error)
    }
}

function saveCatch(obj){
    const newPic = 
    `<img src="${obj.front_pic}" alt="${obj.name}" id=${obj.id}-catch class="savedPokemons">`
    const span = document.createElement("span")
    span.innerHTML = newPic
    
    document.getElementById("catch-pokemons").appendChild(span)
    handleClickCatch()
}

function deleteCatch(id){
    document.getElementById(`${id}-catch`).remove()
}

function handleClickCatch(){
    document.querySelectorAll(".savedPokemons").forEach((poke)=>{
        console.log(poke)
        poke.addEventListener("click", async ()=>{
            showPokemon(await getPokeInfo(poke.alt));
        })
    })
}




async function releasePokemon(Id){
    try {
        const response = await axios.delete(`http://localhost:8080/pokemon/release/${Id}`,
        {headers: {username: username}})
        console.log(response)
        deleteCatch(Id)
    } catch (error) {
        console.error(error);
    }
}

function handleOverEvent(obj){
    if (obj.imageBack !== null) {
    document.getElementById("pokeImg").addEventListener("mouseenter", (e)=>{
        e.target.setAttribute("src", obj.back_pic) ;
    })}
    document.getElementById("pokeImg").addEventListener("mouseleave", (e)=>{
        e.target.setAttribute("src", obj.front_pic) ;
    })
}

function handleClickNameEvent(){
    document.getElementById("pokeName").addEventListener("click",(e)=>{
        const name = e.target.innerText;
        searchPoke.value = name;
    })
}


// Create a Pokemon array of the same type
const getPokemonTypes = (data) => {
    let typesArr = [];
    for(let type of data.types){
        typesArr.push(`<span class="types">${type.type.name}</span>`);
    }
    return typesArr.join();
}

// Simulate a Pokemon coming out of a ball
function changeFromPokeballToPoke(obj){
    setTimeout(()=>{
        document.getElementById("pokeballImg").setAttribute("src",obj.front_pic);
        document.getElementById("pokeballImg").id = "pokeImg";
        handleOverEvent(obj);
    },1000);
}


// Create a drop down list

function handleTypeClick(obj) {
    obj.forEach(type =>{
        type.addEventListener("click",async (e) =>{
            const typ = e.target.innerText;
            makeSelectForm(typ,await getTypes(typ));       
        })
    })
}

function makeSelectForm(type,arr){
    if (document.getElementById("poke-select") !== null){
        document.getElementById("poke-select").remove();
    }
    selectForm = makeSelectEl(type);
    makeAOption(selectForm, `${type} pokemons`);
    arr.forEach(pokemon => {
        makeAOption(selectForm, pokemon);
    })
    document.querySelector("body").appendChild(selectForm);
    getValuefromForm();
}

function makeAOption(form,name){
    let pokeOption = document.createElement("option")
    pokeOption.setAttribute("value",name)
    pokeOption.textContent = name
    form.appendChild(pokeOption)
}

function makeSelectEl(type){
    let selectForm = document.createElement("select");
    selectForm.setAttribute("name", type);
    selectForm.setAttribute("id","poke-select");
    return selectForm;
}

function getValuefromForm(){
    const pokeSelect = document.getElementById("poke-select");
    pokeSelect.addEventListener("change",async () => {
            showPokemon(await getPokeInfo(pokeSelect.value));
            searchPoke.value = pokeSelect.value;
        })
}

// switching between Pokemon with up and down arrows
document.getElementById("upArrow").addEventListener("click",async()=>{
    if(document.getElementById("pokeId") === null || searchPoke.value == 898 || 
    searchPoke.value === "calyrex"){
        showPokemon(await getPokeInfo(1));
        searchPoke.value = 1;
    } else{
        let newPokemonId = Number(document.getElementById("pokeId").textContent) +1;
        searchPoke.value = newPokemonId;
        showPokemon(await getPokeInfo(newPokemonId));
    }
});

document.getElementById("downArrow").addEventListener("click",async()=>{
    if(searchPoke.value == 1 || searchPoke.value === "bulbasaur" || document.getElementById("pokeId") === null ){
        showPokemon(await getPokeInfo(898));
        searchPoke.value = 898;
    } else {
        let newPokemonId = Number(document.getElementById("pokeId").textContent) -1;
        searchPoke.value = newPokemonId;
        showPokemon(await getPokeInfo(newPokemonId));
    }
});
