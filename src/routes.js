const { Router } = require('express');

const routes = new Router();
const audioController = require('./app/controller/audio-controller');

routes.get('/', async (req, res) => {
    return res.status(200).json({ message: "Healthy!" })
})
.post('/podcast', audioController.createAudio)
.get('/podcast/:title', audioController.getAudio)

module.exports = routes;