const express = require('express');
require ('dotenv').config();
const cors = require('cors')
const {dbConnection} = require ('./database/config')

//mean_user
//EUBXCdP31xukJPeD

//Crear server express
const app = express();

//base de datos
dbConnection();

//config CORS
app.use(cors())

//Rutas
app.get( '/', (req,res)=>{
    res.json({
        ok:true,
        msg: "Hola mundo"
    })
} )

app.listen(process.env.PORT, ()=>{
    console.log('Server run on port '+process.env.PORT);
});