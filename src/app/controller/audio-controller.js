const crawling = require('../logic/crawling');
const synthesizer = require('../logic/synthesizer');
const { Audio } = require('../model/audio-model');
const { Binary } = require('mongodb');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const { Readable, PassThrough } = require('stream');

class AudioController {

    async createAudio(req, res) {
        try {

            const { url, source } = req.body;
            const {error, message } = crawling.setStrategy(source);
            if(error == true){
                return res.status(404).json({message});
            }
            const {title, text} = await crawling.executeStrategy({url});
            const fullText = text.join('');

            for (const piece of text) {
                const audioSynthesized = await synthesizer({ text: piece });
                const audio = new Audio({ title, audio: new Binary(audioSynthesized.AudioStream) });
                await audio.save();
            }

            return res.status(201).json({ title, text: fullText });
        } catch (error) {
            res.status(500).json({ message: "Somethin went wrong. Try again later" })
        }
    }

    async getAudio(req, res) {
        try {
            let { title } = req.params;
            const audios = await Audio.find({ title });
            const concatenatedAudioBuffer = Buffer.concat(audios.map(audio => audio.audio));
            if (!concatenatedAudioBuffer) {
                return res.status(404).send('Audio not found');
            }
            res.set('Content-Type', 'audio/mpeg');

            const audioStream = new Readable();
            audioStream.push(concatenatedAudioBuffer);
            audioStream.push(null);

            const concatenatedAudioStream = new PassThrough();

            ffmpeg(audioStream)
                .outputOptions('-acodec', 'copy')
                .format('mp3')
                .on('error', err => {
                    console.error('Error when joining the audios:', err);
                    res.status(500).send('Error when joining the audios.');
                })
                .on('end', () => {
                    concatenatedAudioStream.pipe(res);
                })
                .pipe(concatenatedAudioStream, { end: true });
            res.send(concatenatedAudioBuffer);

        } catch (error) {
            res.status(500).json({ message: "Somethin went wrong. Try again later" })
        }

    }

}

module.exports = new AudioController();