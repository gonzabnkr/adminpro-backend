const express = require('express');
require ('dotenv').config();
const cors = require('cors')
const {dbConnection} = require ('./database/config')

//mean_user
//EUBXCdP31xukJPeD

//Crear server express
const app = express();

app.listen(process.env.PORT, ()=>{
    console.log('Server run on port '+process.env.PORT);
});
//base de datos
dbConnection();

//directori Public
app.use(express.static('public'))

//config CORS
app.use(cors())

//lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospital', require('./routes/hospital'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/uploads', require('./routes/uploads'));