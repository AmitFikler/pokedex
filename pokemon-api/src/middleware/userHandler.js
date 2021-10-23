function handleUser(req,res,next){
    const username = req.header("username")
    if(!username){
        throw {status:401, message: {error: "no user name"}}
    }
    next()
}

module.exports = handleUser
    
/*
{status:401, message: {error: "no user name"}}
{status:404, message: {error: "not found pokemons"}}
{status:500, message: {error: "server errors"}}
{status:403, message: {error: "releasing an uncaught pokemon, or catching an already caught pokemon"}}

*/