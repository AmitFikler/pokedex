const express = require('express');
const app = express();
const cors = require('cors')
const pokemonRouter = require("./src/routers/pokemonRouter")
const userRouter = require('./src/routers/userRouter')
const handleUser = require("./src/middleware/userHandler")
const errorHandle = require("./src/middleware/errorHandler")
const path = require("path")
const port = 8080;



app.use(cors())

app.use(express.json())
app.use('/pokemon',handleUser,pokemonRouter)
app.use('/info', userRouter)
app.use(errorHandle)


app.use('/', express.static(path.resolve('./dist'))); // serve main path as static dir
app.get('/', function(req, res) { // serve main path as static file
  res.sendFile(path.resolve('./dist/index.html'))
});


app.listen(process.env.PORT || 8080,
  () => console.log("Server is running..."));



// P.getPokemonByName(34, function(response, error) { // with callback
//     if(!error) {
//       console.log(response);
//     } else {
//       console.log(error)
//     }
//   });
