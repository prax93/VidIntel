import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import fs from 'node:fs';
import path from 'node:path';
import jsonCreator from './jsonCreator.js';

let movies = []
let videoFiles = [];
const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.flv', '.wmv'];

export default {
    readMediaInfos,
    clear,
    getVideoMetaData
};

async function readMediaInfos(filePath) {
    try {
        await fileExporter(filePath);
        await videoReader();
        return movies;
    } catch (error) {
        console.error('Error reading media infos:', error);
        throw error;
    }
}

async function fileExporter(filePath) {
    const files = fs.readdirSync(filePath, {recursive: true});

        files.forEach(file => {
            const fullPath = path.join(filePath, file);
            const fileStat = fs.statSync(fullPath);
            if (fileStat.isFile() && videoExtensions.includes(path.extname(file).toLowerCase())) {
                videoFiles.push(fullPath);
            }
            else {
                console.info(`%s: is not a valid media file`, file)
            }
        });
}

async function videoReader() {
    await Promise.all(videoFiles.map(async (videoPath) => {
        try {
            const info = await ffprobe(videoPath, { path: ffprobeStatic.path });
            const mediaInfo = {
                "name": videoPath,
                "size": (fs.statSync(videoPath).size / 1024 / 1024 / 1024).toFixed(2),
                "resolution": info.streams.find(stream => stream.codec_type === 'video').width + "x" + info.streams.find(stream => stream.codec_type === 'video').height,
                "aspect-ratio": info.streams.find(stream => stream.codec_type === 'video').display_aspect_ratio,
                "codec": info.streams.find(stream => stream.codec_type === 'video').codec_long_name,
                "audio": info.streams
                    .filter(stream => stream.codec_type === 'audio')
                    .map(audio => ({
                        "language": audio.tags.language,
                        "channels": audio.channels,
                        "channgels-layout": audio.channel_layout,
                        "codec-name": audio.codec_name,
                        "profile": audio.profile
                    }))
            };
            movies.push(mediaInfo);
        } catch (err) {
            console.warn(err);
        }
    }));
    jsonCreator.writer('./movies.json', JSON.stringify(movies));
}

function getVideoMetaData() {
    return movies;
}

function clear(){
    movies = []
    videoFiles = []
}