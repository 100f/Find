const express = require('express');

const ClientsController = require('./controller/ClientsController');
const AddressesController = require('./controller/AddressesController');


const routes = express.Router();

//Cliente

routes.post('/clients', ClientsController.create)
      .get('/clients', ClientsController.index)
      .get('/client/:id', ClientsController.show)
      .put('/client/:id', ClientsController.update)
      .delete('/client/:id', ClientsController.delete) 


//Endereço

routes.post('/address/:id', AddressesController.create)
      .get('/address/:id', AddressesController.show)
      .get('/address', AddressesController.index)
      
      

module.exports = routes;