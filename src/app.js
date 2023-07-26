const express = require('express');
const routes = require('./routes')
const database = require('../database');
class App {
    constructor(){
        this.connection();
        this.server = express();
        this.middleware();
        this.routes();
    }

    middleware(){
        this.server.use(express.json());
    }

    routes(){
        this.server.use(routes)
    }

    connection(){
        database.init();
    }
}

module.exports = new App().server;