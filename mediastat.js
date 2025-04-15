import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import fs from 'node:fs';
import path from 'node:path';

let movies = []
let videoFiles = [];
const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.flv', '.wmv'];

export default {
    readMediaInfos,
    clear
};

function readMediaInfos(filePath) {
        
    fileExporter(filePath)
    videoReader()
    return movies;
}

function fileExporter(filePath) {
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

function videoReader() {
    videoFiles.forEach(videoPath => {
        ffprobe(videoPath, { path: ffprobeStatic.path }, function (err, info) {
            if (err) {
                console.err(err);
            } else {
                const mediaInfo = {
                    "name": videoPath,
                    "size": (fs.statSync(videoPath).size / 1024 / 1024 / 1024).toFixed(2),
                    "resolution": info.streams.find(stream => stream.codec_type === 'video').width + "x" + info.streams.find(stream => stream.codec_type === 'video').height,
                    "aspect-ratio": info.streams.find(stream => stream.codec_type === 'video').display_aspect_ratio,
                    "codec": info.streams.find(stream => stream.codec_type === 'video').codec_long_name,
                    "audio": [{
                        "channels": info.streams.find(stream => stream.codec_type === 'audio').channels,
                        "channel-layout": info.streams.find(stream => stream.codec_type === 'audio').channel_layout,
                        "codec": info.streams.find(stream => stream.codec_type === 'audio').codec_name
                    }]
                };
                movies.push(mediaInfo);
            }
        });
    })
}

function clear(){
    movies = []
    videoFiles = []
}