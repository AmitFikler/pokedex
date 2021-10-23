const express = require('express');
const app = express();
const pokemonRouter = require("./src/routers/pokemonRouter")
const userRouter = require('./src/routers/userRouter')
const port = 8080;


app.use('/pokemon',pokemonRouter)
app.use('/info', userRouter)


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
