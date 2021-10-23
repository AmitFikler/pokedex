const express = require("express")
const router = express.Router()
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const fs = require("fs");

// http://localhost:8080/pokemon/get/eevee
router.get('/get/:id', (req,res,next)=>{
    const id = req.params.id
    P.getPokemonByName(id, function(response, error) { // with callback
        if(!error) {
            res.send(getPokemonObj(response))
        } else {
            next({status:404, message: {error: "not found pokemons"}})
        }
    })
})
// http://localhost:8080/pokemon/query?name=eevee
router.get("/query", (req,res,next)=>{
    const pokemonName = req.query.name
    P.getPokemonByName(pokemonName, function(response, error) { // with callback
        if(!error) {
            res.send(getPokemonObj(response))
        } else {
            next({status:404, message: {error: "not found pokemons"}})
        }
    })
})


router.put('/catch/:id', (req,response,next)=>{
    const username = req.header('username')
    const pokemonId = req.params.id
    fs.readdir("./users", (err,res)=>{
        if(err){
            console.log(err)
            return
        }
        if (!res.includes(username)){
            fs.mkdirSync(`./users/${username}`)
        }
        createPokemonJson(pokemonId,`./users/${username}`,next,response)
    })
})

router.delete('/release/:id',(req,res,next)=>{
    const username = req.header('username')
    const pokemonId = req.params.id
    try {
        handleDelete(username,pokemonId)
        res.send("deleted")
    } catch (error) {
        next({status:403, message: {error: "releasing an uncaught pokemon, or catching an already caught pokemon"}})
    }
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

function createPokemonJson(id,userDir,next,response){
    fs.readdir(userDir,async (err,res)=>{
        if(err){
            console.error(err);
            return;
        }
        if(!res.includes(`${id}.json`)){
            const obj = await pokemonById(id)
            .then((res)=>res)
            fs.writeFileSync(`${userDir}/${id}.json`,JSON.stringify(obj))
            response.send("catch!")
        } else {
            next({status:403, message: {error: "releasing an uncaught pokemon, or catching an already caught pokemon"}})
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
    let dir = fs.readdirSync(`./users/${user}`)
        if (dir.includes(`${id}.json`)){
            fs.unlink(`./users/${user}/${id}.json`)
        } else{
            throw Error("you cant release pokemon you didnt catch")
        }
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