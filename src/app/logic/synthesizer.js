require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: 'us-east-1', 
});


module.exports = async ({ text }) => {

    const polly = new AWS.Polly();
    const params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: 'Camila', 
    };

    const data = await polly.synthesizeSpeech(params).promise();

    return data;
}