const express = require("express")
const router = express.Router()
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const fs = require("fs");


// http://localhost:8080/pokemon/get/eevee
router.get('/get/:id', (req,res)=>{
    const id = req.params.id
    // console.log(req.header("username"))
    P.getPokemonByName(id, function(response, error) { // with callback
        if(!error) {
            res.send(getPokemonObj(response))
        } else {
            console.log(error)
        }
    })
})
// http://localhost:8080/pokemon/query?name=eevee
router.get("/query", (req,res)=>{
    const pokemonName = req.query.name
    P.getPokemonByName(pokemonName, function(response, error) { // with callback
        if(!error) {
            res.send(getPokemonObj(response))
        } else {
            console.log(error)
        }
    })
})


router.put('/catch/:id', (req,res)=>{
    const username = req.header('username')
    const pokemonId = req.params.id
    handleCatch(username,pokemonId)
    res.send("hey")
})

router.delete('/release/:id',(req,res)=>{
    const username = req.header('username')
    const pokemonId = req.params.id
    handleDelete(username,pokemonId)
    res.send("deleted")
})


router.get('/',(req,res)=>{
    const username = req.header('username')
    handleGetPokemon(username)
    res.send("arr")

})

function getPokemonObj(data) {
    return {
        id: data.id,
        name: data.name,
        height: data.height,
        weight: data.weight,
        types: getPokemonTypes(data),
        front_pic: data.sprites.front_default,
        back_pic: data.sprites.back_default,
        abilities: getPokemonAbilities(data)
    }
}

const getPokemonTypes = (data) => {
    let typesArr = [];
    for(let type of data.types){
        typesArr.push(type.type.name);
    }
    return typesArr;
}

const getPokemonAbilities = (data) => {
    let abilitiesArr = [];
    for(let abilities of data.abilities){
        abilitiesArr.push(abilities.ability.name);
    }
    return abilitiesArr;
}


function handleCatch(user,id){
    fs.readdir("./users", (err,res)=>{
        if(err){
            console.log(err)
            return
        }
        if (!res.includes(user)){
            fs.mkdirSync(`./users/${user}`)
            createPokemonJson(id,`./users/${user}`)
            return
        }
        createPokemonJson(id,`./users/${user}`)
    })
}

function createPokemonJson(id,userDir){
    fs.readdir(userDir,async (err,res)=>{
        if(err){
            console.error(err);
            return;
        }
        if(!res.includes(`${id}.json`)){
            const obj = await pokemonById(id)
            .then((res)=>res)
            console.log(obj)
            fs.writeFileSync(`${userDir}/${id}.json`,JSON.stringify(obj))
        } else{
            console.log('pokemon already catch')
        }
    })
}
function pokemonById(id){
    return new Promise((resolve,reject) =>{
        resolve(
            P.getPokemonByName(id)
            .then((poke)=>{
                const pokeObject = getPokemonObj(poke)
                return pokeObject
            })
            .catch((err)=> console.error(err))
        )
    })
}

function handleDelete(user,id){
    fs.readdir(`./users/${user}`,(err,res)=>{
        if(err){
            console.error(err);
            return
        }
        if (res.includes(`${id}.json`)){
            fs.unlinkSync(`./users/${user}/${id}.json`)
        } else{
            console.log("you cant release pokemon you dont catch")
        }
    })

}

function handleGetPokemon(user){ 
    let pokemomarr = []
    let res = fs.readdirSync(`./users/${user}`)
        for (let file of res){
            let y = JSON.parse(fs.readFileSync(`./users/${user}/${file}`,"utf8"))
                pokemomarr.push(y.name)
        }
        return pokemomarr
}





module.exports = router