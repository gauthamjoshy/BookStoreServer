// 7.  import dotenv
const dotenv = require("dotenv").config()

// 1.  import express
const express = require("express")

// 5.  IMport cors
const cors = require("cors")

// 8.  import routes
const router = require("./router")

// 10.  import connection file
require("./db/connection")

// 2.  create server
const bookStoreServer = express()

// 6. tell server  to use cors
bookStoreServer.use(cors())

// 10.  parse request
bookStoreServer.use(express.json())

// 9.  tell server to use router
bookStoreServer.use(router)

bookStoreServer.use(`/imgUploads`, express.static(`./imgUploads`))

// 3.  create port
const PORT = 3000

// 4.  tell server to listen
bookStoreServer.listen(PORT, ()=>{
    console.log(`BookStoreServer started running successfully at port number : ${PORT}`);
    
})

bookStoreServer.get("/", (req, res)=>{
    res.status(200).send(`BookStoreServer started running successfully`)
})

// bookStoreServer.post("/", (req, res)=>{
//     res.status(200).send("PORT REQUEST")
// })