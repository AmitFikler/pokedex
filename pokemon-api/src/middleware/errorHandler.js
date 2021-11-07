function errorHandlerPokemon(err, req, res, next){
    if (!err.status){
        res.status = 500
        res.send(err)
    }
    console.log(err)
    res.status(err.status)
    res.send(err.message)
}

module.exports = errorHandlerPokemon