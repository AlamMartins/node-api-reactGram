require("dotenv").config()

const express = require('express')
const path = require("path")
const cors = require("cors")

const app = express()
const port = 4000


// app.listen(PORT, () => {
//   console.log(`API listening on PORT ${PORT} `)
// })

// // Configurando JSON e form data response
 app.use(express.json())
 app.use(express.urlencoded({extended:false}))

//Resolvendo CORS
// app.use(cors({credentials: true, origin: "http://localhost:3000"}));

 //Upload directory
//  app.use("/uploads", express.static(path.join(__dirname,"/uploads")))

 //DB connection - Conectando o banco de dados
//  require("./config/db")

// //routes
// // const router = require("./routes/Router.js")

// // app.use(router)
 

app.get('/', (req, res) => {
  res.send('Hey está é minha API e está rodando 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})

// Export the Express API
module.exports = app