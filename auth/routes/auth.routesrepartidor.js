const express = require('express');
const router = express.Router();
//MIDELWARES
const archivosRepartidor = require('../middleware/imagenrepartidor')
//CONTROLADORES
const userRepartidor = require('../controllers/auth.controllerRepartidor');


module.exports = (router) => {
  
    router.post('/registro-repartidor', archivosRepartidor, userRepartidor.createUserRep);//repartiyusels
    router.post('/login-repartidor', userRepartidor.loginRep);//repartiyusels
}