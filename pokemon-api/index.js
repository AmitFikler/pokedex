const express = require('express');
const app = express();
const cors = require('cors')
const pokemonRouter = require("./src/routers/pokemonRouter")
const userRouter = require('./src/routers/userRouter')
const handleUser = require("./src/middleware/userHandler")
const errorHandle = require("./src/middleware/errorHandler")
const port = 8080;



app.use(cors())

app.use(express.json())
app.use('/pokemon',handleUser,pokemonRouter)
app.use('/info', userRouter)
app.use(errorHandle)


// start the server
app.listen(port, function() {
  console.log('app started');
});

// route our app
app.get('/', function(req, res) {
  res.send('hello world!');
});


// P.getPokemonByName(34, function(response, error) { // with callback
//     if(!error) {
//       console.log(response);
//     } else {
//       console.log(error)
//     }
//   });
